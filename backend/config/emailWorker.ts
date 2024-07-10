import { ConnectionOptions, Worker } from 'bullmq'
import mail from '@adonisjs/mail/services/main'
import redisConfig from './redis.js'

new Worker(
  'emails',
  async (job) => {
    console.log('Processing job:', job.id)
    if (job.name === 'send_email') {
      const { mailMessage, config, mailerName } = job.data

      try {
        await mail.use(mailerName).sendLater(mailMessage, config)
        console.log('Email sent:', job.id)
      } catch (error) {
        console.error('Error sending email:', error)
      }
    }
  },
  {
    connection: redisConfig.connection as ConnectionOptions,
  }
)
