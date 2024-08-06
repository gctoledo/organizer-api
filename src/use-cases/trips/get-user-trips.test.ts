import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserTripsUseCase } from './get-user-trips'
import { User } from '@prisma/client'
import { GenerateData } from '@/tests/generate-data'

describe('GetUserTripsUseCase', () => {
  let sut: GetUserTripsUseCase
  let user: User

  beforeEach(async () => {
    const data = new GenerateData()
    sut = new GetUserTripsUseCase(data.tripsRepository)

    user = await data.createUser()

    await data.createManyTrips()
  })

  it('should be able to get user trips', async () => {
    const { trips } = await sut.execute(user.id)

    expect(trips).toHaveLength(2)
    expect(trips).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          destination: 'New York',
          participants: expect.arrayContaining([
            expect.objectContaining({
              email: 'albert@doe.com',
            }),
          ]),
        }),
        expect.objectContaining({
          destination: 'Los Angeles',
          participants: expect.arrayContaining([
            expect.objectContaining({
              email: 'john@doe.com',
            }),
          ]),
        }),
      ]),
    )
  })
})
