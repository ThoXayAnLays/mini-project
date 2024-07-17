import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerUser, loginUser, updateInfo } from '#validators/user'
import { SendOtpValidator, VerifyOtpValidator, ResetPasswordValidator } from '#validators/mail'
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { randomBytes } from 'crypto'
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { promisify } from 'util'
import {generateOTP} from '../utils/otp.js'
import mail from '@adonisjs/mail/services/main'
import { OtpService } from '#services/otp_service'
import { mailQueue } from '#config/queue'
import speakeasy from 'speakeasy'
import { Queue } from 'bullmq'
import cloudinary from '../../cloudinaryConfig.js'
const emailQueue = new Queue('emails')

export default class UsersController {
  /**
   * @register
   * @requestBody <registerUser>
   */ 
  public async register({ request, response }: HttpContext) {
    const validation = await request.validateUsing(registerUser) 
    const user = await User.create(validation)
    await this.sendOtpToEmail(user.email)
    await User.accessTokens.create(user)
    return response.created({ message: 'Register successfully. Please verify your email.' })
  }

  /**
   * @login
   * @requestBody <loginUser>
   */
  public async login({ request, response }: HttpContext) {
    const validate = await loginUser.validate(request.body())
    const token = request.body().token
    const user = await User.verifyCredentials(validate.email, validate.password)
    if(user.is_verified === false){
      return response.badGateway({ message: 'Email is not verified'})
    }

    const tokenAuth = await User.accessTokens.create(user)

    if (user.two_factor_secret) {
      const isValid = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: 'base32',
        token: token,
      });

      if (!isValid) {
        return response.abort({message:'Invalid 2FA token'});
      }
    }

    return response.json({ token: tokenAuth });
  }

  async logout({ auth }: HttpContext) {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const user = auth.user!
    //await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return { message: 'success' }
  }

  async me({ auth }: HttpContext) {
    await auth.check()
    return {
      user: auth.user,
    }
  }

  async updateProfile({ auth, request }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(updateInfo)
    const file = request.file("profile_picture", {
      size: '2mb',
      extnames: ['jpg', 'png', 'pdf'],
    });

    if(file){
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const result = await cloudinary.uploader.upload(file?.tmpPath!, {
        folder: "avatars",
      });
      user.profile_picture = result.secure_url;
    }
  
    user.merge(data);
    await user.save();
  
    return { status: "SUCCESS", message: "User information updated successfully", data: user };
  }

  public async sendOtpToEmail(email: string) {
    const otp = await generateOTP()
    //const otp = (await promisify(randomBytes)(3)).toString('hex').toUpperCase()
    console.log('OTP: ', otp);
    console.log('Email: ', email);
    
    OtpService.storeOtp(email, otp)

    // const mailMessage = {
    //   to: {email},
    //   from: 'no-reply@example.com',
    //   subject: 'OTP Verification',
    //   htmlView: `emails/otp${otp}`

    // } 
    // await emailQueue.add('send_email', {
    //   mailMessage,
    //   config: {}, // Add any additional mail config if necessary
    //   mailerName: 'smtp', // or any other mailer you have configured
    // })

    await mail.use('smtp').sendLater((message) => {
      message
        .to(email)
        .from('no-reply@example.com')
        .subject('OTP Verification')
        .htmlView('emails/otp', { otp } )
    })
    console.log('Send email successfully')
  }

  public async sendOtp({ request, response }: HttpContext) {
    const payload = await SendOtpValidator.validate(request.body())
    await this.sendOtpToEmail(payload.email)
    return response.ok({ message: 'OTP sent successfully' })
  }

  public async verifyOtp({ request, response }: HttpContext) {
    const payload = await VerifyOtpValidator.validate(request.body())
    const isValidOtp = OtpService.verifyOtp(payload.email, payload.otp)

    if (!isValidOtp) {
      return response.badRequest({ message: 'Invalid or expired OTP' })
    }

    const user = await User.findByOrFail('email', payload.email)
    if(user.is_verified === true){
      return response.badRequest({ message: 'Email is verified' })
    }
    user.is_verified = true
    await user.save()

    return response.ok({ message: 'Email verified successfully' })
  }

  public async forgotPassword({ request, response }: HttpContext) {
    const payload = await SendOtpValidator.validate(request.body())
    await this.sendOtpToEmail(payload.email)
    return response.ok({ message: 'OTP sent successfully' })
  }

  public async resetPassword({ request, response }: HttpContext) {
    const payload = await ResetPasswordValidator.validate(request.body())
    const isValidOtp = OtpService.verifyOtp(payload.email, payload.otp)

    if (!isValidOtp) {
      return response.badRequest({ message: 'Invalid or expired OTP' })
    }

    const user = await User.findByOrFail('email', payload.email)
    user.password = payload.password
    await user.save()

    return response.ok({ message: 'Password reset successfully' })
  }
}
