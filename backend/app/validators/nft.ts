import vine from '@vinejs/vine'

export const addNft = vine.compile(
  vine.object({
    title: vine.string().maxLength(255),
    description: vine.string(),
    image_url: vine.string().url(),
    metadata: vine.string(),
    collection_id: vine.string().optional(),
    sale_type: vine.enum(['buy_now', 'auction', 'offer'] as const),
    price: vine.number().optional(),
  })
)

export const updateNft = vine.compile(
  vine.object({
    title: vine.string().maxLength(255).optional(),
    description: vine.string().optional(),
    image_url: vine.string().url().optional(),
    metadata: vine.string().optional(),
    owner_id: vine.string().optional(),
    collection_id: vine.string().optional(),
    sale_type: vine.enum(['buy_now', 'auction', 'offer'] as const).optional(),
    price: vine.number().optional(),
  })
)
