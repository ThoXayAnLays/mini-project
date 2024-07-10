import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'smtp',

   /**
    * The mailers object can be used to configure multiple mailers
    * each using a different transport or same transport with different
    * options.
   */
  mailers: { 
    smtp: transports.smtp({
      host: env.get('SMTP_HOST'),
      port: env.get('SMTP_PORT'),
      auth: {
        user: env.get('SMTP_USERNAME') ?? '',
        pass: env.get('SMTP_PASSWORD') ?? '',
        type: 'login',
      }, 
    }),
		
    // ses: transports.ses({
    //   apiVersion: '2010-12-01',
    //   region: env.get('AWS_REGION'),
    //   credentials: {
    //     accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
    //     secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
    //   },
    //   sendingRate: 10,
    //   maxConnections: 5,
    // }),
		 
    // mailgun: transports.mailgun({
    //   key: env.get('MAILGUN_API_KEY'),
    //   baseUrl: 'https://api.mailgun.net/v3',
    //   domain: env.get('MAILGUN_DOMAIN'),
    // }),
		 
    // sparkpost: transports.sparkpost({
    //   key: env.get('SPARKPOST_API_KEY'),
    //   baseUrl: 'https://api.sparkpost.com/api/v1',
    // }),
		 
    // brevo: transports.brevo({
    //   key: env.get('BREVO_API_KEY'),
    //   baseUrl: 'https://api.brevo.com/v3',
    // }),
     
    // resend: transports.resend({
    //   key: env.get('RESEND_API_KEY'),
    //   baseUrl: 'https://api.resend.com',
    // }),
    
  },
  from: env.get('MAIL_FROM_ADDRESS'),
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}