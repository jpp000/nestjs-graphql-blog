import { Post } from '../graphql/models/post'
import { IPostsRepository } from '../interfaces/posts.repository'

export namespace GetAuthorPostsUseCase {
  export type Input = {
    authorId: string
  }

  export type Output = Post[]

  export class UseCase {
    constructor(private readonly postsRepository: IPostsRepository) {}

    async execute({ authorId }: Input): Promise<Output> {
      return this.postsRepository.findByAuthorId(authorId)
    }
  }
}
