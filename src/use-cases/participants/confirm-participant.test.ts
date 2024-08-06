import { beforeEach, describe, expect, it } from 'vitest'
import { ConfirmParticipantUseCase } from './confirm-participant'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { Participant, Trip } from '@prisma/client'
import { GenerateData } from '@/tests/generate-data'

describe('ConfirmParticipantUseCase', () => {
  let participantsRepository: InMemoryParticipantsRepository
  let sut: ConfirmParticipantUseCase
  let trip: Trip
  let participants: Participant[]

  beforeEach(async () => {
    const data = new GenerateData()
    sut = new ConfirmParticipantUseCase(data.participantsRepository)
    participantsRepository = data.participantsRepository

    await data.createUser()

    const createdTrip = await data.createTrip()

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
