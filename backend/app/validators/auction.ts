import vine from '@vinejs/vine'

export const addAuction = vine.compile(
    vine.object({
        nft_id: vine.string(),
        start_price: vine.number().min(0),
        auction_end: vine.date(),
    })
)