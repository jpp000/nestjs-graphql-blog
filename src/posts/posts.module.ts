import { AuthorsModule } from '@/authors/authors.module'
import { Module } from '@nestjs/common'
import { PostsPrimsaRepository } from './repositories/posts-prisma.repository'
import { PrismaService } from '@/database/prisma/prisma.service'
import { PostsResolver } from './graphql/resolvers/posts.resolver'
import { DatabaseModule } from '@/database/database.module'
import { IPostsRepository } from './interfaces/posts.repository'
import { GetPostUseCase } from './usecases/get-post.usecase'
import { PublishPostUseCase } from './usecases/publish-post.usecase'
import { UnpublishPostUseCase } from './usecases/unpublish-post.usecase'
import { CreatePostUseCase } from './usecases/create-post.usecase'
import { IAuthorsRepository } from '@/authors/interfaces/authors.repository'
import { GetAuthorPostsUseCase } from './usecases/get-author-posts.usecase'

@Module({
  imports: [DatabaseModule, AuthorsModule],
  providers: [
    PostsResolver,
    {
      provide: 'PostsRepository',
      useFactory: (prismaService: PrismaService) =>
        new PostsPrimsaRepository(prismaService),
      inject: [PrismaService],
    },
    {
      provide: GetPostUseCase.UseCase,
      useFactory: (postsRepository: IPostsRepository) =>
        new GetPostUseCase.UseCase(postsRepository),
      inject: ['PostsRepository'],
    },
    {
      provide: PublishPostUseCase.UseCase,
      useFactory: (postsRepository: IPostsRepository) =>
        new PublishPostUseCase.UseCase(postsRepository),
      inject: ['PostsRepository'],
    },
    {
      provide: UnpublishPostUseCase.UseCase,
      useFactory: (postsRepository: IPostsRepository) =>
        new UnpublishPostUseCase.UseCase(postsRepository),
      inject: ['PostsRepository'],
    },
    {
      provide: CreatePostUseCase.UseCase,
      useFactory: (
        postsRepository: IPostsRepository,
        authorsRepository: IAuthorsRepository,
      ) => new CreatePostUseCase.UseCase(postsRepository, authorsRepository),
      inject: ['PostsRepository', 'AuthorsRepository'],
    },
    {
      provide: GetAuthorPostsUseCase.UseCase,
      useFactory: (postsRepository: IPostsRepository) =>
        new GetAuthorPostsUseCase.UseCase(postsRepository),
      inject: ['PostsRepository'],
    },
  ],
  exports: [GetAuthorPostsUseCase.UseCase],
})
export class PostsModule {}
