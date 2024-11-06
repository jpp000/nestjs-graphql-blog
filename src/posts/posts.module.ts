import { AuthorsModule } from '@/authors/authors.module'
import { DatabaseModule } from '@faker-js/faker/.'
import { Module } from '@nestjs/common'
import { PostsPrimsaRepository } from './repositories/posts-prisma.repository'
import { PrismaService } from '@/database/prisma/prisma.service'

@Module({
  imports: [DatabaseModule, AuthorsModule],
  providers: [
    {
      provide: 'PostsRepository',
      useFactory: (prismaService: PrismaService) =>
        new PostsPrimsaRepository(prismaService),
      inject: [PrismaService],
    },
  ],
})
export class PostsModule {}
