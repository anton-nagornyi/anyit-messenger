import { Actor, ActorArgs, ActorRef } from '@anyit/actor';
import { Receive } from '@anyit/message-handling';
import { SendMessage } from '@anyit/messenger-dto';

const isActorRef = (obj?: any): obj is ActorRef =>
  Boolean(obj && obj.tell);

export type MessengerActorArgs = ActorArgs & {
  resolvers: ActorRef[];
  senders: (ActorRef | { sender: ActorRef; resolvers: ActorRef[] })[];
};

export class MessengerActor extends Actor {
  constructor(args: MessengerActorArgs) {
    super(args);

    for (const senderConfig of args.senders) {
      if (isActorRef(senderConfig)) {
        this.senderResolvers.push({
          sender: senderConfig,
          resolvers: [...args.resolvers],
        });
      } else {
        const { sender, resolvers } = senderConfig;
        this.senderResolvers.push({
          sender,
          resolvers: [...args.resolvers, ...resolvers],
        });
      }
    }
  }

  private readonly senderResolvers: {
    sender: ActorRef;
    resolvers: ActorRef[];
  }[] = [];

  async sendMessage(@Receive sendMessage: SendMessage) {
    for (const senderWithResolvers of this.senderResolvers) {
      const message = new SendMessage({
        ...sendMessage,
        messageId: undefined,
        reason: sendMessage,
        sender: this.constructor.name,
      });

      const { sender, resolvers } = senderWithResolvers;

      for (const resolver of resolvers) {
        const { error } = await resolver.ask(message);

        if (error) {
          throw error;
        }
      }

      const { error } = await sender.ask(message);

      if (error) {
        throw error;
      }
    }
  }
}
