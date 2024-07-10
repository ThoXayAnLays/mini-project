import type { HttpContext } from '@adonisjs/core/http'
import { Queue } from 'bullmq'
import { OtpService } from '#services/otp_service'
import { generateOTP } from '../utils/otp.js'
import Offer from '#models/offer'
import Auction from '#models/auction'
import Bid from '#models/bid'
import Transaction from '#models/transaction'
import NFT from '#models/nft'
// biome-ignore lint/style/useImportType: <explanation>
import User from '#models/user'
import { addOffer } from '#validators/offer'
import { inject } from '@adonisjs/core'
import { addBid } from '#validators/bid'
import { addAuction } from '#validators/auction'
import { DateTime } from 'luxon'

const emailQueue = new Queue('emails')

enum actionTypes {
  OFFER = 1,
  BID = 2,
  AUCTION = 3,
  ACCEPT = 4,
  REJECT = 5,
}

@inject()
export default class TransactionsController {
  constructor(
    protected nft: NFT,
    protected user: User
  ) {}

  public async sendOtp({ auth, response }: HttpContext) {
    const user = await auth.authenticate()

    const otp = generateOTP()
    OtpService.storeOtp(user.email, otp)
    await emailQueue.add('send_otp', { email: user.email, otp })
    response.send({ message: 'OTP sent to your email. ' })
  }

  public async verifyOtp({ auth, request, response, params }: HttpContext) {
    const user = await auth.authenticate()
    const { action } = params.only(['action'])
    const { otp, data } = request.only(['otp', 'data'])

    if (!OtpService.verifyOtp(user.email, otp)) {
      return response.badRequest('Invalid or expired OTP.')
    }

    switch (action) {
      case 1: {
        const createOffer = await addOffer.validate(data)
        await this.createOffer(user.id, createOffer)
        break
      }
      case 2: {
        const createBid = await addBid.validate(data)
        await this.createBid(user.id, createBid)
        break
      }
      case 3: {
        const createAuction = await addAuction.validate(data)
        await this.createAuction(user.id, createAuction)
        break
      }
      case 4:
        await this.acceptOffer(user.id, data)
        break
      case 5:
        await this.rejectOffer(user.id, data)
        break
      default:
        return response.badRequest('Invalid action.')
    }

    response.send({ message: 'Action completed successfully.' })
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async createOffer(userId: string, data: any) {
    const nft = await NFT.query().where('id', data.nft_id).firstOrFail()
    if (nft.sale_type !== 'offer') {
      throw new Error('NFT is for offer only!')
    }
    if (userId === (await NFT.query().where('id', data.nft_id).firstOrFail()).owner_id) {
      throw new Error('You cannot make an offer on your own item')
    }
    const offer = await this.user.related('offers').create({
      ...data,
      status: 'pending',
      offeror_id: userId,
    })
    await offer.save()
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async createBid(userId: string, data: any) {
    await NFT.query().where('id', data.nft_id).firstOrFail()
    if (userId === (await NFT.query().where('id', data.nft_id).firstOrFail()).owner_id) {
      throw new Error('You cannot make an bid on your own item')
    }
    const bid = await this.user.related('bids').create({
      ...data,
      status: 'pending',
      bidder_id: userId,
    })
    await bid.save()
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async createAuction(userId: string, data: any) {
    const nft = await NFT.query().where('id', data.nft_id).firstOrFail()
    if (nft.sale_type !== 'auction') {
      throw new Error('NFT is for auction only!')
    }
    if (userId !== (await NFT.query().where('id', data.nft_id).firstOrFail()).owner_id) {
      throw new Error('You cannot make an auction on others item')
    }

    const auction = await this.user.related('auctions').create({
      nft_id: data.nft_id,
      start_price: data.start_price,
      auction_end: DateTime.fromJSDate(data.auction_end),
    })
    await auction.save()
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async acceptOffer(userId: string, data: any) {
    const offer = await Offer.findOrFail(data.offer_id)
    offer.status = 'accepted'
    await offer.save()

    await TransactionsController.createTransaction({
      nft_id: offer.nft_id,
      buyer_id: offer.offeror_id,
      seller_id: userId,
      sale_price: offer.offer_amount,
    })
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async rejectOffer(userId: string, data: any) {
    const offer = await Offer.findOrFail(data.offer_id)
    offer.status = 'rejected'
    await offer.save()
  }

  static async endAuction(auctionId: string) {
    const auction = await Auction.findOrFail(auctionId)
    const highestBid = await Bid.query()
      .where('auction_id', auctionId)
      .orderBy('bid_amount', 'desc')
      .first()

    if (highestBid) {
      const nft = await NFT.findOrFail(auction.nft_id)
      nft.owner_id = highestBid.bidder_id
      await nft.save()

      await TransactionsController.createTransaction({
        nft_id: auction.nft_id,
        buyer_id: highestBid.bidder_id,
        seller_id: nft.owner_id,
        sale_price: highestBid.bid_amount,
      })
    }

    auction.is_ended = true
    await auction.save()
  }

  static async createTransaction(data: {
    nft_id: string
    buyer_id: string
    seller_id: string
    sale_price: number
  }) {
    const transaction = new Transaction()
    transaction.nft_id = data.nft_id
    transaction.buyer_id = data.buyer_id
    transaction.seller_id = data.seller_id
    transaction.sale_price = data.sale_price
    await transaction.save()
  }
}
