import { Crypto } from '@/helpers/crypto'
import { it, describe, expect, beforeEach } from 'vitest'
import { AuthenticationUseCase } from './authentication'
import { InvalidCredentialsError } from '@/errors/invalid-credentials'
import { GenerateData } from '@/tests/generate-data'

describe('AuthenticationUseCase', () => {
  let crypto: Crypto
  let sut: AuthenticationUseCase

  beforeEach(async () => {
    const data = new GenerateData()
    crypto = new Crypto()
    sut = new AuthenticationUseCase(data.usersRepository, crypto)

    await data.createUser()
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
