# @anyit/template-actor

This library provides functionality for template processing in message-driven systems using actors. 
It includes `TemplateActor` for handling template-related messages and `MessageTemplate` for template rendering.

## Installation

To install the library, run:

```shell
yarn add @anyit/template-actor
```

## Usage

### TemplateActor

`TemplateActor` extends the `Actor` class and is designed to process `FillTemplate` messages. It can use a predefined 
template or one provided in the message.

#### Example:

~~~
import { TemplateActor } from '@anyit/template-actor';

const actor = new TemplateActor({ template: 'Your template string' });
~~~

### MessageTemplate

`MessageTemplate` is a utility class for parsing and rendering templates.

#### Example:

~~~
import { MessageTemplate } from 'your-library-name';

const template = new MessageTemplate('Hello, {name}');
const result = template.render({ name: 'John' });
console.log(result); // Output: Hello, John
~~~

## API Reference

### TemplateActor Class

- **Constructor**
    - Arguments:
        - `args: TemplateActorArgs` - Arguments for the actor.
    - Properties:
        - `template: MessageTemplate` - Optional predefined template.
- **fillTemplate**
    - Method to process `FillTemplate` messages.
    - Arguments:
        - `message: FillTemplate` - The message containing template data.

### MessageTemplate Class

- **Constructor**
    - Arguments:
        - `messageTemplate: string` - The template string.
- **render**
    - Renders the template with provided properties.
    - Arguments:
        - `properties: Record<string, any>` - The properties to render the template with.
- **bindProperties**
    - Binds positional arguments to template tokens.
    - Arguments:
        - `...positionalArgs: any[]` - The arguments to bind.

## Contributing

Contributions are welcome. Please submit a pull request or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License.

