import { User } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateTripUseCase } from './create-trip'
import { InvalidDateError } from '@/errors/invalid-date'
import { NotFoundError } from '@/errors/not-found'
import { GenerateData } from '@/tests/generate-data'

describe('CreateTripUseCase', () => {
  let sut: CreateTripUseCase
  let user: User

  beforeEach(async () => {
    const data = new GenerateData()
    sut = new CreateTripUseCase(
      data.tripsRepository,
      data.usersRepository,
      'http://localhost:3333',
    )

    user = await data.createUser()
  })

  it('should be able to create trip', async () => {
    const { trip } = await sut.execute({
      destination: 'New York',
      starts_at: new Date('2030-05-15T00:00:00.000Z'),
      ends_at: new Date('2030-06-15T00:00:00.000Z'),
      owner_id: user.id,
      participants_to_invite: ['albert@doe.com', 'robert@doe.com'],
    })

    expect(trip.Participant).toHaveLength(3)
    expect(trip.destination).toEqual('New York')
    expect(trip.Participant).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: user.email,
          is_confirmed: true,
          owner: true,
        }),
        expect.objectContaining({
          email: 'albert@doe.com',
          is_confirmed: false,
          owner: false,
        }),
        expect.objectContaining({
          email: 'robert@doe.com',
          is_confirmed: false,
          owner: false,
        }),
      ]),
    )
    expect(trip.is_confirmed).toEqual(false)
  })

  it('should not be able to create trip if start date is after ends date', async () => {
    const promise = sut.execute({
      destination: 'New York',
      starts_at: new Date('2030-05-15T00:00:00.000Z'),
      ends_at: new Date('2030-04-15T00:00:00.000Z'),
      owner_id: user.id,
      participants_to_invite: ['albert@doe.com', 'robert@doe.com'],
    })

    expect(promise).rejects.toBeInstanceOf(InvalidDateError)
  })

  it('should not be able to create trip if start date is before today', async () => {
    const promise = sut.execute({
      destination: 'New York',
      starts_at: new Date('2015-05-15T00:00:00.000Z'),
      ends_at: new Date('2015-08-15T00:00:00.000Z'),
      owner_id: user.id,
      participants_to_invite: ['albert@doe.com', 'robert@doe.com'],
    })

    expect(promise).rejects.toBeInstanceOf(InvalidDateError)
  })

  it('should not be able to create trip if owner was not found', async () => {
    const promise = sut.execute({
      destination: 'New York',
      starts_at: new Date('2030-05-15T00:00:00.000Z'),
      ends_at: new Date('2030-06-15T00:00:00.000Z'),
      owner_id: 'invalid_id',
      participants_to_invite: ['albert@doe.com', 'robert@doe.com'],
    })

    expect(promise).rejects.toBeInstanceOf(NotFoundError)
  })
})
