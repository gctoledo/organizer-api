import { beforeEach, describe, expect, it } from 'vitest'
import { CreateActivityUseCase } from './create-activity'
import { GenerateData } from '@/tests/generate-data'
import { User } from '@prisma/client'
import { TripResponse } from '@/repositories/interfaces/trips-repository'
import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'
import { InvalidDateError } from '@/errors/invalid-date'

describe('CreateActivityUseCase', async () => {
  let user: User
  let trip: TripResponse
  let sut: CreateActivityUseCase

  beforeEach(async () => {
    const data = new GenerateData()

    sut = new CreateActivityUseCase(
      data.activitiesRepository,
      data.tripsRepository,
    )

    user = await data.createUser()

    trip = await data.createTrip()
  })

  it('should be able to create a activity', async () => {
    const { activity } = await sut.execute({
      title: 'Shopping',
      occurs_at: new Date('2030-05-16T00:00:00.000Z'),
      tripId: trip.id,
      userId: user.id,
    })

    expect(activity).toEqual(
      expect.objectContaining({
        title: 'Shopping',
      }),
    )
  })

  it('should not be able to create a activity if trip was not found', async () => {
    const promise = sut.execute({
      title: 'Shopping',
      occurs_at: new Date('2030-05-16T00:00:00.000Z'),
      tripId: 'wrong_id',
      userId: user.id,
    })

    expect(promise).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to create a activity if user id is invalid', async () => {
    const promise = sut.execute({
      title: 'Shopping',
      occurs_at: new Date('2030-05-16T00:00:00.000Z'),
      tripId: trip.id,
      userId: 'wrong_id',
    })

    expect(promise).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should not be able to create a activity if occurs_at is before than trip start day', async () => {
    const promise = sut.execute({
      title: 'Shopping',
      occurs_at: new Date('2030-05-14T00:00:00.000Z'),
      tripId: trip.id,
      userId: user.id,
    })

    expect(promise).rejects.toBeInstanceOf(InvalidDateError)
  })

  it('should not be able to create a activity if occurs_at is after than trip end day', async () => {
    const promise = sut.execute({
      title: 'Shopping',
      occurs_at: new Date('2030-06-15T00:00:00.000Z'),
      tripId: trip.id,
      userId: user.id,
    })

    expect(promise).rejects.toBeInstanceOf(InvalidDateError)
  })
})
