import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Collection from '#models/collection'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const user = await User.all();
    const collections = [
      { name: 'Collection 1', description: 'Description 1', creator_id: user[0].id },
      { name: 'Collection 2', description: 'Description 2', creator_id: user[0].id },
      { name: 'Collection 3', description: 'Description 3', creator_id: user[1].id },
    ];
    await Collection.createMany(collections);
  }
}