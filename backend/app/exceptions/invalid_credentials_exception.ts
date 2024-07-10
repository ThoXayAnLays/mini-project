import { Exception } from '@adonisjs/core/exceptions'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class InvalidCredentialsException extends Exception {
  static status = 500
  static code = 'INVALID_CREDENTIALS'
  static message = 'Invalid credentials'
}