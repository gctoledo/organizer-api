import { User } from '@prisma/client'
import { describe, expect, beforeEach, it } from 'vitest'
import { GetTripDetailsUseCase } from './get-trip-details'
import { TripResponse } from '@/repositories/interfaces/trips-repository'
import { UnauthorizedError } from '@/errors/unauthorized'
import { NotFoundError } from '@/errors/not-found'
import { GenerateData } from '@/tests/generate-data'

describe('GetTripUseCase', () => {
  let user: User
  let trip: TripResponse
  let sut: GetTripDetailsUseCase

  beforeEach(async () => {
    const data = new GenerateData()
    sut = new GetTripDetailsUseCase(data.tripsRepository)

    user = await data.createUser()

    trip = await data.createTrip()
  })

  it('should be able to get a trip with user id', async () => {
    const result = await sut.execute({ tripId: trip.id, credential: user.id })

    expect(result.trip).toEqual(
      expect.objectContaining({
        destination: 'New York',
        userId: user.id,
        Participant: expect.arrayContaining([
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
        Participant: expect.arrayContaining([
          expect.objectContaining({
            email: 'albert@doe.com',
            owner: false,
          }),
        ]),
      }),
    )
  })

  it('should not be able to get a trip with invalid credential', async () => {
    const promise = sut.execute({
      tripId: trip.id,
      credential: 'invalid_credential',
    })

    expect(promise).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should not be able to get a trip if trip does not exist', async () => {
    const promise = sut.execute({
      tripId: 'invalid_id',
      credential: user.id,
    })

    expect(promise).rejects.toBeInstanceOf(NotFoundError)
  })
})
