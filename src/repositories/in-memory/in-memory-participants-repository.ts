import { Participant, Prisma } from '@prisma/client'
import { ParticipantsRepository } from '../interfaces/participants-repository'
import { randomUUID } from 'crypto'

export class InMemoryParticipantsRepository implements ParticipantsRepository {
  private participants: Participant[] = []

  async findByTripId(tripId: string) {
    const participants = this.participants.filter(
      (participant) => participant.tripId === tripId,
    )

    return participants
  }

  async create(data: Prisma.ParticipantUncheckedCreateInput) {
    const participant = {
      id: randomUUID().toString(),
      email: data.email,
      first_name: data.first_name || null,
      is_confirmed: false,
      tripId: data.tripId,
      owner: false,
    }

    this.participants.push(participant)

    return participant
  }

  async createMany(data: Prisma.ParticipantUncheckedCreateInput[]) {
    const participants = data.map((participant) => ({
      id: randomUUID().toString(),
      email: participant.email,
      first_name: participant.first_name || null,
      is_confirmed: participant.is_confirmed || false,
      tripId: participant.tripId,
      owner: participant.owner || false,
    }))

    this.participants.push(...participants)

    return participants
  }

  async deleteMany(ids: string[]) {
    this.participants = this.participants.filter(
      (participant) => !ids.includes(participant.id),
    )
  }
}
