// biome-ignore lint/style/useImportType: <explanation>
import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'

export default class AuthAccessTokens extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare tokenableId: string

  @column()
  declare name: string

  @column()
  declare type: string

  @column()
  declare hash: string

  @column()
  declare abilities: string

  @column.dateTime()
  declare expiresAt?: DateTime

  @column.dateTime()
  declare lastUsedAt?: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (token: AuthAccessTokens) {
    token.id = uuidv4()
  }
}