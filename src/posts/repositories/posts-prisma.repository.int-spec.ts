import { Test, TestingModule } from '@nestjs/testing'
import { PostsPrimsaRepository } from './posts-prisma.repository'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { NotFoundError } from '@/shared/errors/not-found-error'
import { PostsDataBuilder } from '../helpers/posts-data-builder'
import { AuthorDataBuilder } from '@/authors/helpers/author-data-builder'

describe('PostsPrismaRepository int tests', () => {
  let module: TestingModule
  let sut: PostsPrimsaRepository
  const prismaService = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migrate-test')
    await prismaService.$connect()

    module = await Test.createTestingModule({}).compile()

    sut = new PostsPrimsaRepository(prismaService as any)
  })

  beforeEach(async () => {
    await prismaService.post.deleteMany()
    await prismaService.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throws an error when the id is not found', async () => {
    await expect(sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError(`Post not found using ID: fakeId`),
    )
  })

  it('should find an post by id', async () => {
    const postData = PostsDataBuilder({})
    const authorData = AuthorDataBuilder({})

    const author = await prismaService.author.create({
      data: authorData,
    })

    const post = await prismaService.post.create({
      data: {
        ...postData,
        author: {
          connect: {
            ...author,
          },
        },
      },
    })

    const result = await sut.findById(post.id)

    expect(result).toStrictEqual(post)
  })

  it('should create a post', async () => {
    const postData = PostsDataBuilder({})
    const authorData = AuthorDataBuilder({})

    const author = await prismaService.author.create({
      data: authorData,
    })

    const post = await sut.create({ ...postData, authorId: author.id })

    expect(post).toMatchObject(postData)
  })

  it('should throws an error when updating a post not found', async () => {
    const data = PostsDataBuilder({})
    const post = {
      ...data,
      id: '64d8a7e6-d289-4c2b-b80a-83ec3dcc9fe5',
      authorId: '64d8a7e6-d289-4c2b-b80a-83ec3dcc9fe5',
    }
    await expect(sut.update(post)).rejects.toThrow(
      new NotFoundError(
        `Post not found using ID: 64d8a7e6-d289-4c2b-b80a-83ec3dcc9fe5`,
      ),
    )
  })

  it('should update a post', async () => {
    const postData = PostsDataBuilder({})
    const authorData = AuthorDataBuilder({})

    const author = await prismaService.author.create({
      data: authorData,
    })

    const post = await prismaService.post.create({
      data: {
        ...postData,
        author: {
          connect: {
            ...author,
          },
        },
      },
    })

    const result = await sut.update({
      ...post,
      published: true,
      title: 'title-updated',
    })

    expect(result.published).toBeTruthy()
    expect(result.title).toBe('title-updated')
  })

  it('should return null when does not found a post by slug provided', async () => {
    const result = await sut.findBySlug('fakeSlug')
    expect(result).toBeNull()
  })

  it('should return an post by slug', async () => {
    const postData = PostsDataBuilder({ slug: 'slug' })
    const authorData = AuthorDataBuilder({})

    const author = await prismaService.author.create({
      data: authorData,
    })

    const post = await prismaService.post.create({
      data: {
        ...postData,
        author: {
          connect: {
            ...author,
          },
        },
      },
    })

    const result = await sut.findBySlug('slug')

    expect(result).toStrictEqual(post)
  })
})
