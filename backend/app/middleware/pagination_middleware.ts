import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

interface Pagination {
  perPage: number
  page: number
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    pagination: Pagination
  }
}

export default class PaginationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request } = ctx
    const pagination = {
      perPage: Number(request.input('perPage', 5)),
      page: Number(request.input('page', 1))
    }

    ctx.pagination = pagination
    console.log('pagination', pagination)
    await next()
  }
}