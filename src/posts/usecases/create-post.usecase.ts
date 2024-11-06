import { BadRequestError } from '@/shared/errors/bad-request-error'
import { PostOutput } from '../dto/post-output'
import { IPostsRepository } from '../interfaces/posts.repository'
import slugify from 'slugify'
import { IAuthorsRepository } from '@/authors/interfaces/authors.repository'
import { ConflictError } from '@/shared/errors/conflict-error'

export namespace CreatePostUseCase {
  export type Input = {
    title: string
    content: string
    authorId: string
  }

  export type Output = PostOutput

  export class UseCase {
    constructor(
      private readonly postsRepository: IPostsRepository,
      private readonly authorsRepository: IAuthorsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { title, content, authorId } = input

      if (!title || !content || !authorId) {
        throw new BadRequestError('Input data not provided')
      }

      await this.authorsRepository.get(authorId)

      const slug = slugify(title, { lower: true })

      const slugExists = await this.postsRepository.findBySlug(slug)

      if (slugExists) {
        throw new ConflictError(`Title ${title} already used`)
      }

      const post = await this.postsRepository.create({
        ...input,
        slug,
      })

      return post as PostOutput
    }
  }
}
