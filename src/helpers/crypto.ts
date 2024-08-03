import { hash, compare } from 'bcryptjs'

type CompareData = {
  password: string
  hashedPassword: string
}

export class Crypto {
  async hash(password: string) {
    const hashedPassword = await hash(password, 8)

    return hashedPassword
  }

  async compare({ password, hashedPassword }: CompareData) {
    const isValidPassword = await compare(password, hashedPassword)

    return isValidPassword
  }
}
