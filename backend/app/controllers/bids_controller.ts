import type { HttpContext } from '@adonisjs/core/http'
import Bid from '#models/bid'
import { addBid } from '#validators/bid'

export default class BidsController {
  public async bidByUser({ auth, pagination }: HttpContext) {
    const user = await auth.authenticate()
    const bids = await Bid.query().where('bidder_id', user.id).preload('bidder').preload('auction').paginate(pagination.page, pagination.perPage)
    return {code: 200, data: bids}
  }

  public async bidByAuction({ params, pagination }: HttpContext) {
    const bids = await Bid.query().where('auction_id', params.id).preload('bidder').preload('auction').paginate(pagination.page, pagination.perPage)
    return {code: 200, data: bids}
  }
}
