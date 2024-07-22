import type { HttpContext } from '@adonisjs/core/http'
import Offer from '#models/offer'

export default class OffersController {
  public async index({ params, response }: HttpContext) {
    const offers = await Offer.query()
      .where('nft_id', params.id)
      .preload('nft')
      .preload('offeror')
      .paginate(params.page, params.perPage)
    return response.json({ code: 200, message: "Get all offers by NFT successfully", data: offers})
  }

  public async show({ params, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const offers = await Offer.query()
      .where('offeror_id', user.id)
      .preload('nft')
      .preload('offeror')
      .paginate(params.page, params.perPage)
    return response.json({ code: 200, message: "Get all offers by Offeror successfully", data: offers})
  }
}
