import { Link, User } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteLinkUseCase } from './delete-link'
import { GenerateData } from '@/tests/generate-data'
import { TripResponse } from '@/repositories/interfaces/trips-repository'
import { InMemoryLinksRepository } from '@/repositories/in-memory/in-memory-links-repository'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'

describe('DeleteLinkUseCase', () => {
  let linkRepository: InMemoryLinksRepository
  let tripsRepository: InMemoryTripsRepository
  let sut: DeleteLinkUseCase
  let user: User
  let trip: TripResponse
  let link: Link

  beforeEach(async () => {
    const data = new GenerateData()
    linkRepository = data.linksRepository
    tripsRepository = data.tripsRepository
    sut = new DeleteLinkUseCase(data.linksRepository, data.tripsRepository)

    user = await data.createUser()

    trip = await data.createTrip()

    link = await data.createLink()
  })

  it('should be able to delete a link', async () => {
    await sut.execute({ linkId: link.id, userId: user.id })

    const deletedLink = await linkRepository.findById(link.id)

    expect(deletedLink).toBeNull()
  })
})
