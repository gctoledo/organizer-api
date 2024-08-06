import { beforeEach, describe, expect, it } from 'vitest'
import { ConfirmParticipantUseCase } from './confirm-participant'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { Participant, Trip, User } from '@prisma/client'

describe('ConfirmParticipantUseCase', () => {
  let usersRepository: InMemoryUserRepository
  let participantsRepository: InMemoryParticipantsRepository
  let tripsRepository: InMemoryTripsRepository
  let sut: ConfirmParticipantUseCase
  let user: User
  let trip: Trip
  let participants: Participant[]

  beforeEach(async () => {
    usersRepository = new InMemoryUserRepository()
    participantsRepository = new InMemoryParticipantsRepository()
    tripsRepository = new InMemoryTripsRepository(participantsRepository)
    sut = new ConfirmParticipantUseCase(participantsRepository)

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
        { email: 'john@doe.com', owner: true },
        { email: 'albert@doe.com', owner: false },
        { email: 'robert@doe.com', owner: false },
      ],
    })

    trip = createdTrip
    participants = createdTrip.participants
  })

  it('should be able to confirm participant', async () => {
    await sut.execute(participants[1].id)

    const tripParticipants = await participantsRepository.findByTripId(trip.id)

    expect(tripParticipants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: 'john@doe.com',
          is_confirmed: true,
          owner: true,
        }),
        expect.objectContaining({
          email: 'albert@doe.com',
          is_confirmed: true,
        }),
        expect.objectContaining({
          email: 'robert@doe.com',
          is_confirmed: false,
        }),
      ]),
    )
  })
})
