import vine from '@vinejs/vine'

export const updateAvatarValidator = vine.compile(
  vine.object({
    avatar: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'pdf'],
    }),
  })
)

export const createInvoiceValidator = vine.compile(
  vine.object({
    documents: vine.array(
      vine.file({
        size: '2mb',
        extnames: ['jpg', 'png', 'pdf'],
      })
    ),
  })
)
