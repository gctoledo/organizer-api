import { describe, expect, it } from 'vitest'
import { DeleteTripUseCase } from './delete-trip'
import { InMemoryTripsRepository } from '@/repositories/in-memory/in-memory-trips-repository'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'

describe('DeleteTripUseCase', () => {
  const makeSut = () => {
    const usersRepository = new InMemoryUserRepository()

    const participantsRepository = new InMemoryParticipantsRepository()

    const tripsRepository = new InMemoryTripsRepository(participantsRepository)

    const sut = new DeleteTripUseCase(tripsRepository)

    return { tripsRepository, participantsRepository, usersRepository, sut }
  }

  it('should be able to delete a trip', async () => {
    const { sut, tripsRepository, usersRepository, participantsRepository } =
      makeSut()

    const user = await usersRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const { trip } = await tripsRepository.create({
      data: {
        destination: 'New York',
        starts_at: new Date('2030-05-15T00:00:00.000Z'),
        ends_at: new Date('2030-06-15T00:00:00.000Z'),
        userId: user.id,
      },
      participants: [{ email: 'albert@doe.com' }, { email: 'robert@doe.com' }],
    })

    await sut.execute({ id: trip.id, ownerId: user.id })

    const deletedTrip = await tripsRepository.findById(trip.id)

    const deletedParticipants = await participantsRepository.findByTripId(
      trip.id,
    )

    expect(deletedTrip).toBeNull()
    expect(deletedParticipants).toEqual([])
  })
})
