import { AuthorOutput } from '../dto/author-output'
import { IAuthorsRepository } from '../interfaces/authors.repository'

export namespace DeleteAuthorUseCase {
  export type Input = { id: string }

  export type Output = AuthorOutput

  export class UseCase {
    constructor(private readonly authorsRepository: IAuthorsRepository) {}

    async execute({ id }: Input): Promise<Output> {
      const author = await this.authorsRepository.delete(id)

      return author
    }
  }
}
