import { Message, RegisterMessage, MessageArgs } from '@anyit/messaging';

export type SendMessageArgs = MessageArgs<SendMessage>;

@RegisterMessage('01HH9M74EMF9BDK15C7TK06VED')
export class SendMessage extends Message {
  constructor(args: SendMessageArgs) {
    super(args);
    this.payload = { ...args.payload };
    this.from = { ...args.from };
    this.to = { ...args.to };
  }

  readonly from: Record<string, any>;

  readonly to: ReadonlyArray<Record<string, any>>;

  readonly payload: Record<string, any>;
}

export const isSendMessage = (message?: Message): message is SendMessage =>
  Boolean(message && message.code === SendMessage.code);
