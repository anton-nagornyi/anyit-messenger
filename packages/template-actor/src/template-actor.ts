import { Actor, ActorArgs } from '@anyit/actor';
import { Receive } from '@anyit/message-handling';
import { FillTemplate, TemplateIsNotSetError } from '@anyit/template-actor-dto';
import { MessageTemplate } from './message-template';

export type TemplateActorArgs = ActorArgs & {
  template?: string;
};

export class TemplateActor extends Actor {
  constructor(args: TemplateActorArgs) {
    super(args);

    this.template = args.template
      ? new MessageTemplate(args.template)
      : undefined;
  }

  private readonly template?: MessageTemplate;

  fillTemplate(@Receive message: FillTemplate) {
    const template = message.template
      ? new MessageTemplate(message.template)
      : this.template;

    if (!template) {
      throw new TemplateIsNotSetError();
    }

    template.render(message.data);

    message.filledTemplateWithData = template.render(message.data);
  }
}
