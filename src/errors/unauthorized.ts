export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized to perform this action.')
  }
}
