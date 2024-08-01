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
  async findById(id: string) {
    const trip = this.trips.find((trip) => trip.id === id)

    if (!trip) {
      return null
    }

    return trip
  }

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

    const participantsToCreate = participants.map((participant, i) => ({
      tripId: trip.id,
      email: participant.email,
      first_name: participant.first_name ?? null,
      is_confirmed: i === 0,
      owner: i === 0,
    }))

    const _participants =
      await this.participantsRepository.createMany(participantsToCreate)

    return { trip, participants: _participants }
  }

  async delete(id: string) {
    const participantsToDelete =
      await this.participantsRepository.findByTripId(id)

    await this.participantsRepository.deleteMany(
      participantsToDelete.map((participant) => participant.id),
    )

    this.trips = this.trips.filter((trip) => trip.id !== id)
  }

  async confirm(id: string) {
    const trip = this.trips.findIndex((trip) => trip.id === id)

    this.trips[trip].is_confirmed = true
  }
}
