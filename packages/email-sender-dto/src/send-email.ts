import { Message, RegisterMessage, MessageArgs } from '@anyit/messaging';

export type SendEmailArgs = MessageArgs<SendEmail>;

@RegisterMessage('01HMAWS3HERCJWAK3VHF85X5YX')
export class SendEmail extends Message {
  constructor(args: SendEmailArgs) {
    super(args);
    this.from = args.from;
    this.to = [...args.to];
    this.subject = args.subject;
    this.text = args.text;
    this.html = args.html;
  }

  readonly to: ReadonlyArray<string>;

  readonly from: string;

  readonly subject: string;

  readonly text: string;

  readonly html?: string;
}

export const isSendEmail = (message?: Message): message is SendEmail =>
  Boolean(message && message.code === SendEmail.code);
