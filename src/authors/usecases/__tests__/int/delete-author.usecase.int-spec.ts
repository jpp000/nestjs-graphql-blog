import { Test, TestingModule } from '@nestjs/testing'
import { AuthorsPrismaRepository } from '../../../repositories/authors-prisma.repository'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { AuthorDataBuilder } from '../../../helpers/author-data-builder'
import { ConflictError } from '@/shared/errors/conflict-error'
import { BadRequestError } from '@/shared/errors/bad-request-error'
import { NotFoundError } from '@/shared/errors/not-found-error'
import { DeleteAuthorUseCase } from '../../delete-author.usecase'

describe('DeleteAuthorUseCase int tests', () => {
  let module: TestingModule
  let repository: AuthorsPrismaRepository
  let sut: DeleteAuthorUseCase.UseCase
  const prismaService = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migrate-test')
    await prismaService.$connect()

    module = await Test.createTestingModule({}).compile()

    repository = new AuthorsPrismaRepository(prismaService as any)

    sut = new DeleteAuthorUseCase.UseCase(repository)
  })

  beforeEach(async () => {
    await prismaService.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throws an error when the id is not found', async () => {
    await expect(sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError(`Autor not found using ID: fakeId`),
    )
  })

  it('should delete an author by id', async () => {
    const data = AuthorDataBuilder({})

    const author = await prismaService.author.create({
      data,
    })

    const result = await sut.execute({ id: author.id })

    expect(result).toStrictEqual(author)

    const authors = await prismaService.author.findMany()
    expect(authors).toHaveLength(0)
  })
})