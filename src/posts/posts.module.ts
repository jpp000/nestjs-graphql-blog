import { AuthorsModule } from '@/authors/authors.module'
import { Module } from '@nestjs/common'
import { PostsPrimsaRepository } from './repositories/posts-prisma.repository'
import { PrismaService } from '@/database/prisma/prisma.service'
import { ResolversResolver } from './graphql/resolvers/resolvers.resolver'
import { DatabaseModule } from '@/database/database.module'
import { IPostsRepository } from './interfaces/posts.repository'
import { GetPostUseCase } from './usecases/get-post.usecase'
import { PublishPostUseCase } from './usecases/publish-post.usecase'
import { UnpublishPostUseCase } from './usecases/unpublish-post.usecase'
import { CreatePostUseCase } from './usecases/create-post.usecase'
import { IAuthorsRepository } from '@/authors/interfaces/authors.repository'

@Module({
  imports: [DatabaseModule, AuthorsModule],
  providers: [
    ResolversResolver,
    {
      provide: 'PostsRepository',
      useFactory: (prismaService: PrismaService) =>
        new PostsPrimsaRepository(prismaService),
      inject: [PrismaService],
    },
    {
      provide: 'GetPostUseCase',
      useFactory: (postsRepository: IPostsRepository) =>
        new GetPostUseCase.UseCase(postsRepository),
      inject: ['PostsRepository'],
    },
    {
      provide: 'PublishPostUseCase',
      useFactory: (postsRepository: IPostsRepository) =>
        new PublishPostUseCase.UseCase(postsRepository),
      inject: ['PostsRepository'],
    },
    {
      provide: 'UnpublishPostUseCase',
      useFactory: (postsRepository: IPostsRepository) =>
        new UnpublishPostUseCase.UseCase(postsRepository),
      inject: ['PostsRepository'],
    },
    {
      provide: 'CreatePostUseCase',
      useFactory: (
        postsRepository: IPostsRepository,
        authorsRepository: IAuthorsRepository,
      ) => new CreatePostUseCase.UseCase(postsRepository, authorsRepository),
      inject: ['PostsRepository', 'AuthorsRepository'],
    },
  ],
})
export class PostsModule {}
