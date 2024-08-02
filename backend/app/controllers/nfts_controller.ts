import type { HttpContext } from '@adonisjs/core/http'
import NFT from '#models/nft'
import Collection from '#models/collection'
import {addNft, updateNft, } from '#validators/nft'
import cloudinary from '../../cloudinaryConfig.js'

export default class NftsController {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async uploadNftImage(file: any) {
    const result = await cloudinary.uploader.upload(file.tmpPath, {
      folder: "nfts",
      crop: "fill",
      width: 500,
      height: 500
    });
    return result.secure_url;
  }

  /**
   * @create
   * @requestBody <addNft>
   */
  public async create({ request, response, auth }: HttpContext) {
    const file = request.file('image_url');
    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let image_url;
    if (file) {
      image_url = await this.uploadNftImage(file);
    } else {
      // Handle case where image_url is passed as a URL
      image_url = request.input('image_url');
    }
    const payload = await request.validateUsing(addNft);
    const user = await auth.authenticate();
    const collection = await Collection.findOrFail(payload.collection_id);
    if (collection.creator_id !== user.id) {
      return response.forbidden({ message: 'You are not authorized to create an NFT in this collection' });
    }
    const nft = await NFT.create({ ...payload, creator_id: user.id, owner_id: user.id, image_url: image_url });
    await nft.load('owner');
    await nft.load('creator');
    return response.json({code: 201, message: "Create nft successfully", data: nft});
  }
  
  public async update({ params, request, response, auth }: HttpContext) {
    const file = request.file('image_url');
    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let image_url;
    if (file) {
      image_url = await this.uploadNftImage(file);
    } else {
      // Handle case where image_url is passed as a URL
      image_url = request.input('image_url');
    }
    const nft = await NFT.findOrFail(params.id);
    const payload = await request.validateUsing(updateNft);
    const user = await auth.authenticate();
    const collection = await Collection.findOrFail(payload.collection_id);
    if (collection.creator_id !== user.id) {
      return response.json({ code: 403, message: 'You are not authorized to update this NFT in this collection' });
    }
    nft.merge({ ...payload, image_url: image_url });
    await nft.save();
    return response.ok(nft);
  }

  public async index({ response, params }: HttpContext) {
    const nfts = await NFT.query()
      .preload('creator')
      .preload('owner')
      .preload('collection')
      .paginate(params.page, params.perPage)
    return response.ok(nfts)
  }

  public async showByOwner({ response, auth}: HttpContext){
    const user = await auth.authenticate();
    const nfts = await NFT.query().where('owner_id', user.id).preload('creator').preload('owner').preload('collection')
    return response.ok(nfts)
  }

  public async show({ params, response }: HttpContext) {
    const nft = await NFT.findOrFail(params.id)
    await nft.load('creator')
    await nft.load('owner')
    await nft.load('collection')
    return response.ok(nft)
  }

  public async delete({ params, response, auth }: HttpContext) {
    const token = await auth.authenticate()
    const nft = await NFT.findOrFail(params.id)
    if(nft.owner_id !== token.id) {
      return response.json({ code: 403, message: 'You are not authorized to delete this NFT' })
    }
    await nft.delete()
    return response.ok({ message: 'Delete success' })
  }
}
