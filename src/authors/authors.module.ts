import { Module } from '@nestjs/common'
import { AuthorsResolver } from './graphql/resolvers/authors.resolver'
import { DatabaseModule } from '@/database/database.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { AuthorsPrismaRepository } from './repositories/authors-prisma.repository'
import { ListAuthorsUseCase } from './usecases/list-authors.usecase'
import { IAuthorsRepository } from './interfaces/authors.repository'

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
  ],
})
export class AuthorsModule {}
