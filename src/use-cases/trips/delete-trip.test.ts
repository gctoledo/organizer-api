import { Trip, User } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteTripUseCase } from './delete-trip'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { UnauthorizedError } from '@/errors/unauthorized'
import { NotFoundError } from '@/errors/not-found'
import { GenerateData } from '@/tests/generate-data'

describe('DeleteTripUseCase', () => {
  let tripsRepository: InMemoryTripsRepository
  let participantsRepository: InMemoryParticipantsRepository
  let sut: DeleteTripUseCase
  let trip: Trip
  let user: User

  beforeEach(async () => {
    const data = new GenerateData()
    sut = new DeleteTripUseCase(data.tripsRepository)
    tripsRepository = data.tripsRepository
    participantsRepository = data.participantsRepository

    user = await data.createUser()

    trip = await data.createTrip()
  })

  it('should be able to delete a trip', async () => {
    await sut.execute({ id: trip.id, ownerId: user.id })

    const deletedTrip = await tripsRepository.findById(trip.id)

    const deletedParticipants = await participantsRepository.findByTripId(
      trip.id,
    )

    expect(deletedTrip).toBeNull()
    expect(deletedParticipants).toEqual([])
  })

  it('should not be able to delete a trip if user is not owner', async () => {
    const promise = sut.execute({ id: trip.id, ownerId: 'wrong_id' })

    expect(promise).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should not be able to delete a trip if trip does not exists', async () => {
    const promise = sut.execute({ id: 'wrong_id', ownerId: user.id })

    expect(promise).rejects.toBeInstanceOf(NotFoundError)
  })
})
