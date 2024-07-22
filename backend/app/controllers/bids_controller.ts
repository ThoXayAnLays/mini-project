import type { HttpContext } from '@adonisjs/core/http'
import Bid from '#models/bid'

export default class BidsController {
  public async bidByUser({ auth, pagination, response }: HttpContext) {
    const user = await auth.authenticate()
    const bids = await Bid.query().where('bidder_id', user.id).preload('bidder').preload('auction').paginate(pagination.page, pagination.perPage)
    return response.json({code: 200, message: "Get all bids by Bidder successfully", data: bids})
  }

  public async bidByAuction({ params, pagination, response }: HttpContext) {
    const bids = await Bid.query().where('auction_id', params.id).preload('bidder').preload('auction').paginate(pagination.page, pagination.perPage)
    return response.json({code: 200, message: "Get all bids by Auction successfully",data: bids})
  }
}