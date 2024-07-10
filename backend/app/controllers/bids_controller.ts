import type { HttpContext } from '@adonisjs/core/http'
import Bid from '#models/bid'
import { addBid } from '#validators/bid'

export default class BidsController {
  public async create({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const payload = await addBid.validate(request.body())
    const bid = await Bid.create(payload)
    return response.created(bid)
  }

  public async index({ response, auth }: HttpContext) {
    
    const bids = await Bid.query().preload('bidder').preload('nft')
    return response.ok(bids)
  }

  public async show({ params, response }: HttpContext) {
    const bid = await Bid.findOrFail(params.id)
    await bid.load('bidder')
    await bid.load('nft')
    return response.ok(bid)
  }

  public async update({ params, request, response }: HttpContext) {
    const bid = await Bid.findOrFail(params.id)
    const payload = await addBid.validate(request.body())
    bid.merge(payload)
    await bid.save()
    return response.ok(bid)
  }

  public async delete({ params, response }: HttpContext) {
    const bid = await Bid.findOrFail(params.id)
    await bid.delete()
    return response.noContent()
  }
}
