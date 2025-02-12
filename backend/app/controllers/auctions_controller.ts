import type { HttpContext } from '@adonisjs/core/http'
import Auction from '#models/auction'

export default class AuctionsController {
    public async list({ response, params }: HttpContext) {
        const auctions = await Auction.query()
        .preload('nft', (query) => {
            query.preload('owner')
        })
        .preload('bids', (query) => {
            query.preload('bidder')
        })
        .preload('highest_bidder')
        .preload('creator')
        .paginate(params.perPage, params.page)
        response.json({code: 200, message: "Get all auctions successfully", data: auctions})
    }

    public async showItemOnList({ response, params }: HttpContext) {
        const auction = await Auction.query()
        .where('id', params.id)
        .preload('nft')
        .preload('bids')
        .preload('highest_bidder')
        .preload('creator')
        .first()
        response.json({code: 200, message: "Get auction successfully", data: auction})
    }
    
    public async index({ response, params }: HttpContext) {
        const auctions = await Auction.query()
        .where('auction_end', '>', new Date())
        .andWhere('is_ended', false)
        .preload('nft')
        .paginate(params.perPage, params.page)
        response.json({code: 200, message: "Get all auctions successfully", data: auctions})
    }
    
    public async show({ response, params }: HttpContext) {
        const auction = await Auction.query()
        .where('auction_end', '>', new Date())
        .andWhere('is_ended', false)
        .andWhere('nft_id', params.id)
        .preload('nft', (query) => {
            query.preload('owner')
        })
        .preload('nft', (query) => {
            query.preload('owner')
        })
        .paginate(params.perPage, params.page)
        response.json({code: 200, message: "Get all auctions by NFT successfully", data: auction})
    }

    public async auctionCreatedByUser({ response, params, auth }: HttpContext) {
        const user = await auth.authenticate()
        const auction = await Auction.query()
        .where('auction_end', '>', new Date())
        .andWhere('is_ended', false)
        .andWhere('creator_id', user.id)
        .preload('nft')
        .paginate(params.perPage, params.page)
        response.json({code: 200, message: "Get all auctions by Creator successfully", data: auction})
    }
}