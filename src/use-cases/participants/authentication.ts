import { InvalidCredentialsError } from '@/errors/invalid-credentials'
import { InvalidParticipantError } from '@/errors/invalid-participant-error'
import { ParticipantsRepository } from '@/repositories/interfaces/participants-repository'

interface AuthenticationParticipantParams {
  email: string
  tridId: string
}

export class AuthenticationParticipantUseCase {
  constructor(private participantsRepository: ParticipantsRepository) {}

  async execute({ email, tridId }: AuthenticationParticipantParams) {
    const participants = await this.participantsRepository.findByTripId(tridId)

    const participant = participants.find(
      (participant) => participant.email === email,
    )

    const tripOwner = participants.find(
      (participant) => participant.owner === true,
    )

    if (!participant) {
      throw new InvalidCredentialsError()
    }

    if (participant.email === tripOwner?.email) {
      throw new InvalidParticipantError()
    }

    return { participant }
  }
}
