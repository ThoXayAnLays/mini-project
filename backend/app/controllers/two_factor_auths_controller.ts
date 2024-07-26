import type { HttpContext } from '@adonisjs/core/http'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import redis from '@adonisjs/redis/services/main'

export default class TwoFactorAuthsController {
  public async generateSecret({ auth, response }: HttpContext) {
    console.log('generate secret key')
    const user = await auth.authenticate()
    const secret = speakeasy.generateSecret({ length: 20 })

    await redis.setex(`2fa_temp_secret_${user.id}`, 600, secret.base32);

    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: `(${user.email})`,
      issuer: 'AdonisJS App ',
      encoding: 'ascii',
    })

    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl)
    // console.log('qrCodeUrl', qrCodeUrl)
    // console.log('secret', secret.base32)

    return response.json({ secret: secret.base32, qrCodeUrl })
  }

  public async validateToken({ request, auth, response }: HttpContext) {
    const user = await auth.authenticate();
    const { token } = request.all();
  
    const tempSecret = await redis.get(`2fa_temp_secret_${user.id}`);

    if (!tempSecret) {
      return response.unauthorized('2FA token has expired or was not generated.');
    }

    const isValid = speakeasy.totp.verify({
      secret: tempSecret,
      encoding: 'base32',
      token,
    });
  
    if (!isValid) {
      return response.unauthorized('Invalid 2FA token');
    }

    user.two_factor_secret = tempSecret;
    await user.save();

    await redis.del(`2fa_temp_secret_${user.id}`);
  
    return response.json({ message: '2FA validated successfully' });
  }
}
