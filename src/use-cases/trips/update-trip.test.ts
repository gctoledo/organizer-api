import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateTripUseCase } from './update-trip'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidDateError } from '@/errors/invalid-date'
import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'

describe('UpdateTripUseCase', () => {
  let participantsRepository: InMemoryParticipantsRepository

  let usersRepository: InMemoryUserRepository

  let tripsRepository: InMemoryTripsRepository

  let sut: UpdateTripUseCase

  beforeEach(() => {
    participantsRepository = new InMemoryParticipantsRepository()
    usersRepository = new InMemoryUserRepository()
    tripsRepository = new InMemoryTripsRepository(participantsRepository)
    sut = new UpdateTripUseCase(tripsRepository, usersRepository)
  })

  it('should be able to update a trip', async () => {
    const user = await usersRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const { trip } = await tripsRepository.create({
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
    })
  })

  it('should not be to update trip if trip was not found', async () => {
    const user = await usersRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const promise = sut.execute({
      ownerId: user.id,
      tripId: 'invalid_id',
      destination: 'Los Angeles',
      starts_at: new Date('2030-05-20T00:00:00.000Z'),
    })

    expect(promise).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be to update trip if owner was not found', async () => {
    const user = await usersRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const { trip } = await tripsRepository.create({
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

    const promise = sut.execute({
      ownerId: 'invalid_id',
      tripId: trip.id,
      destination: 'Los Angeles',
      starts_at: new Date('2030-05-20T00:00:00.000Z'),
    })

    expect(promise).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should not be able to update trip if start date is after ends date', async () => {
    const user = await usersRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const { trip } = await tripsRepository.create({
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

    const promise = sut.execute({
      ownerId: trip.userId,
      tripId: trip.id,
      destination: 'Los Angeles',
      starts_at: new Date('2030-07-15T00:00:00.000Z'),
    })

    expect(promise).rejects.toBeInstanceOf(InvalidDateError)
  })
})
