// biome-ignore lint/style/useImportType: <explanation>
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import NFT from '#models/nft'
import User from '#models/user'
import Bid from './bid.js'

export default class Auction extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nft_id: string

  @column()
  declare start_price: number

  @column()
  declare creator_id: string

  @column()
  declare highest_bid: number

  @column()
  declare highest_bidder_id: string

  @column.dateTime()
  declare auction_end: DateTime

  @column()
  declare is_ended: boolean

  @belongsTo(() => NFT, { foreignKey: 'nft_id' })
  declare nft: BelongsTo<typeof NFT>

  @belongsTo(() => User, { foreignKey: 'creator_id' })
  declare creator: BelongsTo<typeof User>

  @hasMany(() => Bid, { foreignKey: 'auction_id' })
  public bids!: HasMany<typeof Bid>

  @belongsTo(() => User, { foreignKey: 'highest_bidder_id' })
  declare highest_bidder: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (auction: Auction) {
    auction.id = uuidv4()
  }
}