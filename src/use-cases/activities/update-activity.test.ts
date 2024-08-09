import { beforeEach, describe, expect, it } from 'vitest'
import { Activity, User } from '@prisma/client'
import { UpdateActivityUseCase } from './update-activity'
import { GenerateData } from '@/tests/generate-data'
import { TripResponse } from '@/repositories/interfaces/trips-repository'
import { NotFoundError } from '@/errors/not-found'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { UnauthorizedError } from '@/errors/unauthorized'

describe('UpdateActivityUseCase', () => {
  let sut: UpdateActivityUseCase
  let user: User
  let tripsRepository: InMemoryTripsRepository
  let trip: TripResponse
  let activity: Activity

  beforeEach(async () => {
    const data = new GenerateData()

    tripsRepository = data.tripsRepository

    sut = new UpdateActivityUseCase(
      data.activitiesRepository,
      data.tripsRepository,
    )

    user = await data.createUser()

    trip = await data.createTrip()

    activity = await data.createActivity()
  })

  it('should be able to update a activity', async () => {
    const { updatedActivity } = await sut.execute({
      activityId: activity.id,
      userId: user.id,
      title: 'Praia',
      occurs_at: new Date('2030-05-17T00:00:00.000Z'),
    })

    expect(updatedActivity).toEqual(
      expect.objectContaining({
        title: 'Praia',
        occurs_at: new Date('2030-05-17T00:00:00.000Z'),
        tripId: trip.id,
      }),
    )
  })

  it('should not be able to update a activity if activity is not found', async () => {
    const promise = sut.execute({
      activityId: 'wrong_id',
      userId: user.id,
      title: 'Praia',
      occurs_at: new Date('2030-05-17T00:00:00.000Z'),
    })

    expect(promise).rejects.toBeInstanceOf(NotFoundError)
  })
})
