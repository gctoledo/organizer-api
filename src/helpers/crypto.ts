import { hash, compare } from 'bcryptjs'

type CompareData = {
  passwordToCompare: string
  userPassword: string
}

export interface ICrypto {
  hash(password: string): Promise<string>
  compare(data: CompareData): Promise<boolean>
}

export class Crypto implements ICrypto {
  async hash(password: string) {
    const hashedPassword = await hash(password, 8)

    return hashedPassword
  }

  async compare({ userPassword, passwordToCompare }: CompareData) {
    const isValidPassword = await compare(passwordToCompare, userPassword)

    return isValidPassword
  }
}
