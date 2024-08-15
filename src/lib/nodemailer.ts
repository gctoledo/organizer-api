import { Transporter, createTransport } from 'nodemailer'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import env from '@/env'
import { GenerateEmail } from '@/helpers/generate-email'

dayjs.locale('pt-br')

const config = {
  host:
    env.NODE_ENV !== 'production' ? 'sandbox.smtp.mailtrap.io' : env.SMTP_HOST,
  port: env.NODE_ENV !== 'production' ? 587 : env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.NODE_ENV !== 'production' ? '8a68e0de3e96c0' : env.SMTP_USER,
    pass: env.NODE_ENV !== 'production' ? '30fd05a0b4d8f4' : env.SMTP_PASSWORD,
  },
}

interface SendEmailParams {
  from?: string
  to: string
  destination: string
  starts_at: Date
  ends_at: Date
  confirmationLink: string
}

class Nodemailer {
  private transporter: Transporter

  constructor() {
    this.transporter = createTransport(config)
  }

  async confirmTrip({
    from,
    to,
    confirmationLink,
    destination,
    ends_at,
    starts_at,
  }: SendEmailParams) {
    try {
      const start_date = `${dayjs(starts_at).date()} de ${dayjs(starts_at).format('MMMM')} de ${dayjs(starts_at).year()}`
      const end_date = `${dayjs(ends_at).date()} de ${dayjs(ends_at).format('MMMM')} de ${dayjs(ends_at).year()}`

      const emailTemplate = GenerateEmail.owner({
        confirmationLink,
        destination,
        end_date,
        start_date,
      })

      await this.transporter.sendMail({
        from: from || env.SMTP_USER,
        to,
        subject: 'Confirme sua viagem',
        html: emailTemplate,
      })
    } catch (err) {
      console.error('Error to send owner e-mail.')
      console.error(err)
    }
  }

  async confirmParticipant({
    from,
    to,
    confirmationLink,
    destination,
    ends_at,
    starts_at,
  }: SendEmailParams) {
    try {
      const start_date = `${dayjs(starts_at).date()} de ${dayjs(starts_at).format('MMMM')} de ${dayjs(starts_at).year()}`
      const end_date = `${dayjs(ends_at).date()} de ${dayjs(ends_at).format('MMMM')} de ${dayjs(ends_at).year()}`

      const emailTemplate = GenerateEmail.participant({
        confirmationLink,
        destination,
        end_date,
        start_date,
      })

      await this.transporter.sendMail({
        from: from || env.SMTP_USER,
        to,
        subject: 'Convite para viagem',
        html: emailTemplate,
      })
    } catch (err) {
      console.error('Error to send participant e-mail.')
      console.error(err)
    }
  }
}

const nodemailer = new Nodemailer()

export default nodemailer
