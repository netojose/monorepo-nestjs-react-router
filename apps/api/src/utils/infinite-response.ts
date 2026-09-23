import { PaginationDTO } from '../types/pagination.dto.js'

export function infinite<T>(
  pagination: PaginationDTO,
  items: T[]
): {
  items: T[]
  pagination: PaginationDTO
} {
  return { items, pagination }
}
