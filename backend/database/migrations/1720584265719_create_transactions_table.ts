import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('nft_id').unsigned().references('id').inTable('nfts').onDelete('CASCADE')
      table.uuid('seller_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.uuid('buyer_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.decimal('sale_price', 12, 2).notNullable()
      table.timestamp('transaction_date', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}