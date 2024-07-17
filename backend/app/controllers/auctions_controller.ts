import type { HttpContext } from '@adonisjs/core/http'
import Auction from '#models/auction'

export default class AuctionsController {
    public async index({ response, params }: HttpContext) {
        const auctions = await Auction.query()
        .where('auction_end', '>', new Date())
        .andWhere('is_ended', false)
        .preload('nft')
        .paginate(params.perPage, params.page)
        response.send(auctions)
    }
    
    public async show({ response, params }: HttpContext) {
        const auction = await Auction.query()
        .where('auction_end', '>', new Date())
        .andWhere('is_ended', false)
        .andWhere('nft_id', params.id)
        .preload('nft')
        .paginate(params.perPage, params.page)
        response.send(auction)
    }

    public async auctionCreatedByUser({ response, params, auth }: HttpContext) {
        const user = await auth.authenticate()
        const auction = await Auction.query()
        .where('auction_end', '>', new Date())
        .andWhere('is_ended', false)
        .andWhere('creator_id', user.id)
        .preload('nft')
        .paginate(params.perPage, params.page)
        response.send(auction)
    }
}