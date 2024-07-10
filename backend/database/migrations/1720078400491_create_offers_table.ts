

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'offers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('nft_id').unsigned().references('id').inTable('nfts').onDelete('CASCADE')
      table.uuid('offeror_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.decimal('offer_amount', 12, 2).notNullable()
      table.string('status').defaultTo('pending')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}