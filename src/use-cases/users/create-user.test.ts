import { Crypto } from '@/helpers/crypto'
import { it, describe, expect, vi, beforeEach } from 'vitest'
import { CreateUserUseCase } from './create-user'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { EmailAlreadyExistsError } from '@/errors/email-already-exists'

describe('CreateUserUseCase', () => {
  let crypto: Crypto
  let userRepository: InMemoryUserRepository
  let sut: CreateUserUseCase

  beforeEach(() => {
    crypto = new Crypto()
    userRepository = new InMemoryUserRepository()
    sut = new CreateUserUseCase(userRepository, crypto)
  })

  it('should be able to hash passoword', async () => {
    const spy = vi.spyOn(crypto, 'hash')

    const { user } = await sut.execute({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const hashedPassword = await compare('password', user.password)

    expect(spy).toHaveBeenCalledWith('password')
    expect(hashedPassword).toBe(true)
  })

  it('should not be able to create user if email already exists', async () => {
    await userRepository.create({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    const promise = sut.execute({
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
    })

    expect(promise).rejects.toThrow(EmailAlreadyExistsError)
  })
})
