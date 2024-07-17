import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('nft_id').unsigned().references('id').inTable('nfts')
      table.uuid('seller_id').unsigned().references('id').inTable('users')
      table.uuid('buyer_id').unsigned().references('id').inTable('users')
      table.decimal('sale_price', 12, 2).notNullable()
      table.timestamp('transaction_date', { useTz: true }).defaultTo(this.now())
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}