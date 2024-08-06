import { beforeEach, describe, expect, it } from 'vitest'
import { CreateParticipantUseCase } from './create-participant'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { TripResponse } from '@/repositories/interfaces/trips-repository'
import { User } from '@prisma/client'
import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'

describe('CreateParticipantsUseCase', () => {
  let usersRepository: InMemoryUserRepository
  let tripsRepository: InMemoryTripsRepository
  let participantsRepository: InMemoryParticipantsRepository
  let sut: CreateParticipantUseCase
  let user: User
  let trip: TripResponse

  beforeEach(async () => {
    usersRepository = new InMemoryUserRepository()
    participantsRepository = new InMemoryParticipantsRepository()
    tripsRepository = new InMemoryTripsRepository(participantsRepository)
    sut = new CreateParticipantUseCase(participantsRepository, tripsRepository)

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

  it('should be able to create participant', async () => {
    const { participant } = await sut.execute({
      tripId: trip.id,
      userId: user.id,
      email: 'roger@doe.com',
      first_name: 'Roger',
    })

    const updatedParticipants = await participantsRepository.findByTripId(
      trip.id,
    )

    expect(updatedParticipants).toHaveLength(4)
    expect(participant).toEqual(
      expect.objectContaining({
        email: 'roger@doe.com',
        first_name: 'Roger',
        tripId: trip.id,
        owner: false,
        is_confirmed: false,
      }),
    )
  })

  it('should not be able to create participant if trip was not found', async () => {
    const promise = sut.execute({
      tripId: 'wrong_id',
      userId: user.id,
      email: 'roger@doe.com',
      first_name: 'Roger',
    })

    expect(promise).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to create participant if invalid user id is provided', async () => {
    const promise = sut.execute({
      tripId: trip.id,
      userId: 'wrong_id',
      email: 'roger@doe.com',
      first_name: 'Roger',
    })

    expect(promise).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
