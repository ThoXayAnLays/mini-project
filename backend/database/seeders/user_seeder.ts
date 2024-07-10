import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#database/factories/user_factory'
import hash from '@adonisjs/core/services/hash'
export default class extends BaseSeeder {
  async run() {
    hash.fake()
    await UserFactory.createMany(10)
    hash.restore()
  }
}