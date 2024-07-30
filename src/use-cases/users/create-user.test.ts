import { Crypto } from '@/helpers/crypto'
import { it, describe, expect, vi } from 'vitest'
import { CreateUserUseCase } from './create-user'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { EmailAlreadyExistsError } from '@/errors/users/email-already-exists'

describe('CreateUserUseCase', () => {
  const makeSut = () => {
    const crypto = new Crypto()

    const userRepository = new InMemoryUserRepository()

    const sut = new CreateUserUseCase(userRepository, crypto)

    return { crypto, userRepository, sut }
  }

  it('should be able to hash passoword', async () => {
    const { sut, crypto } = makeSut()

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
    const { sut, userRepository } = makeSut()

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
