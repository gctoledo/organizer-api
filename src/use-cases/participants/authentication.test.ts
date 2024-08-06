import { Trip } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticationParticipantUseCase } from './authentication'
import { InvalidCredentialsError } from '@/errors/invalid-credentials'
import { InvalidParticipantError } from '@/errors/invalid-participant-error'
import { GenerateData } from '@/tests/generate-data'

describe('AuthenticationParticipantsUseCase', () => {
  let sut: AuthenticationParticipantUseCase
  let trip: Trip

  beforeEach(async () => {
    const data = new GenerateData()
    sut = new AuthenticationParticipantUseCase(data.participantsRepository)

    await data.createUser()

    trip = await data.createTrip()
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

  it('should not be able to authentication participant if email belongs trip owner', async () => {
    const promise = sut.execute({
      email: 'john@doe.com',
      tridId: trip.id,
    })

    expect(promise).rejects.toBeInstanceOf(InvalidParticipantError)
  })
})
