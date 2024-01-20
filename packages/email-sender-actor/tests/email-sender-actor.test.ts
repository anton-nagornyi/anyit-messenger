import '@anyit/be-dev';
import { SendEmail } from '@anyit/email-sender-dto';
import { SendMessage } from '@anyit/messenger-dto';
import { FillTemplate } from '@anyit/template-actor-dto';
import { ActorRef, Actor, ActorSystem } from '@anyit/actor';
import {EmailSenderActor, EmailSenderActorArgs} from '../src/email-sender-actor';

describe('Given an EmailSenderActor', () => {
  let emailSenderActor: EmailSenderActor;
  let subjectTemplateMock: ActorRef;
  let textTemplateMock: ActorRef;
  let htmlTemplateMock: ActorRef;
  let transmitterMock: ActorRef;

  beforeEach(() => {
    subjectTemplateMock = ActorSystem.create(Actor);
    textTemplateMock = ActorSystem.create(Actor);
    htmlTemplateMock = ActorSystem.create(Actor);
    transmitterMock = ActorSystem.create(Actor);

    const args: EmailSenderActorArgs = {
      address: 'actor-address',
      templates: {
        subject: subjectTemplateMock,
        text: textTemplateMock,
        html: htmlTemplateMock,
      },
      transmitter: transmitterMock,
    };

    emailSenderActor = new EmailSenderActor(args);
  });

  describe('When sendEmail is called', () => {
    let sendMessage: SendMessage;

    beforeEach(() => {
      subjectTemplateMock.ask = jest.fn().mockReturnValue({
        reason: {
          filledTemplateWithData: 'subject',
        },
      });
      textTemplateMock.ask = jest.fn().mockReturnValue({
        reason: {
          filledTemplateWithData: 'text',
        },
      });
      htmlTemplateMock.ask = jest.fn().mockReturnValue({
        reason: {
          filledTemplateWithData: 'html',
        },
      });

      transmitterMock.ask = jest.fn().mockReturnValue({});

      sendMessage = new SendMessage({
        from: { email: 'from@example.com' },
        to: [{ email: 'to1@example.com' }, { email: 'to2@example.com' }],
        payload: { data: 'ok' },
      });
    });

    it('Then it should fill the subject, text, and HTML templates', async () => {
      await emailSenderActor.sendEmail(sendMessage);

      expect(subjectTemplateMock.ask).toHaveBeenCalledWith(expect.any(FillTemplate));
      expect(textTemplateMock.ask).toHaveBeenCalledWith(expect.any(FillTemplate));
      expect(htmlTemplateMock.ask).toHaveBeenCalledWith(expect.any(FillTemplate));
    });

    it('Then it should send an email using the transmitter', async () => {
      await emailSenderActor.sendEmail(sendMessage);

      expect(transmitterMock.ask).toHaveBeenCalledWith(expect.any(SendEmail));
    });

    describe('And if any template actor returns an error', () => {
      beforeEach(() => {
        subjectTemplateMock.ask = jest.fn();
        (subjectTemplateMock.ask as jest.Mock).mockResolvedValueOnce({ error: new Error('Template error') });
      });

      it('Then it should throw the error', async () => {
        await expect(emailSenderActor.sendEmail(sendMessage)).rejects.toThrow('Template error');
      });
    });

    describe('And if the transmitter returns an error', () => {
      beforeEach(() => {
        transmitterMock.ask = jest.fn();
        (transmitterMock.ask as jest.Mock).mockResolvedValueOnce({ error: new Error('Transmitter error') });
      });

      it('Then it should throw the error', async () => {
        await expect(emailSenderActor.sendEmail(sendMessage)).rejects.toThrow('Transmitter error');
      });
    });
  });
});
