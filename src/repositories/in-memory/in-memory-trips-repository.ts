import { Trip } from '@prisma/client'
import {
  CreateTripParams,
  TripRepository,
} from '../interfaces/trips-repository'
import { randomUUID } from 'crypto'
import { ParticipantsRepository } from '../interfaces/participants-repository'

export class InMemoryTripsRepository implements TripRepository {
  private trips: Trip[] = []

  constructor(private participantsRepository: ParticipantsRepository) {}

  async create({ data, participants }: CreateTripParams) {
    const trip = {
      id: randomUUID().toString(),
      destination: data.destination,
      starts_at: new Date(data.starts_at),
      ends_at: new Date(data.ends_at),
      userId: data.userId,
      is_confirmed: false,
      created_at: new Date(),
    }

    this.trips.push(trip)

    const participantsToCreate = participants.map((participant) => ({
      tripId: trip.id,
      email: participant.email,
      first_name: participant.first_name ?? null,
    }))

    const _participants =
      await this.participantsRepository.createMany(participantsToCreate)

    return { trip, participants: _participants }
  }
}
