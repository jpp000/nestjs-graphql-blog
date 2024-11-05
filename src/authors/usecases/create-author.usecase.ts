import { BadRequestError } from '@/shared/errors/bad-request-error'
import { IAuthorsRepository } from '../interfaces/authors.repository'
import { ICreateAuthor } from '../interfaces/create-author'
import { ConflictError } from '@/shared/errors/conflict-error'
import { AuthorOutput } from '../dto/author-output'

export namespace CreateAuthorUseCase {
  export type Input = ICreateAuthor

  export type Output = AuthorOutput

  export class UseCase {
    constructor(private readonly authorsRepository: IAuthorsRepository) {}

    async execute(input: Input): Promise<Output> {
      const { name, email } = input

      if (!name || !email) {
        throw new BadRequestError('Input data not provided')
      }

      const emailExists = await this.authorsRepository.findByEmail(email)

      if (emailExists) {
        throw new ConflictError('Email address already used by another author')
      }

      const author = await this.authorsRepository.create(input)

      return author
    }
  }
}
