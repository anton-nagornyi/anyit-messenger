# @anyit/template-actor-dto

This library provides a set of tools for working with template-based data transformation in JavaScript applications. 
It is part of the AnyIT Messenger project.

## Features

- **Template Error Handling:** Includes a custom error class `TemplateIsNotSetError` for handling template-related errors.
- **Message Template Processing:** Allows filling templates with data using the `FillTemplate` message class.

## Installation

To install the package, run:

```bash
yarn add @anyit/template-actor-dto
```

## Usage

### TemplateIsNotSetError

The `TemplateIsNotSetError` is a custom error class used to indicate issues with template settings.

#### Example:

```typescript
import { TemplateIsNotSetError } from '@anyit/template-actor-dto';

throw new TemplateIsNotSetError('Custom error message');
```

### FillTemplate

The `FillTemplate` class is used to process and fill templates with provided data.

#### Example:

```javascript
import { FillTemplate } from '@anyit/template-actor-dto';

const fillTemplate = new FillTemplate({
  template: 'Your template string here',
  data: { key: 'value' }
});

console.log(fillTemplate.filledTemplateWithData);
```

## API Reference

### Classes

- **TemplateIsNotSetError**
    - Extends `Error`.
    - Properties:
        - `code`: Always `'TEMPLATE_IS_NOT_SET'`.
- **FillTemplate**
    - Extends `Message`.
    - Properties:
        - `template`: Template string (optional).
        - `data`: Object containing data to fill in the template.
        - `filledTemplateWithData`: The filled template string (optional).

### Functions

- **isFillTemplate(message?: Message): boolean**
    - Checks if a given message is an instance of `FillTemplate`.

## Contributing

Contributions are welcome. Please submit a pull request or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License.

## Author

Anton Nagornyi
