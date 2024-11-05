export type SearchInput = {
  page?: number
  perPage?: number
  filter?: string | null
  sort?: string | null
  sortDir?: 'asc' | 'desc' | null
}
