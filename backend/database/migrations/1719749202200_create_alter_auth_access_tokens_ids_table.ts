import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AlterAuthAccessTokensId extends BaseSchema {
  protected tableName = 'auth_access_tokens'

  public async up () {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    this.schema.alterTable(this.tableName, (table) => {
      table.uuid('new_id').defaultTo(this.raw('uuid_generate_v4()')).notNullable()

      this.defer(() => {
        this.db.from(this.tableName).update({ new_id: this.db.raw('uuid_generate_v4()') })
      })
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropPrimary()
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('id')
      table.renameColumn('new_id', 'id')
      table.primary(['id'])
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropPrimary()
      table.increments('id').primary().alter()
    })
  }
}
