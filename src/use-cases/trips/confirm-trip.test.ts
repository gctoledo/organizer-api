import { beforeEach, describe, expect, it } from 'vitest'
import { ConfirmTripUseCase } from './confirm-trip'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { Trip, User } from '@prisma/client'

describe('ConfirmTripUseCase', () => {
  let participantsRepository: InMemoryParticipantsRepository
  let usersRepository: InMemoryUserRepository
  let tripsRepository: InMemoryTripsRepository
  let sut: ConfirmTripUseCase
  let user: User
  let trip: Trip

  beforeEach(async () => {
    participantsRepository = new InMemoryParticipantsRepository()
    usersRepository = new InMemoryUserRepository()
    tripsRepository = new InMemoryTripsRepository(participantsRepository)
    sut = new ConfirmTripUseCase(tripsRepository)

    user = await usersRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const createdTrip = await tripsRepository.create({
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

    trip = createdTrip.trip
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
