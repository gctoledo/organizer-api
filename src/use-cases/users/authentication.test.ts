import { Crypto } from '@/helpers/crypto'
import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { AuthenticationUseCase } from './authentication'
import { InvalidCredentialsError } from '@/errors/invalid-credentials'

describe('AuthenticationUseCase', () => {
  let crypto: Crypto
  let userRepository: InMemoryUserRepository
  let sut: AuthenticationUseCase

  beforeEach(async () => {
    crypto = new Crypto()
    userRepository = new InMemoryUserRepository()
    sut = new AuthenticationUseCase(userRepository, crypto)

    await userRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: await crypto.hash('password'),
    })
  })

  it('should be able to authenticate', async () => {
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
    const promise = sut.execute({
      email: 'invalid_email',
      password: 'password',
    })

    expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const promise = sut.execute({
      email: 'john@doe.com',
      password: 'invalid_password',
    })

    expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
