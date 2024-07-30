export class NotFoundError extends Error {
  constructor(resource: 'User' | 'Trip' | 'Link' | 'Activity' | 'Participant') {
    super(`${resource} was not found`)
  }
}
