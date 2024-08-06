import { beforeEach, describe, expect, it } from 'vitest'
import { CreateLinkUseCase } from './create-link'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { User } from '@prisma/client'
import { InMemoryLinksRepository } from '@/repositories/in-memory/in-memory-links-repository'
import { TripResponse } from '@/repositories/interfaces/trips-repository'
import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'

describe('CreateLinkUseCase', () => {
  let usersRepository: InMemoryUserRepository
  let participantsRepository: InMemoryParticipantsRepository
  let tripsRepository: InMemoryTripsRepository
  let linksRepository: InMemoryLinksRepository
  let sut: CreateLinkUseCase
  let user: User
  let trip: TripResponse

  beforeEach(async () => {
    usersRepository = new InMemoryUserRepository()
    participantsRepository = new InMemoryParticipantsRepository()
    tripsRepository = new InMemoryTripsRepository(participantsRepository)
    linksRepository = new InMemoryLinksRepository()
    sut = new CreateLinkUseCase(linksRepository, tripsRepository)

    user = await usersRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const createdTrip = await tripsRepository.create({
      data: {
        destination: 'New York',
        starts_at: new Date('2030-05-15T00:00:00.000Z'),
        ends_at: new Date('2030-06-15T00:00:00.000Z'),
        userId: user.id,
      },
      participants: [
        { email: 'john@doe.com', owner: true },
        { email: 'albert@doe.com', owner: false },
        { email: 'robert@doe.com', owner: false },
      ],
    })

    trip = createdTrip
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
