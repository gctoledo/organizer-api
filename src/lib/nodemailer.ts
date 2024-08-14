import { Transporter, createTransport } from 'nodemailer'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import env from '@/env'
import { GenerateEmail } from '@/helpers/generate-email'

dayjs.locale('pt-br')

interface SendEmailParams {
  from?: string
  to: string
  type: 'OWNER' | 'PARTICIPANT'
  destination: string
  starts_at: Date
  ends_at: Date
  confirmationLink: string
}

class Nodemailer {
  private transporter: Transporter

  constructor() {
    this.transporter = createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    })
  }

  async sendEmail({
    from,
    to,
    type,
    confirmationLink,
    destination,
    ends_at,
    starts_at,
  }: SendEmailParams) {
    const start_date = `${dayjs(starts_at).date()} de ${dayjs(starts_at).format('MMMM')} de ${dayjs(starts_at).year()}`
    const end_date = `${dayjs(ends_at).date()} de ${dayjs(ends_at).format('MMMM')} de ${dayjs(ends_at).year()}`

    if (type === 'PARTICIPANT') {
      const emailTemplate = GenerateEmail.participant({
        confirmationLink,
        destination,
        end_date,
        start_date,
      })

      try {
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

    if (type === 'OWNER') {
      const emailTemplate = GenerateEmail.owner({
        confirmationLink,
        destination,
        end_date,
        start_date,
      })

      try {
        await this.transporter.sendMail({
          from: from || env.SMTP_USER,
          to,
          subject: 'Convite para viagem',
          html: emailTemplate,
        })
      } catch (err) {
        console.error('Error to send owner e-mail.')
        console.error(err)
      }
    }
  }
}

const nodemailer = new Nodemailer()

export default nodemailer
