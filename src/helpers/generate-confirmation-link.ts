export class GenerateConfirmationLink {
  constructor(private baseURL: string) {}

  owner(tripId: string): URL {
    const link = new URL(`trips/confirmation/${tripId}`, this.baseURL)

    return link
  }

  participant(participantId: string): URL {
    const link = new URL(
      `participants/confirmation/${participantId}`,
      this.baseURL,
    )

    return link
  }
}
