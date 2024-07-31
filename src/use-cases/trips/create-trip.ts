import dayjs from 'dayjs'
import { InvalidDateError } from '@/errors/trips/invalid-date'
import { NotFoundError } from '@/errors/users/not-found'
import { TripRepository } from '@/repositories/interfaces/trips-repository'
import { UserRepository } from '@/repositories/interfaces/users-repository'

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
  ) {}

  async execute({
    destination,
    ends_at,
    participants_to_invite,
    starts_at,
    owner_id,
  }: CreateTripUseCaseParams) {
    const isAvailableDates =
      dayjs(starts_at).isBefore(dayjs(ends_at)) &&
      dayjs(new Date()).isBefore(dayjs(starts_at))

    if (!isAvailableDates) {
      throw new InvalidDateError()
    }

    const owner = await this.userRepository.findById(owner_id)

    if (!owner) {
      throw new NotFoundError('User')
    }

    const participants = [
      { email: owner.email, first_name: owner.first_name },
      ...participants_to_invite.map((participantEmail) => ({
        email: participantEmail,
      })),
    ]

    const { trip, participants: _participants } =
      await this.tripRepository.create({
        data: {
          destination,
          ends_at,
          starts_at,
          userId: owner_id,
        },
        participants,
      })

    return { trip, participants: _participants }
  }
}
