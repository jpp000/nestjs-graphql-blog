import { PrismaService } from '@/database/prisma/prisma.service'
import { Post } from '../graphql/models/post'
import { IPostsRepository } from '../interfaces/posts.repository'
import { NotFoundError } from '@/shared/errors/not-found-error'

export class PostsPrimsaRepository implements IPostsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Omit<Post, 'id' | 'createdAt' | 'author'>): Promise<Post> {
    return this.prismaService.post.create({
      data,
    })
  }

  async update(post: Post): Promise<Post> {
    await this.get(post.id)
    return this.prismaService.post.update({
      where: {
        id: post.id,
      },
      data: post as any,
    })
  }

  async findById(id: string): Promise<Post> {
    return this.get(id)
  }

  async findBySlug(slug: string): Promise<Post> {
    return this.prismaService.post.findUnique({
      where: { slug },
    })
  }

  async findByAuthorId(authorId: string): Promise<Post[]> {
    const posts = await this.prismaService.post.findMany({
      where: { authorId },
    })

    return posts
  }

  async get(id: string): Promise<Post> {
    const post = await this.prismaService.post.findUnique({
      where: { id },
    })

    if (!post) {
      throw new NotFoundError(`Post not found using ID: ${id}`)
    }

    return post
  }
}
