import { beforeEach, describe, expect, it } from 'vitest'
import { CreateParticipantUseCase } from './create-participant'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'

import { TripResponse } from '@/repositories/interfaces/trips-repository'
import { User } from '@prisma/client'
import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'
import { GenerateData } from '@/tests/generate-data'

describe('CreateParticipantsUseCase', () => {
  let participantsRepository: InMemoryParticipantsRepository
  let sut: CreateParticipantUseCase
  let user: User
  let trip: TripResponse

  beforeEach(async () => {
    const data = new GenerateData()
    sut = new CreateParticipantUseCase(
      data.participantsRepository,
      data.tripsRepository,
    )
    participantsRepository = data.participantsRepository

    user = await data.createUser()
    trip = await data.createTrip()
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
