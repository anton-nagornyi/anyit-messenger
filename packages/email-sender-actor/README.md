# @anyit/email-sender-actor Library

This library provides the `EmailSenderActor` class for handling email sending operations in an actor-based system. 
It utilizes `@anyit/email-sender-dto`, `@anyit/messenger-dto`, and `@anyit/template-actor-dto` for processing and 
sending emails.

## Installation

To install the library, run:

```shell
yarn add @anyit/email-sender-actor
```

## Usage

### EmailSenderActor

`EmailSenderActor` is an actor class designed for sending emails. It can use template actors for email subject, text, 
and HTML content, and uses a transmitter actor for sending the email.

#### Example:

```typescript
import { EmailSenderActor } from '@anyit/email-sender-actor';
import { ActorRef, ActorSystem } from '@anyit/actor';

// Example template and transmitter actors. Create ActorRef of th suitable types instead of "Actor".
const subjectTemplate: ActorRef = ActorSystem.create(Actor);
const textTemplate: ActorRef = ActorSystem.create(Actor);
const htmlTemplate: ActorRef = ActorSystem.create(Actor);
const transmitter: ActorRef = ActorSystem.create(Actor);

const emailSenderActor = ActorSystem.create(EmailSenderActor, {
  templates: {
    subject: subjectTemplate,
    text: textTemplate,
    html: htmlTemplate
  },
  transmitter: transmitter
});

// Example usage of sendEmail method
const sendMessage = new SendMessage({
  from: { id: 1 },
  to: { id: 1 },
  payload: { some: 'data' },
});

emailSenderActor.tell(sendMessage);
```

## API Reference

### EmailSenderActor Class

- **Constructor**
    - Arguments:
        - `args: MessengerActorArgs` - Arguments for creating an EmailSenderActor object.
    - Properties:
        - `subjectTemplate: ActorRef` - Actor for subject template rendering.
        - `textTemplate: ActorRef` - Actor for text body template rendering.
        - `htmlTemplate: ActorRef` - Optional actor for HTML body template rendering.
        - `transmitter: ActorRef` - Actor for transmitting the email.
- **sendEmail**
    - Method to process `SendMessage` messages and send emails.
    - Arguments:
        - `sendMessage: SendMessage` - The message containing email information.

## Contributing

Contributions are welcome. Please submit a pull request or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License.

