import { Args, Query, Resolver } from '@nestjs/graphql'
import { Post } from '../models/post'
import { PostIdArgs } from '../args/post-id.args'
import { Inject } from '@nestjs/common'
import { GetPostUseCase } from '@/posts/usecases/get-post.usecase'

@Resolver()
export class ResolversResolver {
  @Inject('GetPostUseCase')
  private readonly getPostUseCase: GetPostUseCase.UseCase

  @Query(() => Post)
  getPostById(@Args() input: PostIdArgs) {
    return this.getPostUseCase.execute(input)
  }
}
