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
    response.json({code: 200, message: 'OTP sent to your email.' })
  }

  public async verifyOtp({ auth, request, response }: HttpContext) {
    const action = Number.parseInt(request.input('action'))
    const user = await auth.authenticate()
    const { otp, data } = request.only(['otp', 'data'])

    if (!user || !user.email || !OtpService.verifyOtp(user.email, otp)) {
      return response.json({code: 400, message: 'Invalid or expired OTP.'})
    }

    switch (action) {
      case actionTypes.OFFER: {
        const createOffer = await addOffer.validate(data)
        const response = await this.createOffer(user.id, createOffer)
        if (response) {
          return response
        }
        break
      }
      case actionTypes.BID: {
        const createBid = await addBid.validate(data)
        const response = await this.createBid(user.id, createBid)
        if (response) {
          return response
        }
        break
      }
      case actionTypes.AUCTION: {
        const createAuction = await addAuction.validate(data)
        console.log('createAuction: ', createAuction);
        
        const response = await this.createAuction(user.id, createAuction)
        if (response) {
          return response
        }
        break
      }
      case actionTypes.ACCEPT: {
        const response = await this.acceptOffer(user.id, data)
        return response
      }
      case actionTypes.REJECT: {
        const response = await this.rejectOffer(user.id, data)
        if (response) {
          return response
        }
        break
      }
      default:
        return response.badRequest('Invalid action.')
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async createOffer(userId: string, data: any) {
    const offer = await Offer.query()
      .where('offeror_id', userId)
      .where('nft_id', data.nft_id)
      .first()
    if (!offer) {
      const nft = await NFT.query().where('id', data.nft_id).firstOrFail()
      if (nft.sale_type !== 'offer') {
        return { code: 400, message: 'NFT is for auction only!' }
      }
      if (userId === nft.owner_id) {
        return { code: 401, message: 'You cannot offer on your own NFT' }
      }
      const newOffer = await Offer.create({
        ...data,
        status: 'pending',
        offeror_id: userId,
      })
      await newOffer.save()
      return { code: 201, message: 'Offer created successfully' }
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      offer.offer_amount = data.offer_amount
      await offer.save()
      return { code: 200, message: 'Offer updated successfully' }
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async createBid(userId: string, data: any) {
    const auction = await Auction.query().where('id', data.auction_id).firstOrFail()
    if (auction.is_ended || auction.auction_end < DateTime.now()) {
      return { code: 400, message: 'Auction has ended' }
    }
    if(data.bid_amount < auction.start_price) {
      return { code: 406, message: 'Bid amount must be greater than the start price' }
    }
    const bid = await Bid.query()
      .where('bidder_id', userId)
      .where('auction_id', data.auction_id)
      .first()
    if (!bid) {
      if (userId === auction.creator_id) {
        return { code: 403, message: 'You cannot bid on your own auction' }
      }
      const newBid = await Bid.create({
        ...data,
        status: 'pending',
        bidder_id: userId,
      })
      await newBid.save()
      return { code: 201, message: 'Bid created successfully' }
    // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      bid.bid_amount = data.bid_amount
      await bid.save()
      return { code: 200, message: 'Bid updated successfully' }
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async createAuction(userId: string, data: any) {
    if(DateTime.fromISO(data.auction_end) < DateTime.now()) {
      return { code: 400, message: 'Auction end date must be in the future' }
    }
    const auction = await Auction.query().where('nft_id', data.nft_id).first()
    if (!auction) {
      const nft = await NFT.query().where('id', data.nft_id).firstOrFail()
      if (nft.sale_type !== 'auction') {
        return { code: 406, message: 'NFT is for offer only!' }
      }
      if (userId !== nft.owner_id) {
        return { code: 403, message: 'You cannot create an auction for an item you do not own' }
      }

      const newAuction = await Auction.create({
        creator_id: userId,
        nft_id: data.nft_id,
        start_price: data.start_price,
        auction_end: DateTime.fromISO(data.auction_end),
      })
      await newAuction.save()
      return { code: 201, message: 'Create new auction success' }
    // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      auction.creator_id = userId
      auction.start_price = data.start_price
      auction.auction_end = DateTime.fromISO(data.auction_end)
      await auction.save()
      return { code: 200, message: 'Update auction success' }
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async acceptOffer(userId: string, data: any) {
    const offer = await Offer.query().where('id', data.offer_id).preload('nft').firstOrFail()
    if(offer.status !== 'pending') {
      return { code: 406, message: 'Offer has already been accepted or rejected by the owner' }
    }
    if (offer.nft.owner_id !== userId) {
      return { code: 403, message: 'You are not the owner of this NFT.' }
    }
    offer.status = 'accepted'
    await offer.save()

    await NFT.query().where('id', offer.nft_id).update({ owner_id: offer.offeror_id })
    await Offer.query()
      .where('nft_id', offer.nft_id)
      .whereNot('id', offer.id)
      .update({ status: 'rejected' })

    await TransactionsController.createTransaction({
      nft_id: offer.nft_id,
      buyer_id: offer.offeror_id,
      seller_id: userId,
      sale_price: offer.offer_amount,
    })
    return { code: 200, message: 'Offer accepted successfully' }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async rejectOffer(userId: string, data: any) {
    const offer = await Offer.query().where('id', data.offer_id).preload('nft').firstOrFail()
    if(offer.status !== 'pending') {
      return { code: 406, message: 'Offer has already been accepted or rejected by the owner' }
    }
    if (offer.nft.owner_id !== userId) {
      return { code: 403, message: 'You are not the owner of this NFT.' }
    }

    offer.status = 'rejected'
    await offer.save()
    return { code: 200, message: 'Offer rejected successfully' }
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

      auction.highest_bid = highestBid.bid_amount
      auction.highest_bidder_id = highestBid.bidder_id
      await auction.save()

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
    return { code: 200, message: 'Auction ended successfully' }
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
    return { code: 201, message: 'Transaction created successfully' }
  }
}
