import { BadRequestError } from '@/shared/errors/bad-request-error'
import { IAuthorsRepository } from '../interfaces/authors.repository'
import { ConflictError } from '@/shared/errors/conflict-error'
import { AuthorOutput } from '../dto/author-output'
import { Author } from '../graphql/models/author'

export namespace UpdateAuthorUseCase {
  export type Input = Partial<Author>

  export type Output = AuthorOutput

  export class UseCase {
    constructor(private readonly authorsRepository: IAuthorsRepository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.id) {
        throw new BadRequestError('Id not provided')
      }

      const author = await this.authorsRepository.findById(input.id)

      if (input.email) {
        const emailExists = await this.authorsRepository.findByEmail(
          input.email,
        )
        if (emailExists && emailExists.id !== input.id) {
          throw new ConflictError(
            'Email address already used by another author',
          )
        }

        author.email = input.email
      }

      if (input.name) {
        author.name = input.name
      }

      return this.authorsRepository.update(author)
    }
  }
}
