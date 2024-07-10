import vine from '@vinejs/vine'

export const addCollection = vine.compile(
    vine.object({
        name: vine.string().maxLength(255),
        description: vine.string(),
    })
)

export const updateCollection = vine.compile(
    vine.object({
        name: vine.string().maxLength(255).optional(),
        description: vine.string().optional()
    })
)