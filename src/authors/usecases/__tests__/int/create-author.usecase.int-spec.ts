import { Test, TestingModule } from '@nestjs/testing'
import { AuthorsPrismaRepository } from '../../../repositories/authors-prisma.repository'
import { CreateAuthorUseCase } from '../../create-author.usecase'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { AuthorDataBuilder } from '../../../helpers/author-data-builder'
import { ConflictError } from '@/shared/errors/conflict-error'
import { BadRequestError } from '@/shared/errors/bad-request-error'

describe('CreateAuthorUseCase int tests', () => {
  let module: TestingModule
  let repository: AuthorsPrismaRepository
  let sut: CreateAuthorUseCase.UseCase
  const prismaService = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migrate-test')
    await prismaService.$connect()

    module = await Test.createTestingModule({}).compile()

    repository = new AuthorsPrismaRepository(prismaService as any)

    sut = new CreateAuthorUseCase.UseCase(repository)
  })

  beforeEach(async () => {
    await prismaService.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should create a author', async () => {
    const data = AuthorDataBuilder({})

    const author = await sut.execute(data)

    expect(author.id).toBeDefined()
    expect(author.createdAt).toBeInstanceOf(Date)
    expect(author).toMatchObject(data)
  })

  it('should not be able to create a author with same email', async () => {
    const data = AuthorDataBuilder({ email: 'a@a.com' })

    await sut.execute(data)

    await expect(sut.execute(data)).rejects.toThrow(
      new ConflictError('Email address already used by another author'),
    )
  })

  it('should throws error when name not provided', async () => {
    const data = AuthorDataBuilder({})

    data.name = null

    await expect(sut.execute(data)).rejects.toThrow(
      new BadRequestError('Input data not provided'),
    )
  })

  it('should throws error when email not provided', async () => {
    const data = AuthorDataBuilder({})

    data.email = null

    await expect(sut.execute(data)).rejects.toThrow(
      new BadRequestError('Input data not provided'),
    )
  })
})
