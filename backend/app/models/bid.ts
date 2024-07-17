// biome-ignore lint/style/useImportType: <explanation>
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Auction from '#models/auction'

export default class Bid extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare auction_id: string

  @column()
  declare bidder_id: string

  @column()
  declare bid_amount: number

  @column()
  declare status: 'pending' | 'accepted' | 'rejected'

  @belongsTo(() => Auction, { foreignKey: 'auction_id' })
  public auction!: BelongsTo<typeof Auction>

  @belongsTo(() => User, { foreignKey: 'bidder_id' })
  public bidder!: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (bid: Bid) {
    bid.id = uuidv4()
  }
}