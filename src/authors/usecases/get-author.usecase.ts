import { AuthorOutput } from '../dto/author-output'
import { IAuthorsRepository } from '../interfaces/authors.repository'

export namespace GetAuthorUseCase {
  export type Input = { id: string }

  export type Output = AuthorOutput

  export class UseCase {
    constructor(private readonly authorsRepository: IAuthorsRepository) {}

    async execute({ id }: Input): Promise<Output> {
      const author = await this.authorsRepository.findById(id)

      return author
    }
  }
}
