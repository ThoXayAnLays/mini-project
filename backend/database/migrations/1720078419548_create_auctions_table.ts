import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'auctions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('nft_id').unsigned().references('id').inTable('nfts').onDelete('CASCADE')
      table.decimal('start_price', 12, 2).notNullable()
      table.decimal('highest_bid', 12, 2).defaultTo(0)
      table.boolean('is_ended').defaultTo(false)
      table.uuid('highest_bidder_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('auction_end').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}