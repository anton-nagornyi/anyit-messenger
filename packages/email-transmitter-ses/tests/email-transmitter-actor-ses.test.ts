import '@anyit/be-dev';
import { SendEmail } from '@anyit/email-sender-dto';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import { EmailTransmitterActorSes, EmailTransmitterActorSesArgs } from '../src/email-transmitter-actor-ses';

const send = jest.fn();
jest.mock('@aws-sdk/client-ses', () => ({
  SESClient: jest.fn().mockImplementation(() => ({
    send,
  })),
  SendEmailCommand: jest.fn(),
}));

describe('Given an EmailTransmitterActorSes', () => {
  let emailTransmitterActorSes: EmailTransmitterActorSes;

  beforeEach(() => {
    const args: EmailTransmitterActorSesArgs = { address: 'addr' };
    emailTransmitterActorSes = new EmailTransmitterActorSes(args);
  });

  describe('When sendEmail is called', () => {
    let sendEmailMessage: SendEmail;

    beforeEach(() => {
      sendEmailMessage = new SendEmail({
        from: 'sender@example.com',
        to: ['recipient@example.com'],
        subject: 'Test Email',
        text: 'This is a test email.',
        html: '<p>This is a test email.</p>',
      });

      emailTransmitterActorSes.sendEmail(sendEmailMessage);
    });

    it('Then it should send an email using SES', () => {
      expect(send).toHaveBeenCalledWith(expect.any(SendEmailCommand));
      expect(SendEmailCommand).toHaveBeenCalledWith({
        Message: {
          Body: {
            Text: {
              Data: sendEmailMessage.text,
              Charset: 'utf-8',
            },
            Html: {
              Data: sendEmailMessage.html,
              Charset: 'utf-8',
            },
          },
          Subject: {
            Data: sendEmailMessage.subject,
            Charset: 'utf-8',
          },
        },
        Destination: {
          ToAddresses: sendEmailMessage.to,
        },
        Source: sendEmailMessage.from,
      });
    });
  });
});
