import { UnprocessableEntityException, ValidationError } from '@nestjs/common'

function parseConstraints(error: ValidationError): Record<string, string> {
  return Object.keys(error.constraints ?? {}).reduce((acc, key) => {
    const message = error.constraints?.[key] ?? ''

    return { ...acc, [key]: message }
  }, {})
}

function extractErrors(errors: ValidationError[], path: Array<unknown> = []): unknown[] {
  const items: Array<unknown> = []
  errors.forEach((error) => {
    const paths = [...path, error.property]
    if (!error.constraints) {
      if (error.children) {
        items.push(...extractErrors(error.children, paths))
      }
    } else {
      items.push({
        field: paths.join('.'),
        constraints: parseConstraints(error)
      })
    }
  })
  return items
}

export const STATUS_CODE = '422'

export function validationExceptionFactory(validationErrors: ValidationError[]): UnprocessableEntityException {
  const message = extractErrors(validationErrors)
  return new UnprocessableEntityException({ statusCode: STATUS_CODE, message }, STATUS_CODE)
}
