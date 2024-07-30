import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, expect, it } from 'vitest'
import { GetProfileUseCase } from './get-profile'

describe('GetProfileUseCase', () => {
  const makeSut = () => {
    const userRepository = new InMemoryUserRepository()

    const sut = new GetProfileUseCase(userRepository)

    return { userRepository, sut }
  }

  it('should be able to get profile', async () => {
    const { sut, userRepository } = makeSut()

    const user = await userRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const result = await sut.execute(user.id)

    expect(result).toEqual(user)
  })
})
