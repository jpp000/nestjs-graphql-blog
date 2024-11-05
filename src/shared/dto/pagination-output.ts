export type PaginationOutput<Item> = {
  items: Item[]
  currentPage: number
  perPage: number
  lastPage: number
  total: number
}
