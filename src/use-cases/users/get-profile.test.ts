import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetProfileUseCase } from './get-profile'
import { NotFoundError } from '@/errors/not-found'
import { GenerateData } from '@/tests/generate-data'

describe('GetProfileUseCase', () => {
  let usersRepository: InMemoryUserRepository
  let sut: GetProfileUseCase

  beforeEach(() => {
    const data = new GenerateData()
    usersRepository = data.usersRepository
    sut = new GetProfileUseCase(data.usersRepository)
  })

  it('should be able to get profile', async () => {
    const createdUser = await usersRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const { user } = await sut.execute(createdUser.id)

    expect(user).toEqual(createdUser)
  })

  it('should not be able to get profile if user does not exists', async () => {
    const promise = sut.execute('random_id')

    expect(promise).rejects.toBeInstanceOf(NotFoundError)
  })
})
