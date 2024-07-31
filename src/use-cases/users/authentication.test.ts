import { Crypto } from '@/helpers/crypto'
import { it, describe, expect } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { AuthenticationUseCase } from './authentication'
import { InvalidCredentialsError } from '@/errors/invalid-credentials'

describe('AuthenticationUseCase', () => {
  const makeSut = () => {
    const crypto = new Crypto()

    const userRepository = new InMemoryUserRepository()

    const sut = new AuthenticationUseCase(userRepository, crypto)

    return { crypto, userRepository, sut }
  }

  it('should be able to authenticate', async () => {
    const { sut, userRepository, crypto } = makeSut()

    await userRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: await crypto.hash('password'),
    })

    const { user } = await sut.execute({
      email: 'john@doe.com',
      password: 'password',
    })

    expect(user).toEqual(
      expect.objectContaining({
        email: 'john@doe.com',
      }),
    )
  })

  it('should not be able to authenticate with wrong email', async () => {
    const { sut, crypto, userRepository } = makeSut()

    await userRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: await crypto.hash('password'),
    })

    const promise = sut.execute({
      email: 'invalid_email',
      password: 'password',
    })

    expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const { sut, crypto, userRepository } = makeSut()

    await userRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: await crypto.hash('password'),
    })

    const promise = sut.execute({
      email: 'john@doe.com',
      password: 'invalid_password',
    })

    expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
