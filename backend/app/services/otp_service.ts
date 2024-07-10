import { DateTime } from 'luxon'

interface OtpData {
  otp: string
  expiresAt: DateTime
}

const otpStore: Map<string, OtpData> = new Map()

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class OtpService {
  public static storeOtp(email: string, otp: string) {
    const expiresAt = DateTime.now().plus({ minutes: 1 })
    otpStore.set(email, { otp, expiresAt })
  }

  public static verifyOtp(email: string, otp: string): boolean {
    const otpData = otpStore.get(email)
    if (!otpData) {
      return false
    }

    if (otpData.otp !== otp || DateTime.now() > otpData.expiresAt) {
      otpStore.delete(email)
      return false
    }

    otpStore.delete(email)
    return true
  }
}
