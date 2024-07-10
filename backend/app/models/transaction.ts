// biome-ignore lint/style/useImportType: <explanation>
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import NFT from '#models/nft'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nft_id: string

  @column()
  declare seller_id: string

  @column()
  declare buyer_id: string

  @column()
  declare sale_price: number

  @column.dateTime({ autoCreate: true })
  declare transaction_date: DateTime

  @belongsTo(() => NFT, { foreignKey: 'nft_id' })
  public nft!: BelongsTo<typeof NFT>

  @belongsTo(() => User, { foreignKey: 'seller_id' })
  public seller!: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'buyer_id' })
  public buyer!: BelongsTo<typeof User>

  @beforeCreate()
  public static async generateUuid (transaction: Transaction) {
    transaction.id = uuidv4()
  }
}