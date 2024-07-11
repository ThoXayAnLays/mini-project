import vine from '@vinejs/vine'

export const addOffer = vine.compile(
    vine.object({
        offer_amount: vine.number().min(1),
        nft_id: vine.string(),
    })
)

export const acceptOffer = vine.compile(
    vine.object({
        status: vine.string().sameAs('accepted')
    })
)

export const rejectOffer = vine.compile(
    vine.object({
        status: vine.string().sameAs('rejected')
    })
)