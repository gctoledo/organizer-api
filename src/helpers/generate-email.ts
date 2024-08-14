interface EmailParams {
  destination: string
  start_date: string
  end_date: string
  confirmationLink: string
}

export class GenerateEmail {
  static participant({
    destination,
    end_date,
    start_date,
    confirmationLink,
  }: EmailParams) {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>Convite para Viagem</title>
      </head>
      <body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.5;">

          <p>Você foi convidado(a) para participar de uma viagem para <strong>${destination}</strong> nas datas de <strong>${start_date}</strong> até <strong>${end_date}</strong>.</p>

          <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
          
          <p><a href="${confirmationLink}" style="color: #1a73e8; text-decoration: none;">Confirmar presença</a></p>

          <p>Caso você não saiba do que se trata esse e-mail ou não poderá estar presente, apenas <strong>ignore esse e-mail</strong>.</p>

      </body>
      </html>
      `
  }

  static owner({
    destination,
    end_date,
    start_date,
    confirmationLink,
  }: EmailParams) {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação de Viagem</title>
    </head>
    <body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.5;">

        <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${start_date}</strong> até <strong>${end_date}</strong>.</p>

        <p>Para confirmar sua viagem, clique no link abaixo:</p>
        
        <p><a href="${confirmationLink}" style="color: #1a73e8; text-decoration: none;">Confirmar viagem</a></p>

        <p>Caso você não saiba do que se trata esse e-mail, apenas <strong>ignore esse e-mail</strong>.</p>

    </body>
    </html>

    `
  }
}
