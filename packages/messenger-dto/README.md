# messenger-dto Library

This library provides Data Transfer Objects (DTOs) for messaging operations, specifically focusing on sending messages. 
It includes the `SendMessage` class which extends the `Message` class from `@anyit/messaging`.

## Installation

To install the library, run:

```shell
yarn add @anyit/messenger-dto
```

## Usage

### SendMessage

`SendMessage` is a class used for creating message objects intended to be sent. It contains information about the sender,
recipient(s), and the message payload.

#### Example:

```shell
import { SendMessage } from '@anyit/messenger-dto';

const sendMessage = new SendMessage({
  payload: { text: 'Hello world!' },
  from: { id: 'senderId' },
  to: [{ id: 'recipientId' }]
});

console.log(sendMessage.payload);
console.log(sendMessage.from);
console.log(sendMessage.to);
```

## API Reference

### SendMessage Class

- **Constructor**
    - Arguments:
        - `args: SendMessageArgs` - Arguments for creating a SendMessage object.
    - Properties:
        - `from: Record<string, any>` - Information about the sender.
        - `to: ReadonlyArray<Record<string, any>>` - Array of recipient information.
        - `payload: Record<string, any>` - The message payload.

### isSendMessage Function

- **Description**
    - A type guard function to check if a given message is an instance of `SendMessage`.
- **Usage**
    - `isSendMessage(message?: Message): message is SendMessage`

## Contributing

Contributions are welcome. Please submit a pull request or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License.
