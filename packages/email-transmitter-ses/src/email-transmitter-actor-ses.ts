import { Actor, ActorArgs } from '@anyit/actor';
import { SendEmail } from '@anyit/email-sender-dto';
import { Receive } from '@anyit/message-handling';
import { SendEmailCommand, SESClient, SESClientConfig } from '@aws-sdk/client-ses';

export type EmailTransmitterActorSesArgs = ActorArgs & SESClientConfig;

export class EmailTransmitterActorSes extends Actor {
  constructor(args: EmailTransmitterActorSesArgs) {
    super(args);

    this.sesClient = new SESClient(args);
  }

  private readonly sesClient: SESClient;

  async sendEmail(@Receive message: SendEmail) {
    const html = message.html ? { Html: { Data: message.html, Charset: 'utf-8' } } : {};
    await this.sesClient.send(new SendEmailCommand({
      Message: {
        Body: {
          Text: {
            Data: message.text,
            Charset: 'utf-8',
          },
          ...html,
        },
        Subject: {
          Data: message.subject,
          Charset: 'utf-8',
        },
      },
      Destination: {
        ToAddresses: [...message.to],
      },
      Source: message.from,
    }));
  }
}
