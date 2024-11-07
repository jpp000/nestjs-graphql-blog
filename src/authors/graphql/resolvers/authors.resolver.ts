import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { Author } from '../models/author'
import { Inject } from '@nestjs/common'
import { ListAuthorsUseCase } from '@/authors/usecases/list-authors.usecase'
import { SearchParamsArgs } from '../args/search-params.args'
import { SearchAuthorsResult } from '../models/search-authors-result'
import { GetAuthorUseCase } from '@/authors/usecases/get-author.usecase'
import { CreateAuthorUseCase } from '@/authors/usecases/create-author.usecase'
import { DeleteAuthorUseCase } from '@/authors/usecases/delete-author.usecase'
import { UpdateAuthorUseCase } from '@/authors/usecases/update-author.usecase'
import { CreateAuthorInput } from '../inputs/create-author.input'
import { AuthorIdArgs } from '../args/author-id.args'
import { UpdateAuthorInput } from '../inputs/update-author.input'
import { Post } from '@/posts/graphql/models/post'

@Resolver(() => Author)
export class AuthorsResolver {
  @Inject(ListAuthorsUseCase.UseCase)
  private readonly listAuthorsUseCase: ListAuthorsUseCase.UseCase

  @Inject(GetAuthorUseCase.UseCase)
  private readonly getAuthorUseCase: GetAuthorUseCase.UseCase

  @Inject(CreateAuthorUseCase.UseCase)
  private readonly createAuthorUseCase: CreateAuthorUseCase.UseCase

  @Inject(UpdateAuthorUseCase.UseCase)
  private readonly updateAuthorUseCase: UpdateAuthorUseCase.UseCase

  @Inject(DeleteAuthorUseCase.UseCase)
  private readonly deleteAuthorUseCase: DeleteAuthorUseCase.UseCase

  @Query(() => SearchAuthorsResult)
  authors(@Args() searchParamsArgs: SearchParamsArgs) {
    return this.listAuthorsUseCase.execute(searchParamsArgs)
  }

  @Mutation(() => Author)
  createAuthor(@Args('data') data: CreateAuthorInput) {
    return this.createAuthorUseCase.execute(data)
  }

  @Query(() => Author)
  getAuthorById(@Args() input: AuthorIdArgs) {
    return this.getAuthorUseCase.execute(input)
  }

  @Mutation(() => Author)
  updateAuthor(
    @Args() { id }: AuthorIdArgs,
    @Args('data') data: UpdateAuthorInput,
  ) {
    return this.updateAuthorUseCase.execute({ id, ...data })
  }

  @Mutation(() => Author)
  deleteAuthor(@Args() input: AuthorIdArgs) {
    return this.deleteAuthorUseCase.execute(input)
  }

  @ResolveField(() => [Post], { nullable: true })
  posts(@Parent() author: Author) {
    return author.posts
  }
}
