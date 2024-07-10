import vine from '@vinejs/vine'

export const SendOtpValidator = vine.compile(
    vine.object({
        email: vine.string().maxLength(255),
    })
)

export const VerifyOtpValidator = vine.compile(
    vine.object({
        email: vine.string().maxLength(255),
        otp: vine.string(),
    })
)


export const ResetPasswordValidator  = vine.compile(
    vine.object({
        email: vine.string().maxLength(255),
        password: vine.string().minLength(8),
        otp: vine.string(),
    })
)