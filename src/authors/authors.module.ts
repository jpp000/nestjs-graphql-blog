import { Module } from '@nestjs/common'
import { AuthorsResolver } from './graphql/resolvers/authors.resolver'
import { DatabaseModule } from '@/database/database.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { AuthorsPrismaRepository } from './repositories/authors-prisma.repository'
import { ListAuthorsUseCase } from './usecases/list-authors.usecase'
import { IAuthorsRepository } from './interfaces/authors.repository'
import { GetAuthorUseCase } from './usecases/get-author.usecase'
import { CreateAuthorUseCase } from './usecases/create-author.usecase'
import { DeleteAuthorUseCase } from './usecases/delete-author.usecase'
import { UpdateAuthorUseCase } from './usecases/update-author.usecase'

@Module({
  imports: [DatabaseModule],
  providers: [
    AuthorsResolver,
    {
      provide: 'AuthorsRepository',
      useFactory: (prismaService: PrismaService) =>
        new AuthorsPrismaRepository(prismaService),
      inject: [PrismaService],
    },
    {
      provide: ListAuthorsUseCase.UseCase,
      useFactory: (authorsRepository: IAuthorsRepository) =>
        new ListAuthorsUseCase.UseCase(authorsRepository),
      inject: ['AuthorsRepository'],
    },
    {
      provide: GetAuthorUseCase.UseCase,
      useFactory: (authorsRepository: IAuthorsRepository) =>
        new GetAuthorUseCase.UseCase(authorsRepository),
      inject: ['AuthorsRepository'],
    },
    {
      provide: CreateAuthorUseCase.UseCase,
      useFactory: (authorsRepository: IAuthorsRepository) =>
        new CreateAuthorUseCase.UseCase(authorsRepository),
      inject: ['AuthorsRepository'],
    },
    {
      provide: DeleteAuthorUseCase.UseCase,
      useFactory: (authorsRepository: IAuthorsRepository) =>
        new DeleteAuthorUseCase.UseCase(authorsRepository),
      inject: ['AuthorsRepository'],
    },
    {
      provide: UpdateAuthorUseCase.UseCase,
      useFactory: (authorsRepository: IAuthorsRepository) =>
        new UpdateAuthorUseCase.UseCase(authorsRepository),
      inject: ['AuthorsRepository'],
    },
  ],
  exports: ['AuthorsRepository', GetAuthorUseCase.UseCase],
})
export class AuthorsModule {}
