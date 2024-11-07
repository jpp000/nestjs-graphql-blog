import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { Post } from '../models/post'
import { PostIdArgs } from '../args/post-id.args'
import { Inject } from '@nestjs/common'
import { GetPostUseCase } from '@/posts/usecases/get-post.usecase'
import { CreatePostUseCase } from '@/posts/usecases/create-post.usecase'
import { CreatePostInput } from '../inputs/create-post.input'
import { PublishPostInput } from '../inputs/publish-post.input'
import { PublishPostUseCase } from '@/posts/usecases/publish-post.usecase'
import { UnpublishPostUseCase } from '@/posts/usecases/unpublish-post.usecase'
import { GetAuthorUseCase } from '@/authors/usecases/get-author.usecase'
import { Author } from '@/authors/graphql/models/author'

@Resolver(() => Post)
export class PostsResolver {
  @Inject(CreatePostUseCase.UseCase)
  private readonly createPostUseCase: CreatePostUseCase.UseCase

  @Inject(GetPostUseCase.UseCase)
  private readonly getPostUseCase: GetPostUseCase.UseCase

  @Inject(PublishPostUseCase.UseCase)
  private readonly publishPostUseCase: PublishPostUseCase.UseCase

  @Inject(UnpublishPostUseCase.UseCase)
  private readonly unpublishPostUseCase: UnpublishPostUseCase.UseCase

  @Inject(GetAuthorUseCase.UseCase)
  private readonly getAuthorUseCase: GetAuthorUseCase.UseCase

  @Mutation(() => Post)
  createPost(@Args('data') data: CreatePostInput) {
    return this.createPostUseCase.execute(data)
  }

  @Query(() => Post)
  getPostById(@Args() input: PostIdArgs) {
    return this.getPostUseCase.execute(input)
  }

  @Mutation(() => Post)
  publishPost(@Args('input') input: PublishPostInput) {
    return this.publishPostUseCase.execute(input)
  }

  @Mutation(() => Post)
  unpublishPost(@Args('input') input: PublishPostInput) {
    return this.unpublishPostUseCase.execute(input)
  }

  @ResolveField(() => Author)
  author(@Parent() post: Post) {
    return this.getAuthorUseCase.execute({ id: post.authorId })
  }
}
