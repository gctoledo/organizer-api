import { NotFoundError } from '@/errors/not-found'
import { UnauthorizedError } from '@/errors/unauthorized'
import { ParticipantsRepository } from '@/repositories/interfaces/participants-repository'
import { TripRepository } from '@/repositories/interfaces/trips-repository'
import nodemailer from '@/lib/nodemailer'
import { GenerateConfirmationLink } from '@/helpers/generate-confirmation-link'

interface CreateParticipantUseCaseParams {
  userId: string
  tripId: string
  email: string
  first_name?: string
}

export class CreateParticipantUseCase {
  constructor(
    private participantsRepository: ParticipantsRepository,
    private tripsRepository: TripRepository,
    private baseURL: string,
  ) {}

  async execute({
    userId,
    tripId,
    email,
    first_name,
  }: CreateParticipantUseCaseParams) {
    const trip = await this.tripsRepository.findById(tripId)

    if (!trip) {
      throw new NotFoundError('Trip')
    }

    if (trip.userId !== userId) {
      throw new UnauthorizedError()
    }

    const participant = await this.participantsRepository.create({
      email,
      first_name,
      tripId: trip.id,
    })

    const generateLink = new GenerateConfirmationLink(this.baseURL)
    const confirmationLink = generateLink.participant(participant.id)

    await nodemailer.confirmParticipant({
      confirmationLink: confirmationLink.toString(),
      destination: trip.destination,
      ends_at: trip.ends_at,
      starts_at: trip.starts_at,
      to: participant.email,
    })

    return { participant }
  }
}
