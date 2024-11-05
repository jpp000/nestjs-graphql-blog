import { Args, Query, Resolver } from '@nestjs/graphql'
import { Author } from '../models/author'
import { Inject } from '@nestjs/common'
import { ListAuthorsUseCase } from '@/authors/usecases/list-authors.usecase'
import { SearchParamsArgs } from '../args/search-params.args'
import { SearchAuthorsResult } from '../models/search-authors-result'

@Resolver(() => Author)
export class AuthorsResolver {
  @Inject(ListAuthorsUseCase.UseCase)
  private readonly listAuthorsUseCase: ListAuthorsUseCase.UseCase

  @Query(() => SearchAuthorsResult)
  authors(@Args() searchParamsArgs: SearchParamsArgs) {
    return this.listAuthorsUseCase.execute(searchParamsArgs)
  }
}
