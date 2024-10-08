import { Trip } from '@prisma/client'
import {
  CreateTripParams,
  TripRepository,
  UpdateTripParams,
} from '../interfaces/trips-repository'
import { randomUUID } from 'crypto'
import { ParticipantsRepository } from '../interfaces/participants-repository'
import { LinksRepository } from '../interfaces/links-repository'
import { ActivitiesRepository } from '../interfaces/activities-repository'

export class InMemoryTripsRepository implements TripRepository {
  private trips: Trip[] = []

  constructor(
    private participantsRepository: ParticipantsRepository,
    private linksRepository: LinksRepository,
    private activitiesRepository: ActivitiesRepository,
  ) {}

  async findById(id: string) {
    const trip = this.trips.find((trip) => trip.id === id)

    if (!trip) {
      return null
    }

    const participants = await this.participantsRepository.findByTripId(trip.id)

    const links = await this.linksRepository.findByTripId(trip.id)

    const activities = await this.activitiesRepository.findByTripId(trip.id)

    return {
      ...trip,
      Participant: participants,
      Link: links,
      Activity: activities,
    }
  }

  async findByUserId(userId: string) {
    const trips = this.trips.filter((trip) => trip.userId === userId)

    return trips
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

    const participantsToCreate = participants.map((participant) => ({
      tripId: trip.id,
      email: participant.email,
      first_name: participant.first_name ?? null,
      is_confirmed: participant.is_confirmed ?? false,
      owner: participant.owner ?? false,
    }))

    const _participants =
      await this.participantsRepository.createMany(participantsToCreate)

    return {
      ...trip,
      Participant: _participants,
    }
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
    const index = this.trips.findIndex((trip) => trip.id === id)

    if (index >= 0) {
      this.trips[index].is_confirmed = true
    }
  }

  async update({ id, params }: UpdateTripParams) {
    const index = this.trips.findIndex((trip) => trip.id === id)

    let trip = this.trips[index]

    if (index >= 0) {
      trip = {
        ...trip,
        starts_at: params.starts_at as Date,
        ends_at: params.ends_at as Date,
        destination:
          (params.destination as string) ?? this.trips[index].destination,
      }
    }

    return trip
  }
}
