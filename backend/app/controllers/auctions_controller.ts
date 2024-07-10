import type { HttpContext } from '@adonisjs/core/http'
import Auction from '#models/auction'

export default class AuctionsController {
    public async index({ response }: HttpContext) {
        const auctions = await Auction.query()
        .where('auction_end', '<', new Date())
        .andWhere('is_ended', false)
        .preload('nft')
        response.send(auctions)
    }
    
    public async show({ response, params }: HttpContext) {
        const auction = await Auction.findOrFail(params.id)
        response.send(auction)
    }
}