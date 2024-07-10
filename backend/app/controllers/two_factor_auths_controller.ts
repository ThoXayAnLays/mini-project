import type { HttpContext } from '@adonisjs/core/http'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import User from '#models/user'

export default class TwoFactorAuthsController {
  public async generateSecret({ auth, response }: HttpContext) {
    console.log('generate secret key')
    const user = await auth.authenticate()
    const secret = speakeasy.generateSecret({ length: 20 })

    user.two_factor_secret = secret.base32
    await user.save()

    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: `AdonisJS App (${user.email})`,
      issuer: 'AdonisJS App ',
      encoding: 'ascii',
    })

    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl)
    console.log('qrCodeUrl', qrCodeUrl)
    console.log('secret', secret.base32)

    return response.json({ secret: secret.base32, qrCodeUrl })
  }

  public async validateToken({ request, auth, response }: HttpContext) {
    const user = await auth.authenticate();
    const { token } = request.all();
  
    const isValid = speakeasy.totp.verify({
      secret: user.two_factor_secret || '',
      encoding: 'base32',
      token,
    });
  
    if (!isValid) {
      return response.unauthorized('Invalid 2FA token');
    }
  
    return response.json({ message: '2FA validated successfully' });
  }
}
