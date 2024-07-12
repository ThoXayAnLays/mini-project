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
    console.log('OTP:', otp)

    await emailQueue.add('send_otp', { email: user.email, otp })
    response.send({ message: 'OTP sent to your email. ' })
  }

  public async verifyOtp({ auth, request, response }: HttpContext) {
    const action = Number.parseInt(request.input('action'))
    const user = await auth.authenticate()
    const { otp, data } = request.only(['otp', 'data'])

    if (!user || !user.email || !OtpService.verifyOtp(user.email, otp)) {
      return response.badRequest('Invalid or expired OTP.')
    }

    switch (action) {
      case actionTypes.OFFER: {
        const createOffer = await addOffer.validate(data)
        const response = await this.createOffer(user.id, createOffer)
        if (response?.message) {
          return response?.message
        }
        break
      }
      case actionTypes.BID: {
        const createBid = await addBid.validate(data)
        const response = await this.createBid(user.id, createBid)
        if (response?.message) {
          return response?.message
        }
        break
      }
      case actionTypes.AUCTION: {
        const createAuction = await addAuction.validate(data)
        const response = await this.createAuction(user.id, createAuction)
        if (response?.message) {
          return response?.message
        }
        break
      }
      case actionTypes.ACCEPT: {
        const response = await this.acceptOffer(user.id, data)
        if (response?.message) {
          return response?.message
        }
        break
      }
      case actionTypes.REJECT: {
        const response = await this.rejectOffer(user.id, data)
        if (response?.message) {
          return response?.message
        }
        break
      }
      default:
        return response.badRequest('Invalid action.')
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async createOffer(userId: string, data: any) {
    const nft = await NFT.query().where('id', data.nft_id).firstOrFail()
    if (nft.sale_type !== 'offer') {
      return { message: 'NFT is for auction only!' }
    }
    if (userId === (await NFT.query().where('id', data.nft_id).firstOrFail()).owner_id) {
      return { message: 'You cannot make an offer on your own item' }
    }
    const offer = await Offer.create({
      ...data,
      status: 'pending',
      offeror_id: userId,
    })
    await offer.save()
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async createBid(userId: string, data: any) {
    const auction = await Auction.query().where('id', data.auction_id).firstOrFail()
    if (userId === auction.nft.owner_id) {
      return { message: 'You cannot bid on your own auction' }
    }
    const bid = await Bid.create({
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
      return { message: 'NFT is for offer only!' }
    }
    if (userId !== (await NFT.query().where('id', data.nft_id).firstOrFail()).owner_id) {
      return { message: 'You cannot create an auction for an item you do not own' }
    }

    const auction = await Auction.create({
      nft_id: data.nft_id,
      start_price: data.start_price,
      auction_end: DateTime.fromJSDate(data.auction_end),
    })
    await auction.save()
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async acceptOffer(userId: string, data: any) {
    const offer = await Offer.findOrFail(data.offer_id)
    if (offer.nft.owner_id !== userId) {
      return { message: 'You are not the owner of this NFT.' }
    }
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
    if (offer.nft.owner_id !== userId) {
      return { message: 'You are not the owner of this NFT.' }
    }
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

      await Bid.query()
        .where('auction_id', auctionId)
        .whereNot('id', highestBid.id)
        .update({ status: 'rejected' })

      highestBid.status = 'accepted'
      await highestBid.save()

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
