import vine from '@vinejs/vine'

export const addBid = vine.compile(
    vine.object({
        bid_amount: vine.number(),
        auction_id: vine.string(),
    })
)