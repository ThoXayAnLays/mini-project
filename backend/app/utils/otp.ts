export function generateOTP(length = 6): string {
  const characters = '0123456789'
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += characters[Math.floor(Math.random() * characters.length)]
  }
  return otp
}
