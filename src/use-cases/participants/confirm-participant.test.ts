import { describe, expect, it } from 'vitest'
import { ConfirmParticipantUseCase } from './confirm-participant'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'

describe('ConfirmParticipantUseCase', () => {
  const makeSut = () => {
    const usersRepository = new InMemoryUserRepository()

    const participantsRepository = new InMemoryParticipantsRepository()

    const tripsRepository = new InMemoryTripsRepository(participantsRepository)

    const sut = new ConfirmParticipantUseCase(participantsRepository)

    return { participantsRepository, sut, usersRepository, tripsRepository }
  }

  it('should be able to confirm participant', async () => {
    const { participantsRepository, sut, tripsRepository, usersRepository } =
      makeSut()

    const user = await usersRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const { trip, participants } = await tripsRepository.create({
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

    await sut.execute(participants[0].id)

    const tripParticipants = await participantsRepository.findByTripId(trip.id)

    expect(tripParticipants).toEqual(
      expect.arrayContaining([
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
