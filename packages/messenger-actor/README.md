# messenger-actor Library

This library provides an `Actor` implementation for handling messaging operations, specifically with the capability to 
send messages using the `SendMessage` class from `@anyit/messenger-dto`.

## Installation

To install the library, run:

```shell
npm install messenger-actor
```

## Usage

### MessengerActor

`MessengerActor` is an actor class designed for sending messages. It can handle multiple sender and resolver configurations.

#### Example:

```typescript
import { MessengerActor } from 'messenger-actor';
import { ActorRef, ActorSystem } from '@anyit/actor';
import { SendMessage } from '@anyit/messenger-dto';

// Example sender and resolver actors. Create ActorRef of th suitable types instead of "Actor".
const sender: ActorRef = ActorSystem.create(Actor);
const resolver: ActorRef = ActorSystem.create(Actor);

const messenger = ActorSystem.create(MessengerActor, {
  resolvers: [resolver],
  senders: [sender]
});

// Example usage of sendMessage method
const sendMessage = new SendMessage({
  from: { id: 1 },
  to: { id: 1 },
  payload: { some: 'data' },
});

messengerActor.tell(sendMessage);
```

## API Reference

### MessengerActor Class

- **Constructor**
    - Arguments:
        - `args: MessengerActorArgs` - Arguments for creating a MessengerActor object.
    - Properties:
        - `senderResolvers`: Configuration of senders and resolvers.
- **sendMessage**
    - Method to process and send `SendMessage` messages.
    - Arguments:
        - `sendMessage: SendMessage` - The message to be sent.

## Contributing

Contributions are welcome. Please submit a pull request or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License.

