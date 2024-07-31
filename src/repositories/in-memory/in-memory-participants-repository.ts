import { Participant, Prisma } from '@prisma/client'
import { ParticipantsRepository } from '../interfaces/participants-repository'
import { randomUUID } from 'crypto'

export class InMemoryParticipantsRepository implements ParticipantsRepository {
  private participants: Participant[] = []

  async create(data: Prisma.ParticipantUncheckedCreateInput) {
    const participant = {
      id: randomUUID().toString(),
      email: data.email,
      first_name: data.first_name || null,
      is_confirmed: false,
      tripId: data.tripId,
    }

    this.participants.push(participant)

    return participant
  }

  async createMany(data: Prisma.ParticipantUncheckedCreateInput[]) {
    const participants = data.map((participant) => ({
      id: randomUUID().toString(),
      email: participant.email,
      first_name: participant.first_name || null,
      is_confirmed: false,
      tripId: participant.tripId,
    }))

    this.participants.push(...participants)

    return participants
  }
}
