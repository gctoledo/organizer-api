import { beforeEach, describe, expect, it } from 'vitest'
import { Participant, User } from '@prisma/client'
import { GenerateData } from '@/tests/generate-data'
import { DeleteParticipantUseCase } from './delete-participant'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'

describe('DeleteParticipantUseCase', () => {
  let sut: DeleteParticipantUseCase
  let participantsRepository: InMemoryParticipantsRepository
  let user: User
  let owner: Participant
  let participant: Participant

  beforeEach(async () => {
    const data = new GenerateData()
    sut = new DeleteParticipantUseCase(
      data.participantsRepository,
      data.tripsRepository,
    )
    participantsRepository = data.participantsRepository

    user = await data.createUser()

    const trip = await data.createTrip()

    owner = trip.participants[0]

    participant = trip.participants[1]
  })

  it('should be able to delete a participant', async () => {
    await sut.execute({ participantId: participant.id, userId: user.id })

    const deletedParticipant = await participantsRepository.findById(
      participant.id,
    )

    expect(deletedParticipant).toBeNull()
  })
})
