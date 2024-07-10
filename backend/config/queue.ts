import { Queue, ConnectionOptions } from 'bullmq'
import redisConfig from './redis.js'

export const mailQueue = new Queue('emails', {
  connection: redisConfig.connection as ConnectionOptions,
})
