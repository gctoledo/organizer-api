import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteTripUseCase } from './delete-trip'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UnauthorizedError } from '@/errors/unauthorized'
import { NotFoundError } from '@/errors/not-found'
import { User } from '@prisma/client'

describe('DeleteTripUseCase', () => {
  let usersRepository: InMemoryUserRepository
  let participantsRepository: InMemoryParticipantsRepository
  let tripsRepository: InMemoryTripsRepository
  let sut: DeleteTripUseCase
  let user: User

  beforeEach(async () => {
    participantsRepository = new InMemoryParticipantsRepository()
    usersRepository = new InMemoryUserRepository()
    tripsRepository = new InMemoryTripsRepository(participantsRepository)
    sut = new DeleteTripUseCase(tripsRepository)

    user = await usersRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })
  })

  it('should be able to delete a trip', async () => {
    const trip = await tripsRepository.create({
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

    await sut.execute({ id: trip.id, ownerId: user.id })

    const deletedTrip = await tripsRepository.findById(trip.id)

    const deletedParticipants = await participantsRepository.findByTripId(
      trip.id,
    )

    expect(deletedTrip).toBeNull()
    expect(deletedParticipants).toEqual([])
  })

  it('should not be able to delete a trip if user is not owner', async () => {
    const trip = await tripsRepository.create({
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

    const promise = sut.execute({ id: trip.id, ownerId: 'wrong_id' })

    expect(promise).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should not be able to delete a trip if trip does not exists', async () => {
    const promise = sut.execute({ id: 'wrong_id', ownerId: user.id })

    expect(promise).rejects.toBeInstanceOf(NotFoundError)
  })
})
