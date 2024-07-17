import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'nfts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.string('image_url').notNullable()
      table.text('metadata').notNullable()
      table.uuid('creator_id').unsigned().references('users.id')
      table.uuid('owner_id').unsigned().references('id').inTable('users')
      table.uuid('collection_id').unsigned().references('id').inTable('collections')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
      table.enum('sale_type', ['buy_now', 'auction', 'offer']).notNullable()
      table.decimal('price', 12, 2)
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}