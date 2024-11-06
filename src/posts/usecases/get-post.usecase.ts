import { PostOutput } from '../dto/post-output'
import { IPostsRepository } from '../interfaces/posts.repository'

export namespace GetPostUseCase {
  export type Input = {
    id: string
  }

  export type Output = PostOutput

  export class UseCase {
    constructor(private readonly postsRepository: IPostsRepository) {}

    async execute(input: Input): Promise<Output> {
      const post = await this.postsRepository.findById(input.id)
      return post as PostOutput
    }
  }
}
