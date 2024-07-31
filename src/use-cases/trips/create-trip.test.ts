import { describe, expect, it } from 'vitest'
import { CreateTripUseCase } from './create-trip'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'

describe('CreateTripUseCase', () => {
  const makeSut = () => {
    const participantsRepository = new InMemoryParticipantsRepository()

    const tripsRepository = new InMemoryTripsRepository(participantsRepository)

    const usersRepository = new InMemoryUserRepository()

    const sut = new CreateTripUseCase(tripsRepository, usersRepository)

    return { tripsRepository, usersRepository, sut }
  }

  it('should be able to create trip', async () => {
    const { sut, usersRepository } = makeSut()

    const user = await usersRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const { participants, trip } = await sut.execute({
      destination: 'New York',
      starts_at: new Date('2030-05-15T00:00:00.000Z'),
      ends_at: new Date('2030-06-15T00:00:00.000Z'),
      owner_id: user.id,
      participants_to_invite: ['albert@doe.com', 'robert@doe.com'],
    })

    expect(participants).toHaveLength(3)
    expect(trip.destination).toEqual('New York')
    expect(participants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: 'john@doe.com',
        }),
        expect.objectContaining({
          email: 'albert@doe.com',
        }),
        expect.objectContaining({
          email: 'robert@doe.com',
        }),
      ]),
    )
    expect(trip.is_confirmed).toEqual(false)
  })
})
