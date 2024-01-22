import { Actor, ActorArgs, ActorRef } from '@anyit/actor';
import { Receive } from '@anyit/message-handling';
import { SendMessage } from '@anyit/messenger-dto';

const isActorRef = (obj?: any): obj is ActorRef =>
  Boolean(obj && obj.tell);

type Resolver = ((message: SendMessage) => Promise<string>) | ActorRef;

export type MessengerActorArgs = ActorArgs & {
  resolvers: Resolver[];
  senders: (ActorRef | { sender: ActorRef; resolvers: Resolver[] })[];
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
    resolvers: Resolver[];
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
        if (resolver instanceof ActorRef) {
          const { error } = await resolver.ask(message);

          if (error) {
            throw error;
          }
        } else {
          await resolver(message);
        }
      }

      const { error } = await sender.ask(message);

      if (error) {
        throw error;
      }
    }
  }
}
