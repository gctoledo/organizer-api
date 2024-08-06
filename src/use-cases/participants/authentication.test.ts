import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticationParticipantUseCase } from './authentication'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { Trip, User } from '@prisma/client'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { InvalidCredentialsError } from '@/errors/invalid-credentials'

describe('AuthenticationParticipantsUseCase', () => {
  let usersRepository: InMemoryUserRepository
  let participantsRepository: InMemoryParticipantsRepository
  let tripsRepository: InMemoryTripsRepository
  let sut: AuthenticationParticipantUseCase
  let user: User
  let trip: Trip

  beforeEach(async () => {
    usersRepository = new InMemoryUserRepository()
    participantsRepository = new InMemoryParticipantsRepository()
    tripsRepository = new InMemoryTripsRepository(participantsRepository)
    sut = new AuthenticationParticipantUseCase(participantsRepository)

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
  })

  it('should be able to authentication participant', async () => {
    const { participant } = await sut.execute({
      email: 'albert@doe.com',
      tridId: trip.id,
    })

    expect(participant).toEqual(
      expect.objectContaining({
        email: 'albert@doe.com',
        tripId: trip.id,
        owner: false,
      }),
    )
  })

  it('should not be able to authentication participant if email is invalid', async () => {
    const promise = sut.execute({
      email: 'wrong_email',
      tridId: trip.id,
    })

    expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
