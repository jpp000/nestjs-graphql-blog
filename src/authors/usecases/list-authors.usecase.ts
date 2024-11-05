import { SearchInput } from '@/shared/dto/search-input'
import { IAuthorsRepository } from '../interfaces/authors.repository'
import { PaginationOutput } from '@/shared/dto/pagination-output'
import { AuthorOutput } from '../dto/author-output'

export namespace ListAuthorsUseCase {
  export type Input = SearchInput

  export type Output = PaginationOutput<AuthorOutput>

  export class UseCase {
    constructor(private readonly authorsRepository: IAuthorsRepository) {}

    async execute(input: Input): Promise<Output> {
      return this.authorsRepository.search(input)
    }
  }
}
