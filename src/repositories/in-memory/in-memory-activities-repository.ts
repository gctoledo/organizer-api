import { randomUUID } from 'node:crypto'
import { Prisma, Activity } from '@prisma/client'
import { ActivitiesRepository } from '../interfaces/activities-repository'

export class InMemoryActivitiesRepository implements ActivitiesRepository {
  private activities: Activity[] = []

  async create(data: Prisma.ActivityUncheckedCreateInput) {
    const activity = {
      id: randomUUID().toString(),
      title: data.title,
      occurs_at: new Date(data.occurs_at),
      tripId: data.tripId,
    }

    this.activities.push(activity)

    return activity
  }
}
