import { applyDecorators } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'

export function InfiniteResponse(TClass: Function): ReturnType<typeof applyDecorators> {
  return applyDecorators(ApiOkResponse({ type: TClass }))
}
