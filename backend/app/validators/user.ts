import vine from '@vinejs/vine'

export const registerUser = vine.compile(
  vine.object({
    username: vine.string(),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const match = await db.from('users').select('id').where('email', value).first()
        return !match
      }),
    password: vine.string().minLength(8),
    wallet_address: vine
      .string()
      .unique(async (db, value) => {
        const match = await db.from('users').select('id').where('wallet_address', value).first()
        return !match
      })
  })
)

export const loginUser = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(8),
  })
)

export const updateInfo = vine.compile(
  vine.object({
    username: vine.string().optional(),
    bio: vine.string().optional(),
    // profile_picture:vine.file({
    //   size: '2mb',
    //   extnames: ['jpg', 'png', 'pdf'],
    // }).optional(),
    wallet_address: vine
      .string()
      .unique(async (db, value) => {
        const match = await db.from('users').select('id').where('wallet_address', value).first()
        return !match
      }).optional()
  })
)
