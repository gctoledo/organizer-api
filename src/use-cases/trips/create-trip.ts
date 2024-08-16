import dayjs from 'dayjs'
import { InvalidDateError } from '@/errors/invalid-date'
import { NotFoundError } from '@/errors/not-found'
import { TripRepository } from '@/repositories/interfaces/trips-repository'
import { UserRepository } from '@/repositories/interfaces/users-repository'
import nodemailer from '@/lib/nodemailer'
import { GenerateConfirmationLink } from '@/helpers/generate-confirmation-link'

interface CreateTripUseCaseParams {
  destination: string
  starts_at: Date
  ends_at: Date
  participants_to_invite: string[]
  owner_id: string
}

export class CreateTripUseCase {
  constructor(
    private tripRepository: TripRepository,
    private userRepository: UserRepository,
    private baseURL: string,
  ) {}

  async execute({
    destination,
    ends_at,
    participants_to_invite,
    starts_at,
    owner_id,
  }: CreateTripUseCaseParams) {
    const owner = await this.userRepository.findById(owner_id)

    if (!owner) {
      throw new NotFoundError('User')
    }

    const isAvailableDates =
      dayjs(starts_at).isBefore(dayjs(ends_at)) &&
      dayjs(new Date()).isBefore(dayjs(starts_at))

    if (!isAvailableDates) {
      throw new InvalidDateError()
    }

    const participants = [
      { email: owner.email, first_name: owner.first_name, owner: true },
      ...participants_to_invite.map((participantEmail) => ({
        email: participantEmail,
        owner: false,
      })),
    ]

    const trip = await this.tripRepository.create({
      data: {
        destination,
        ends_at,
        starts_at,
        userId: owner_id,
      },
      participants,
    })

    const generateLink = new GenerateConfirmationLink(this.baseURL)

    const confirmationTripLink = generateLink.owner(trip.id)

    await nodemailer.confirmTrip({
      to: owner.email,
      destination,
      starts_at,
      ends_at,
      confirmationLink: confirmationTripLink.toString(),
    })

    await Promise.all(
      trip.Participant.filter((participant) => participant.owner === false).map(
        async (participant) => {
          const confirmationLink = generateLink.participant(participant.id)

          await nodemailer.confirmParticipant({
            confirmationLink: confirmationLink.toString(),
            destination: trip.destination,
            ends_at: trip.ends_at,
            starts_at: trip.starts_at,
            to: participant.email,
          })
        },
      ),
    )

    return { trip }
  }
}
