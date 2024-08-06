import { User } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateLinkUseCase } from './create-link'
import { TripResponse } from '@/repositories/interfaces/trips-repository'
import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'
import { GenerateData } from '@/tests/generate-data'

describe('CreateLinkUseCase', () => {
  let sut: CreateLinkUseCase
  let user: User
  let trip: TripResponse

  beforeEach(async () => {
    const data = new GenerateData()
    sut = new CreateLinkUseCase(data.linksRepository, data.tripsRepository)

    user = await data.createUser()

    trip = await data.createTrip()
  })

  it('should be able to create a link', async () => {
    const { link } = await sut.execute({
      title: 'Airbnb',
      tripId: trip.id,
      userId: user.id,
      url: 'https://www.airbnb.com.br',
    })

    expect(link).toEqual(
      expect.objectContaining({
        title: 'Airbnb',
        tripId: trip.id,
        url: 'https://www.airbnb.com.br',
      }),
    )
  })

  it('should not be able to create a link if trip was not found', async () => {
    const promise = sut.execute({
      title: 'Airbnb',
      tripId: 'wrong_id',
      userId: user.id,
      url: 'https://www.airbnb.com.br',
    })

    expect(promise).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to create a link if user id does not match with owner id', async () => {
    const promise = sut.execute({
      title: 'Airbnb',
      tripId: trip.id,
      userId: 'wrong_id',
      url: 'https://www.airbnb.com.br',
    })

    expect(promise).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
