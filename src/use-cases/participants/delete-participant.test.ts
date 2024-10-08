import { beforeEach, describe, expect, it } from 'vitest'
import { Participant, User } from '@prisma/client'
import { GenerateData } from '@/tests/generate-data'
import { DeleteParticipantUseCase } from './delete-participant'
import { InMemoryParticipantsRepository } from '@/repositories/in-memory/in-memory-participants-repository'
import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'

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

    owner = trip.Participant[0]

    participant = trip.Participant[1]
  })

  it('should be able to delete a participant', async () => {
    await sut.execute({ participantId: participant.id, userId: user.id })

    const deletedParticipant = await participantsRepository.findById(
      participant.id,
    )

    expect(deletedParticipant).toBeNull()
  })

  it('should not be able to delete a participant if participant does not exist', async () => {
    const promise = sut.execute({ participantId: 'wrong_id', userId: user.id })

    expect(promise).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to delete a participant if user id is not valid', async () => {
    const promise = sut.execute({
      participantId: participant.id,
      userId: 'wrong_id',
    })

    expect(promise).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should not be able to delete a participant if user id is not valid', async () => {
    const promise = sut.execute({
      participantId: participant.id,
      userId: 'wrong_id',
    })

    expect(promise).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should not be able to delete a participant if participant is trip owner', async () => {
    const promise = sut.execute({
      participantId: owner.id,
      userId: user.id,
    })

    expect(promise).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
