import type { HttpContext } from '@adonisjs/core/http'
import Collection from '#models/collection'
import * as CollectionValidator from '#validators/collection'
import NFT from '#models/nft'

export default class CollectionsController {
  public async create({ request, response, auth }: HttpContext) {
    const payload = await CollectionValidator.addCollection.validate(
      request.only(['name', 'description'])
    )
    const user = await auth.authenticate()
    const collection = await Collection.create({ ...payload, creator_id: user.id })
    return response.created(collection)
  }

  public async getByOwner ({ auth, response, params} : HttpContext){
    const user = await auth.authenticate()
    console.log("user iD::", user.id);
    
    const collections = await Collection.query().where('creator_id', user.id).preload('creator').paginate(params.page, params.perPage)
    return response.ok({data:collections})
  }

  public async index({ response, params }: HttpContext) {
    const collections = await Collection.query()
      .preload('creator')
      .paginate(params.page, params.perPage)
    return response.ok(collections)
  }

  public async show({ params, response }: HttpContext) {
    const collection = await Collection.findOrFail(params.id)
    await collection.load('creator')
    const nfts = await collection.related('nfts').query().preload('owner')
    return response.ok({
      data: {
        collection,
        nfts,
      },
    })
  }

  public async update({ params, request, response }: HttpContext) {
    const collection = await Collection.findOrFail(params.id)
    const payload = await CollectionValidator.updateCollection.validate(request.body())
    collection.merge(payload)
    await collection.save()
    return response.ok(collection)
  }

  public async delete({ params, response }: HttpContext) {
    const collection = await Collection.findOrFail(params.id)
    await NFT.query().where('collection_id', collection.id)
    await collection.delete()
    return response.ok({message:"Delete success"})
  }
}
