import { Message, RegisterMessage, MessageArgs } from '@anyit/messaging';

export type FillTemplateArgs = MessageArgs<FillTemplate>;

@RegisterMessage('01HM3KW2YQXVR09KBG5J5NZHP8')
export class FillTemplate extends Message {
  constructor(args: FillTemplateArgs) {
    super(args);
    this.template = args.template;
    this.data = { ...args.data };
  }

  readonly template?: string;

  readonly data: Record<string, any>;

  filledTemplateWithData?: string;
}

export const isFillTemplate = (message?: Message): message is FillTemplate =>
  Boolean(message && message.code === FillTemplate.code);
