import { SendMessage } from '@anyit/messenger-dto';
import { Actor, ActorRef, ActorSystem } from '@anyit/actor';
import { MessengerActor, MessengerActorArgs } from '../src/messenger-actor';
import '@anyit/be-dev';

describe('Given a MessengerActor', () => {
  describe('When instantiated with senders and resolvers', () => {
    let actor: MessengerActor;
    let senderMock: ActorRef;
    let resolverMock: ActorRef;

    beforeEach(() => {
      senderMock = ActorSystem.create(Actor, { address: 'sender-address' });
      senderMock.ask = jest.fn();
      resolverMock = ActorSystem.create(Actor, { address: 'resolver-address' });
      resolverMock.ask = jest.fn();
      const args: MessengerActorArgs = {
        address: 'actor-address',
        senders: [senderMock],
        resolvers: [resolverMock],
      };
      actor = new MessengerActor(args);
    });

    it('Then it should set the senderResolvers correctly', () => {
      expect((actor as any).senderResolvers).toEqual([
        { sender: senderMock, resolvers: [resolverMock] },
      ]);
    });

    describe('And when sendMessage is called', () => {
      const sendMessageData = new SendMessage({
        from: { id: 1 },
        to: [{ id: 1 }],
        payload: { some: 'data' },
      });

      beforeEach(async () => {
        resolverMock.ask = jest.fn().mockReturnValue({});
        senderMock.ask = jest.fn().mockReturnValue({});
        await actor.sendMessage(sendMessageData);
      });

      it('Then it should ask the resolvers', () => {
        for (const resolver of (actor as any).senderResolvers[0].resolvers) {
          expect(resolver.ask).toHaveBeenCalledWith(expect.any(SendMessage));
        }
      });

      it('Then it should ask the sender', () => {
        expect(senderMock.ask).toHaveBeenCalledWith(expect.any(SendMessage));
      });

      describe('And if a resolver returns an error', () => {
        beforeEach(() => {
          (resolverMock.ask as jest.Mock).mockResolvedValueOnce({ error: new Error('Test error') });
        });

        it('Then it should throw the error', async () => {
          await expect(actor.sendMessage(sendMessageData)).rejects.toThrow('Test error');
        });
      });

      describe('And if the sender returns an error', () => {
        beforeEach(() => {
          (senderMock.ask as jest.Mock).mockResolvedValueOnce({ error: new Error('Sender error') });
        });

        it('Then it should throw the error', async () => {
          await expect(actor.sendMessage(sendMessageData)).rejects.toThrow('Sender error');
        });
      });
    });
  });
});
