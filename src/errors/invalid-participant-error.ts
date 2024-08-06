export class InvalidParticipantError extends Error {
  constructor() {
    super('Trip owner must login')
  }
}
