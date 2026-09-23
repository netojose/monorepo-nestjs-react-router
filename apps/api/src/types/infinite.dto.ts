import { Type } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

import { PaginationDTO } from './pagination.dto.js'

export function Infinite<TItem>(ItemClass: Type<TItem>): Type<{ items: TItem[]; pagination: PaginationDTO }> {
  class PaginatedClass {
    @ApiProperty({ type: ItemClass, isArray: true })
    items!: TItem[]

    @ApiProperty({ type: PaginationDTO })
    pagination!: PaginationDTO
  }

  Object.defineProperty(PaginatedClass, 'name', {
    value: `Infinite${ItemClass.name}`
  })

  return PaginatedClass
}
