import { MessageTemplate } from '../src/message-template';
import '@anyit/be-dev';

describe('Given MessageTemplate class', () => {
  describe('When initialized', () => {
    describe('And the template is null', () => {
      it('Then it should throw an error', () => {
        expect(() => new MessageTemplate(null as any)).toThrow();
      });
    });

    describe('And the template is a valid string', () => {
      it('Then it should not throw an error', () => {
        expect(
          () => new MessageTemplate('Happy {age}th birthday, {name}!'),
        ).not.toThrow();
      });
    });
  });

  describe('When bindProperties is called', () => {
    let messageTemplate: MessageTemplate;

    describe('And properties are provided', () => {
      it('Then it should bind properties from arguments', () => {
        messageTemplate = new MessageTemplate(
          'Happy {age}th birthday, {name}!',
        );
        const boundProperties = messageTemplate.bindProperties(30, 'Fred');

        expect(boundProperties).toHaveProperty('age', 30);
        expect(boundProperties).toHaveProperty('name', 'Fred');
      });

      it('Then it should destructure bound properties from arguments', () => {
        messageTemplate = new MessageTemplate('Hello, {@person}!');
        const boundProperties = messageTemplate.bindProperties({
          firstName: 'Leeroy',
          lastName: 'Jenkins',
        });

        expect(boundProperties).toHaveProperty('person.firstName', 'Leeroy');
        expect(boundProperties).toHaveProperty('person.lastName', 'Jenkins');
      });

      it('Then it should bind properties not in the message template', () => {
        const f = function () {};
        const o = null;
        messageTemplate = new MessageTemplate(
          'Happy {age}th birthday, {name}!',
        );
        const boundProperties = messageTemplate.bindProperties(
          30,
          'Fred',
          undefined,
          'Not in template',
          f,
          o,
          {},
        );

        expect(boundProperties).toHaveProperty('age', 30);
        expect(boundProperties).toHaveProperty('name', 'Fred');
        expect(boundProperties).toHaveProperty('a3', 'Not in template');
        expect(boundProperties).toHaveProperty('a4', f.toString());
        expect(boundProperties).toHaveProperty('a5', null);
        expect(boundProperties).toHaveProperty('a6', {}.toString());
      });
    });
  });

  describe('When render is called', () => {
    let messageTemplate: MessageTemplate;

    describe('And a template with properties is provided', () => {
      it('Then it should render a message with provided properties', () => {
        messageTemplate = new MessageTemplate(
          'Happy {age}th birthday, {name}!',
        );
        const message = messageTemplate.render({ age: 30, name: 'Fred' });

        expect(message).toEqual('Happy 30th birthday, Fred!');
      });
    });

    describe('And a template without properties is provided', () => {
      it('Then it should render a message as is', () => {
        messageTemplate = new MessageTemplate('Happy 30th birthday, Fred!');
        const message = messageTemplate.render();

        expect(message).toEqual('Happy 30th birthday, Fred!');
      });
    });

    describe('And properties are destructured', () => {
      it('Then it should render a message with destructured properties', () => {
        messageTemplate = new MessageTemplate('Hello, {@person}!');
        const message = messageTemplate.render({
          person: { firstName: 'Leeroy', lastName: 'Jenkins' },
        });

        expect(message).toEqual(
          'Hello, {"firstName":"Leeroy","lastName":"Jenkins"}!',
        );
      });
    });

    describe('And properties are missing', () => {
      it('Then it should render a message with raw tokens', () => {
        messageTemplate = new MessageTemplate('Hello, {@person}!');
        const message = messageTemplate.render();

        expect(message).toEqual('Hello, {@person}!');
      });
    });

    describe('And primitive properties are provided', () => {
      it('Then it should render string representations of primitive properties', () => {
        messageTemplate = new MessageTemplate('{p}');
        expect(messageTemplate.render({ p: undefined })).toEqual('undefined');
        expect(messageTemplate.render({ p: null })).toEqual('null');
        expect(messageTemplate.render({ p: 'text' })).toEqual('text');
        expect(messageTemplate.render({ p: 123 })).toEqual('123');
        expect(messageTemplate.render({ p: true })).toEqual(true.toString());
      });
    });

    describe('And complex properties are provided', () => {
      it('Then it should render string representations of complex properties', () => {
        messageTemplate = new MessageTemplate('{p}');
        const date = new Date();
        expect(messageTemplate.render({ p: date })).toEqual(date.toISOString());

        const complex = {
          aaaa: {
            bbbb: {
              cccc: {
                dddd: 'eeee',
              },
            },
            ffff: {
              gggg: {
                hhhh: {
                  ijkl: 'mnopqrstuvwxyz',
                },
              },
            },
          },
        };
        const complexMessage = messageTemplate.render({ p: complex });
        expect(complexMessage).toHaveLength(70);
        expect(complexMessage.indexOf('...')).toEqual(67);
        expect(messageTemplate.render({ p: Symbol('sym') })).toEqual(
          'Symbol(sym)',
        );

        const f = function () {};
        expect(messageTemplate.render({ p: f })).toEqual(f.toString());
      });
    });
  });
});
