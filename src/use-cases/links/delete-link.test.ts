import { Link, User } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteLinkUseCase } from './delete-link'
import { GenerateData } from '@/tests/generate-data'
import { InMemoryLinksRepository } from '@/repositories/in-memory/in-memory-links-repository'
import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'

describe('DeleteLinkUseCase', () => {
  let linkRepository: InMemoryLinksRepository
  let sut: DeleteLinkUseCase
  let user: User
  let link: Link

  beforeEach(async () => {
    const data = new GenerateData()
    linkRepository = data.linksRepository
    sut = new DeleteLinkUseCase(data.linksRepository, data.tripsRepository)

    user = await data.createUser()

    await data.createTrip()

    link = await data.createLink()
  })

  it('should be able to delete a link', async () => {
    await sut.execute({ linkId: link.id, userId: user.id })

    const deletedLink = await linkRepository.findById(link.id)

    expect(deletedLink).toBeNull()
  })

  it('should not be able to delete link if not exists', async () => {
    const promise = sut.execute({ linkId: 'wrong_id', userId: user.id })

    expect(promise).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to delete link if userId is invalid', async () => {
    const promise = sut.execute({ linkId: link.id, userId: 'wrong_id' })

    expect(promise).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
