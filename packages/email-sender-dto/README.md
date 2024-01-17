# email-sender-dto Library

This library provides the `SendEmail` Data Transfer Object (DTO) for email sending operations. It is designed to work 
with the `@anyit/messaging` system, enabling the encapsulation of email-related data in message objects.

## Installation

To install the library, run:

```shell
yarn add @anyit/email-sender-dto
```

## Usage

### SendEmail

`SendEmail` is a message class used for creating email message objects. It contains information about the email such as
sender, recipients, subject, and body.

#### Example:

```typescript
import { SendEmail } from '@anyit/email-sender-dto';

const sendEmail = new SendEmail({
  from: 'sender@example.com',
  to: ['recipient@example.com'],
  subject: 'Test Email',
  text: 'This is a test email.',
  html: '<p>This is a test email.</p>'
});

console.log(sendEmail.subject);
console.log(sendEmail.text);
console.log(sendEmail.html);
```

## API Reference

### SendEmail Class

- **Constructor**
    - Arguments:
        - `args: SendEmailArgs` - Arguments for creating a SendEmail object.
    - Properties:
        - `to: ReadonlyArray<string>` - Array of recipient email addresses.
        - `from: string` - Sender's email address.
        - `subject: string` - Email subject.
        - `text: string` - Plain text body of the email.
        - `html: string` - HTML body of the email (optional).

### isSendEmail Function

- **Description**
    - A type guard function to check if a given message is an instance of `SendEmail`.
- **Usage**
    - `isSendEmail(message?: Message): message is SendEmail`

## Contributing

Contributions are welcome. Please submit a pull request or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License.

