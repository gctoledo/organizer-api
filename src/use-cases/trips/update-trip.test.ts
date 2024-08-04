import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateTripUseCase } from './update-trip'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidDateError } from '@/errors/invalid-date'
import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'
import { User } from '@prisma/client'
import { TripResponse } from '@/repositories/interfaces/trips-repository'

describe('UpdateTripUseCase', () => {
  let participantsRepository: InMemoryParticipantsRepository
  let usersRepository: InMemoryUserRepository
  let tripsRepository: InMemoryTripsRepository
  let sut: UpdateTripUseCase
  let user: User
  let trip: TripResponse

  beforeEach(async () => {
    participantsRepository = new InMemoryParticipantsRepository()
    usersRepository = new InMemoryUserRepository()
    tripsRepository = new InMemoryTripsRepository(participantsRepository)
    sut = new UpdateTripUseCase(tripsRepository, usersRepository)

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

  it('should be able to update a trip', async () => {
    const result = await sut.execute({
      ownerId: trip.userId,
      tripId: trip.id,
      destination: 'Los Angeles',
      starts_at: new Date('2030-05-20T00:00:00.000Z'),
    })

    expect(result).toEqual({
      ...trip,
      destination: 'Los Angeles',
      starts_at: new Date('2030-05-20T00:00:00.000Z'),
      participants: undefined,
    })
  })

  it('should not be to update trip if trip was not found', async () => {
    const promise = sut.execute({
      ownerId: user.id,
      tripId: 'invalid_id',
      destination: 'Los Angeles',
      starts_at: new Date('2030-05-20T00:00:00.000Z'),
    })

    expect(promise).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be to update trip if owner was not found', async () => {
    const promise = sut.execute({
      ownerId: 'invalid_id',
      tripId: trip.id,
      destination: 'Los Angeles',
      starts_at: new Date('2030-05-20T00:00:00.000Z'),
    })

    expect(promise).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should not be able to update trip if start date is after ends date', async () => {
    const promise = sut.execute({
      ownerId: trip.userId,
      tripId: trip.id,
      destination: 'Los Angeles',
      starts_at: new Date('2030-07-15T00:00:00.000Z'),
    })

    expect(promise).rejects.toBeInstanceOf(InvalidDateError)
  })

  it('should not be able to update trip if start date is before today', async () => {
    const promise = sut.execute({
      ownerId: trip.userId,
      tripId: trip.id,
      destination: 'Los Angeles',
      starts_at: new Date('2015-07-15T00:00:00.000Z'),
    })

    expect(promise).rejects.toBeInstanceOf(InvalidDateError)
  })
})
