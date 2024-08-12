import { randomUUID } from 'node:crypto'
import { Prisma, Activity } from '@prisma/client'
import {
  ActivitiesRepository,
  UpdateActivityParams,
} from '../interfaces/activities-repository'

export class InMemoryActivitiesRepository implements ActivitiesRepository {
  private activities: Activity[] = []

  async findById(id: string) {
    const activity = this.activities.find((activity) => activity.id === id)

    if (!activity) {
      return null
    }

    return activity
  }

  async findByTripId(tripId: string) {
    const activities = this.activities.filter(
      (activity) => activity.tripId === tripId,
    )

    return activities
  }

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

  async update({ data, id }: UpdateActivityParams) {
    const index = this.activities.findIndex((activity) => activity.id === id)

    let activity = this.activities[index]

    if (index >= 0) {
      activity = {
        ...activity,
        occurs_at: data.occurs_at,
        title: data.title,
      }
    }

    return activity
  }

  async delete(id: string) {
    this.activities = this.activities.filter((activity) => activity.id !== id)
  }
}
