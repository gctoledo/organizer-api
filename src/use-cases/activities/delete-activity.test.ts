import { beforeEach, describe, expect, it } from 'vitest'
import { Activity, User } from '@prisma/client'
import { DeleteActivityUseCase } from './delete-activity'
import { GenerateData } from '@/tests/generate-data'
import { InMemoryActivitiesRepository } from '@/repositories/in-memory/in-memory-activities-repository'
import { NotFoundError } from '@/errors/not-found'

describe('DeleteActivityUseCase', () => {
  let sut: DeleteActivityUseCase
  let activitiesRepository: InMemoryActivitiesRepository
  let user: User
  let activity: Activity

  beforeEach(async () => {
    const data = new GenerateData()
    sut = new DeleteActivityUseCase(
      data.activitiesRepository,
      data.tripsRepository,
    )
    activitiesRepository = data.activitiesRepository

    user = await data.createUser()
    await data.createTrip()
    activity = await data.createActivity()
  })

  it('should be able to delete a activity', async () => {
    await sut.execute({ activityId: activity.id, userId: user.id })

    const activities = await activitiesRepository.findById(activity.id)

    expect(activities).toBeNull()
  })

  it('should not be able to delete a activity if activity is not found', async () => {
    const promise = sut.execute({ activityId: 'wrong_id', userId: user.id })

    expect(promise).rejects.toBeInstanceOf(NotFoundError)
  })
})
