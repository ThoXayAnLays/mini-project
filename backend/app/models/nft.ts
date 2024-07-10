// biome-ignore lint/style/useImportType: <explanation>
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'
import User from '#models/user'
import Collection from '#models/collection'
import Bid from '#models/bid'
import Transaction from '#models/transaction'
import Auction from '#models/auction'
import Offer from '#models/offer'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'


export default class Nft extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare image_url: string

  @column()
  declare metadata: string

  @column()
  declare creator_id: string

  @column()
  declare owner_id: string

  @column()
  declare collection_id: string

  @column()
  declare sale_type: string

  @column()
  declare price: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (nft: Nft) {
    nft.id = uuidv4()
  }

  @belongsTo(() => User, { foreignKey: 'creator_id' })
  public creator!: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'owner_id' })
  public owner!: BelongsTo<typeof User>

  @belongsTo(() => Collection, { foreignKey: 'collection_id' })
  public collection!: BelongsTo<typeof Collection>

  @hasMany(() => Bid, { foreignKey: 'nft_id' })
  public bids!: HasMany<typeof Bid>

  @hasMany(() => Offer, { foreignKey: 'nft_id' })
  public offers!: HasMany<typeof Offer>

  @hasMany(() => Auction, { foreignKey: 'nft_id' })
  public auctions!: HasMany<typeof Auction>

  @hasMany(() => Transaction, { foreignKey: 'nft_id' })
  public transactions!: HasMany<typeof Transaction>
}