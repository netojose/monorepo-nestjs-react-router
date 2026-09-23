import { HttpException, HttpStatus } from '@nestjs/common'

export class ValidationException extends HttpException {
  constructor(errors: { field: string; rule: string; message: string }[]) {
    const cause = {
      statusCode: String(HttpStatus.UNPROCESSABLE_ENTITY),
      message: errors.map((error) => ({ field: error.field, constraints: { [error.rule]: error.message } }))
    }

    const status = HttpStatus.UNPROCESSABLE_ENTITY

    super(cause, status)
  }
}
