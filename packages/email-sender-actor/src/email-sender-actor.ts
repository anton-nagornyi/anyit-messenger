import { Actor, ActorArgs, ActorRef } from '@anyit/actor';
import { SendEmail } from '@anyit/email-sender-dto';
import { Receive } from '@anyit/message-handling';
import { SendMessage } from '@anyit/messenger-dto';
import { FillTemplate } from '@anyit/template-actor-dto';

export type EmailSenderActorArgs = ActorArgs & {
  templates: {
    subject: ActorRef | string;
    text: ActorRef | string;
    html?: ActorRef | string | null;
  };
  transmitter: ActorRef;
};

export class EmailSenderActor extends Actor {
  constructor(args: EmailSenderActorArgs) {
    super(args);

    this.subjectTemplate = args.templates.subject;
    this.textTemplate = args.templates.text;
    this.htmlTemplate = args.templates.html;
    this.transmitter = args.transmitter;
  }

  private readonly subjectTemplate: ActorRef | string;

  private readonly textTemplate: ActorRef | string;

  private readonly htmlTemplate?: ActorRef | string | null;

  private readonly transmitter: ActorRef;

  async sendEmail(@Receive sendMessage: SendMessage) {
    const { email: from } = sendMessage.from;
    const to = sendMessage.to.map(({ email }) => email as string);

    const data = sendMessage.payload;
    const subject = typeof this.subjectTemplate === 'string'
      ? this.subjectTemplate
      : await this.fillTemplate(this.subjectTemplate, data);
    const text = typeof this.textTemplate === 'string'
      ? this.textTemplate
      : await this.fillTemplate(this.textTemplate, data);
    const html = this.htmlTemplate
      ? typeof this.htmlTemplate === 'string' ? this.htmlTemplate : await this.fillTemplate(this.htmlTemplate, data)
      : undefined;

    const { error } = await this.transmitter.ask(
      new SendEmail({
        sender: this.constructor.name,
        html,
        text,
        subject,
        reason: sendMessage,
        from,
        to,
      }),
    );

    if (error) {
      throw error;
    }
  }

  private async fillTemplate(actor: ActorRef, data: Record<string, any>) {
    const { reason, error } = await actor.ask(
      new FillTemplate({
        data,
        sender: this.constructor.name,
      }),
    );

    if (error) {
      throw error;
    }

    return reason.filledTemplateWithData!;
  }
}
