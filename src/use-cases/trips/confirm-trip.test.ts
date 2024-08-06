import { Trip } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'
import { ConfirmTripUseCase } from './confirm-trip'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { GenerateData } from '@/tests/generate-data'

describe('ConfirmTripUseCase', () => {
  let tripsRepository: InMemoryTripsRepository
  let sut: ConfirmTripUseCase
  let trip: Trip

  beforeEach(async () => {
    const data = new GenerateData()
    sut = new ConfirmTripUseCase(data.tripsRepository)
    tripsRepository = data.tripsRepository

    await data.createUser()

    trip = await data.createTrip()
  })

  it('should be able to confirm trip', async () => {
    await sut.execute(trip.id)

    const confirmedTrip = await tripsRepository.findById(trip.id)

    expect(confirmedTrip).toEqual(
      expect.objectContaining({
        is_confirmed: true,
      }),
    )
  })
})
