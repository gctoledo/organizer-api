import { describe, expect, beforeEach, it } from 'vitest'
import { GetTripUseCase } from './get-trip'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { User } from '@prisma/client'
import { TripResponse } from '@/repositories/interfaces/trips-repository'
import { UnauthorizedError } from '@/errors/unauthorized'

describe('GetTripUseCase', () => {
  let participantsRepository: InMemoryParticipantsRepository
  let usersRepository: InMemoryUserRepository
  let tripsRepository: InMemoryTripsRepository
  let user: User
  let trip: TripResponse
  let sut: GetTripUseCase

  beforeEach(async () => {
    participantsRepository = new InMemoryParticipantsRepository()
    usersRepository = new InMemoryUserRepository()
    tripsRepository = new InMemoryTripsRepository(participantsRepository)
    sut = new GetTripUseCase(tripsRepository)

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
        { email: 'albert@doe.com', owner: false },
        { email: 'robert@doe.com', owner: false },
      ],
    })

    trip = createdTrip
  })

  it('should be able to get a trip with user id', async () => {
    const result = await sut.execute({ tripId: trip.id, credential: user.id })

    expect(result.trip).toEqual(
      expect.objectContaining({
        destination: 'New York',
        userId: user.id,
        participants: expect.arrayContaining([
          expect.objectContaining({
            email: 'albert@doe.com',
            owner: false,
          }),
        ]),
      }),
    )
  })

  it('should be able to get a trip with participant email', async () => {
    const result = await sut.execute({
      tripId: trip.id,
      credential: 'albert@doe.com',
    })

    expect(result.trip).toEqual(
      expect.objectContaining({
        destination: 'New York',
        userId: user.id,
        participants: expect.arrayContaining([
          expect.objectContaining({
            email: 'albert@doe.com',
            owner: false,
          }),
        ]),
      }),
    )
  })

  it('should be able to get a trip with invalid credential', async () => {
    const promise = sut.execute({
      tripId: trip.id,
      credential: 'invalid_credential',
    })

    expect(promise).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
