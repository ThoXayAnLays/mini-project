import type { HttpContext } from '@adonisjs/core/http'
import NFT from '#models/nft'
import Collection from '#models/collection'
import {addNft, updateNft, } from '#validators/nft'
import Offer from '#models/offer'
import Bid from '#models/bid'
import cloudinary from '../../cloudinaryConfig.js'

interface INft {
  title: string;
  description: string;
  image_url: string;
  collection_id: string;
  metadata: string;
  sale_type: string;
  price: string;
}

export default class NftsController {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async uploadNftImage(file: any) {
    const result = await cloudinary.uploader.upload(file.tmpPath, {
      folder: "nfts",
    });
    return result.secure_url;
  }

  /**
   * @create
   * @requestBody <addNft>
   */
  public async create({ request, response, auth }: HttpContext) {
    const file = request.file('image_url')
    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let image_url;
    if (file) {
      image_url = await this.uploadNftImage(file);
    }
    const payload = await request.validateUsing(addNft)
    const user = await auth.authenticate()
    const collection = await Collection.findOrFail(payload.collection_id)
    if (collection.creator_id !== user.id) {
      return response.forbidden({ message: 'You are not authorized to create an NFT in this collection' })
    }
    const nft = await NFT.create({ ...payload, creator_id: user.id, owner_id: user.id, image_url: image_url })
    
    return response.created(nft)
  }

  public async index({ response, params }: HttpContext) {
    const nfts = await NFT.query()
      .preload('creator')
      .preload('owner')
      .preload('collection')
      .paginate(params.page, params.perPage)
    return response.ok(nfts)
  }

  public async show({ params, response }: HttpContext) {
    const nft = await NFT.findOrFail(params.id)
    await nft.load('creator')
    await nft.load('owner')
    await nft.load('collection')
    return response.ok(nft)
  }

  public async update({ params, request, response, auth }: HttpContext) {
    const nft = await NFT.findOrFail(params.id)
    const payload = await request.validateUsing(updateNft)
    const user = await auth.authenticate()
    const collection = await Collection.findOrFail(payload.collection_id)
    if (collection.creator_id !== user.id) {
      return response.forbidden({ message: 'You are not authorized to update this NFT in this collection' })
    }
    nft.merge(payload)
    await nft.save()
    return response.ok(nft)
  }

  public async delete({ params, response }: HttpContext) {
    const nft = await NFT.findOrFail(params.id)
    await nft.delete()
    return response.ok({ message: 'Delete success' })
  }
}
