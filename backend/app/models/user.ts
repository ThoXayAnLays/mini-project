// biome-ignore lint/style/useImportType: <explanation>
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import NFT from '#models/nft'
import Collection from '#models/collection'
import Bid from '#models/bid'
import Transaction from '#models/transaction'
import Auction from '#models/auction'
import Offer from '#models/offer'
import { v4 as uuidv4 } from 'uuid'
import { JwtAccessTokenProvider, JwtSecret } from '#providers/jwt_access_token_provider'
import parseDuration from 'parse-duration'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare username: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare wallet_address: string

  @column()
  declare profile_picture: string

  @column()
  declare bio: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column()
  declare is_verified: boolean

  @column()
  declare two_factor_secret: string | null;

  @beforeCreate()
  public static async generateUuid (user: User) {
    user.id = uuidv4()
  }

  @hasMany(() => NFT, { foreignKey: 'creator_id' })
  declare createdNFTs: HasMany<typeof NFT>

  @hasMany(() => NFT, { foreignKey: 'owner_id' })
  declare ownedNFTs: HasMany<typeof NFT>

  @hasMany(() => Collection, { foreignKey: 'creator_id' })
  declare collections: HasMany<typeof Collection>

  @hasMany(() => Bid, { foreignKey: 'bidder_id' })
  declare bids: HasMany<typeof Bid>

  @hasMany(() => Transaction, { foreignKey: 'buyer_id' })
  declare purchases: HasMany<typeof Transaction>

  @hasMany(() => Transaction, { foreignKey: 'seller_id' })
  declare sales: HasMany<typeof Transaction>

  @hasMany(() => Offer, { foreignKey: 'offeror_id' })
  declare offers: HasMany<typeof Offer>

  @hasMany(() => Auction, { foreignKey: 'highest_bidder_id' })
  declare auctions: HasMany<typeof Auction>

  static accessTokens = JwtAccessTokenProvider.forModel(User, {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    expiresInMillis: parseDuration('1 day')!,
    key: new JwtSecret('BsdS-s9JFJTBwUsOo1Ml-qwdmnmnsiiNCS'),
    primaryKey: 'id',
    algorithm: 'HS256',
    audience: 'https://client.example.com',
    issuer: 'https://server.example.com',
  })
}