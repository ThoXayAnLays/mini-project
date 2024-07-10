// biome-ignore lint/style/useImportType: <explanation>
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import NFT from '#models/nft'
import { v4 as uuidv4 } from 'uuid'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Offer extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nft_id: string

  @column()
  declare offeror_id: string

  @column()
  declare offer_amount: number

  @column()
  declare status: 'pending' | 'accepted'| 'rejected'

  @belongsTo(() => NFT, { foreignKey: 'nft_id' })
  public nft!: BelongsTo<typeof NFT>

  @belongsTo(() => User, { foreignKey: 'offeror_id' })
  declare offeror: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (offer: Offer) {
    offer.id = uuidv4()
  }
}