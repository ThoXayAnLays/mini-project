// biome-ignore lint/style/useImportType: <explanation>
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import NFT from '#models/nft'
import { v4 as uuidv4 } from 'uuid'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Collection extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare creator_id: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'creator_id' })
  declare creator: BelongsTo<typeof User>

  @hasMany(() => NFT, { foreignKey: 'collection_id' })
  declare nfts: HasMany<typeof NFT>

  @beforeCreate()
  public static async generateUuid (collection: Collection) {
    collection.id = uuidv4()
  }
}