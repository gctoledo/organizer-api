import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserTripsUseCase } from './get-user-trips'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { User } from '@prisma/client'

describe('GetUserTripsUseCase', () => {
  let usersRepository: InMemoryUserRepository
  let participantsRepository: InMemoryParticipantsRepository
  let tripsRepository: InMemoryTripsRepository
  let sut: GetUserTripsUseCase
  let user: User

  beforeEach(async () => {
    usersRepository = new InMemoryUserRepository()
    participantsRepository = new InMemoryParticipantsRepository()
    tripsRepository = new InMemoryTripsRepository(participantsRepository)
    sut = new GetUserTripsUseCase(tripsRepository)

    user = await usersRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const tripsToCreate = [
      {
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
      },
      {
        data: {
          destination: 'Los Angeles',
          starts_at: new Date('2030-08-15T00:00:00.000Z'),
          ends_at: new Date('2030-09-15T00:00:00.000Z'),
          userId: user.id,
        },
        participants: [
          { email: 'john@doe.com', owner: false },
          { email: 'roger@doe.com', owner: false },
        ],
      },
    ]

    await Promise.all(
      tripsToCreate.map(async (trip) => {
        const result = await tripsRepository.create({
          data: trip.data,
          participants: trip.participants,
        })

        return result
      }),
    )
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
