export class PaginationDTO {
  endCursor!: string | null
  startCursor!: string | null
  hasNextPage!: boolean
  hasPrevPage!: boolean
  totalCount!: number
}
