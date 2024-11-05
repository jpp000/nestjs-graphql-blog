import { Args, Query, Resolver } from '@nestjs/graphql'
import { Author } from '../models/author'
import { Inject } from '@nestjs/common'
import { ListAuthorsUseCase } from '@/authors/usecases/list-authors.usecase'
import { SearchParamsArgs } from '../args/search-params.args'
import { SearchAuthorsResult } from '../models/search-authors-result'
import { GetAuthorUseCase } from '@/authors/usecases/get-author.usecase'
import { CreateAuthorUseCase } from '@/authors/usecases/create-author.usecase'
import { DeleteAuthorUseCase } from '@/authors/usecases/delete-author.usecase'
import { UpdateAuthorUseCase } from '@/authors/usecases/update-author.usecase'

@Resolver(() => Author)
export class AuthorsResolver {
  @Inject(ListAuthorsUseCase.UseCase)
  private readonly listAuthorsUseCase: ListAuthorsUseCase.UseCase

  @Inject(GetAuthorUseCase.UseCase)
  private readonly getAuthorUseCase: GetAuthorUseCase.UseCase

  @Inject(CreateAuthorUseCase.UseCase)
  private readonly createAuthorUseCase: CreateAuthorUseCase.UseCase

  @Inject(DeleteAuthorUseCase.UseCase)
  private readonly deleteAuthorUseCase: DeleteAuthorUseCase.UseCase

  @Inject(UpdateAuthorUseCase.UseCase)
  private readonly updateAuthorUseCase: UpdateAuthorUseCase.UseCase

  @Query(() => SearchAuthorsResult)
  authors(@Args() searchParamsArgs: SearchParamsArgs) {
    return this.listAuthorsUseCase.execute(searchParamsArgs)
  }
}
