import { Test, TestingModule } from '@nestjs/testing'
import { AuthorsPrismaRepository } from './authors-prisma.repository'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { NotFoundError } from '@/shared/errors/not-found-error'
import { AuthorDataBuilder } from '../helpers/author-data-builder'
import { emit, emitWarning } from 'node:process'

describe('AuthorsPrismaRepository int tests', () => {
  let module: TestingModule
  let sut: AuthorsPrismaRepository
  const prismaService = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migrate-test')
    await prismaService.$connect()

    module = await Test.createTestingModule({}).compile()

    sut = new AuthorsPrismaRepository(prismaService as any)
  })

  beforeEach(async () => {
    await prismaService.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throws an error when the id is not found', async () => {
    await expect(sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError(`Autor not found using ID: fakeId`),
    )
  })

  it('should find an author by id', async () => {
    const data = AuthorDataBuilder({})

    const author = await prismaService.author.create({
      data,
    })

    const result = await sut.findById(author.id)

    expect(result).toStrictEqual(author)
  })

  it('should create a author', async () => {
    const data = AuthorDataBuilder({})

    const author = await sut.create(data)

    expect(author).toMatchObject(data)
  })

  it('should throws an error when updating a author not found', async () => {
    const data = AuthorDataBuilder({})

    const author = {
      id: '64d8a7e6-d289-4c2b-b80a-83ec3dcc9fe5',
      ...data,
    }

    await expect(sut.update(author)).rejects.toThrow(
      new NotFoundError(
        `Autor not found using ID: 64d8a7e6-d289-4c2b-b80a-83ec3dcc9fe5`,
      ),
    )
  })

  it('should update a author', async () => {
    const data = AuthorDataBuilder({})

    const author = await prismaService.author.create({ data })

    const result = await sut.update({ ...author, name: 'new name' })

    expect(result.name).toBe('new name')
  })

  it('should throws an error when deleting a author not found', async () => {
    await expect(sut.delete('fakeId')).rejects.toThrow(
      new NotFoundError(`Autor not found using ID: fakeId`),
    )
  })

  it('should delete a author', async () => {
    const data = AuthorDataBuilder({})
    const author = await prismaService.author.create({ data })

    const result = await sut.delete(author.id)

    expect(result).toMatchObject(author)
  })

  it('should return null when does not found a author by email provided', async () => {
    const result = await sut.findByEmail('a@a.com')
    expect(result).toBeNull()
  })

  it('should return an author by email', async () => {
    const data = AuthorDataBuilder({ email: 'a@a.com' })

    const author = await prismaService.author.create({
      data,
    })

    const result = await sut.findByEmail('a@a.com')

    expect(result).toStrictEqual(author)
  })

  describe('search method', () => {
    test('should only apply pagination when the parameters are null', async () => {
      const createdAt = new Date()
      const data = []
      const arrange = Array(16).fill(AuthorDataBuilder({}))
      arrange.forEach((element, index) => {
        const timestamp = createdAt.getTime() + index
        data.push({
          ...element,
          email: `author${index}@a.com`,
          createdAt: new Date(timestamp),
        })
      })

      await prismaService.author.createMany({ data })
      const result = await sut.search({})

      expect(result.total).toBe(16)
      expect(result.items.length).toBe(15)
      result.items.forEach((item) => {
        expect(item.id).toBeDefined()
      })

      result.items.reverse().forEach((item, index) => {
        expect(`${item.email}${index + 1}@a.com`)
      })
    })

    test('should apply pagination and ordering', async () => {
      const createdAt = new Date()
      const data = []
      const arrange = 'badec'
      arrange.split('').forEach((element, index) => {
        const timestamp = createdAt.getTime() + index
        data.push({
          ...AuthorDataBuilder({ name: element }),
          email: `author${index}@a.com`,
          createdAt: new Date(timestamp),
        })
      })

      await prismaService.author.createMany({ data })
      const result1 = await sut.search({
        page: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
      })

      expect(result1.items[0]).toMatchObject(data[1])
      expect(result1.items[1]).toMatchObject(data[0])

      const result2 = await sut.search({
        page: 2,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
      })

      expect(result2.items[0]).toMatchObject(data[4])
      expect(result2.items[1]).toMatchObject(data[2])
    })

    test('should apply pagination, filter and ordering', async () => {
      const createdAt = new Date()
      const data = []
      const arrange = ['test', 'a', 'TEST', 'b', 'Test']
      arrange.forEach((element, index) => {
        const timestamp = createdAt.getTime() + index
        data.push({
          ...AuthorDataBuilder({ name: element }),
          email: `author${index}@a.com`,
          createdAt: new Date(timestamp),
        })
      })

      await prismaService.author.createMany({ data })
      const result1 = await sut.search({
        page: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'TEST',
      })

      expect(result1.items[0]).toMatchObject(data[0])
      expect(result1.items[1]).toMatchObject(data[4])

      const result2 = await sut.search({
        page: 2,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'TEST',
      })

      expect(result2.items[0]).toMatchObject(data[2])
      expect(result2.items.length).toBe(1)
    })
  })
})
