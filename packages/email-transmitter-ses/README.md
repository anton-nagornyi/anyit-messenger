# @anyit/email-transmitter-ses Library

This library provides the `EmailTransmitterActorSes` class for handling email transmissions using Amazon Simple Email Service (SES). It is designed to work with the `@anyit/email-sender-dto` for processing and sending emails via SES.

## Installation

To install the library, run:

```shell
yarn add @anyit/email-transmitter-ses
```

## Usage

### EmailTransmitterActorSes

`EmailTransmitterActorSes` is an actor class designed for transmitting emails using the Amazon SES client. It 
processes `SendEmail` messages and sends them through SES.

#### Example:

```typescript
import { EmailTransmitterActorSes } from '@anyit/email-transmitter-ses';
import { SESClientConfig } from '@aws-sdk/client-ses';
import { ActorSystem } from '@anyit/actor';
import { SendEmail } from '@anyit/email-sender-dto'

// Example SES client configuration
const sesConfig: SESClientConfig = {};

const emailTransmitterActorSes = ActorSystem.create(EmailTransmitterActorSes, sesConfig);

// Example usage of sendEmail method
const sendEmailMessage = new SendEmail({
  to: ['some@email.com'],
  from: 'some@email.com',
  subject: 'subject',
  text: 'body',
  html: '<h1>Optional</h1>' //this is optional
}); // instance of SendEmail

emailTransmitterActorSes.tell(sendEmailMessage);
```

## Contributing

Contributions are welcome. Please submit a pull request or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License.

