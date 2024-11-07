import { PrismaService } from '@/database/prisma/prisma.service'
import { Author } from '../graphql/models/author'
import {
  IAuthorsRepository,
  SearchParams,
  SearchResult,
} from '../interfaces/authors.repository'
import { ICreateAuthor } from '../interfaces/create-author'
import { NotFoundError } from '@/shared/errors/not-found-error'

export class AuthorsPrismaRepository implements IAuthorsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  sortableFields: string[] = ['name', 'email', 'createdAt']

  async create(data: ICreateAuthor): Promise<Author> {
    return this.prismaService.author.create({ data, include: { posts: true } })
  }

  async update(author: Author): Promise<Author> {
    const { id, name, email } = author

    await this.get(id)

    const updatedAuthor = await this.prismaService.author.update({
      where: { id },
      data: { name, email },
      include: { posts: true },
    })

    return updatedAuthor
  }

  async delete(id: string): Promise<Author> {
    await this.get(id)

    await this.prismaService.post.deleteMany({
      where: { authorId: id },
    })

    return this.prismaService.author.delete({
      where: { id },
      include: { posts: true },
    })
  }

  async findById(id: string): Promise<Author> {
    return this.get(id)
  }

  async findByEmail(email: string): Promise<Author> {
    return this.prismaService.author.findUnique({
      where: { email },
      include: { posts: true },
    })
  }

  async search(params: SearchParams): Promise<SearchResult> {
    const { page = 1, perPage = 15, filter, sort, sortDir } = params
    const sortable = this.sortableFields?.includes(sort) || false

    const orderByField = sortable ? sort : 'createdAt'
    const orderByDir = sortable ? sortDir : 'desc'

    const count = await this.prismaService.author.count({
      ...(filter && {
        where: {
          OR: [
            { name: { contains: filter, mode: 'insensitive' } },
            { email: { contains: filter, mode: 'insensitive' } },
          ],
        },
      }),
    })

    const authors = await this.prismaService.author.findMany({
      ...(filter && {
        where: {
          OR: [
            { name: { contains: filter, mode: 'insensitive' } },
            { email: { contains: filter, mode: 'insensitive' } },
          ],
        },
      }),
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: page > 0 ? (page - 1) * perPage : 1,
      take: perPage > 0 ? perPage : 15,
      include: { posts: true },
    })

    return {
      items: authors,
      currentPage: page,
      perPage,
      lastPage: Math.ceil(count / perPage),
      total: count,
    }
  }

  async get(id: string): Promise<Author> {
    const author = await this.prismaService.author.findUnique({
      where: { id },
      include: { posts: true },
    })

    if (!author) {
      throw new NotFoundError(`Autor not found using ID: ${id}`)
    }

    return author
  }
}
