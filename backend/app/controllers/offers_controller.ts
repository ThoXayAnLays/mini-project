import type { HttpContext } from '@adonisjs/core/http'
import Offer from '#models/offer'
import NFT from '#models/nft'
import { addOffer } from '#validators/offer'

export default class OffersController {
  public async index({ params, response }: HttpContext) {
    const offers = await Offer.query()
      .where('nft_id', params.id)
      .preload('nft')
      .preload('offeror')
      .paginate(params.page, params.perPage)
    return response.send(offers)
  }

  public async show({ params, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const offers = await Offer.query()
      .where('offeror_id', user.id)
      .preload('nft')
      .preload('offeror')
      .paginate(params.page, params.perPage)
    return response.send(offers)
  }

  // public async store({ request, response, auth }: HttpContext) {
  //   const data = request.only(['nft_id', 'offerPrice'])
  //   const validation = await addOffer.validate(data)

  //   if (!(await NFT.query().where('id', data.nft_id).firstOrFail())) {
  //     return response.status(404).send('Item not found')
  //   }

  //   const user = await auth.authenticate()
  //   if (user.id === (await NFT.query().where('id', validation.nft_id).firstOrFail()).owner_id) {
  //     return response.status(403).send('You cannot make an offer on your own item')
  //   }
  //   const offer = await user.related('offers').create({
  //     ...validation,
  //     status: 'pending',
  //     offeror_id: user.id,
  //   })

  //   return response.status(201).send(offer)
  // }

  // public async accept({ params, response, auth }: HttpContext) {
  //   const user = await auth.authenticate()
  //   const offer = await Offer.query().where('id', params.id).preload('nft').firstOrFail()

  //   if (offer.status !== 'pending') {
  //     return response.status(403).send('Offer is expired')
  //   }

  //   if (offer.nft.owner_id !== user.id) {
  //     return response.status(403).send({ error: 'Unauthorized' })
  //   }

  //   offer.status = 'accepted'
  //   await offer.save()

  //   return response.send(offer)
  // }

  // public async reject({ params, response, auth }: HttpContext) {
  //   const user = await auth.authenticate()
  //   const offer = await Offer.query().where('id', params.id).preload('nft').firstOrFail()

  //   if (offer.status !== 'pending') {
  //     return response.status(403).send('Offer is expired')
  //   }

  //   if (offer.nft.owner_id !== user.id) {
  //     return response.status(403).send({ error: 'Unauthorized' })
  //   }

  //   offer.status = 'rejected'
  //   await offer.save()

  //   return response.send(offer)
  // }
}
