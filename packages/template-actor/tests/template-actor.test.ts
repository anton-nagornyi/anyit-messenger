import { FillTemplate, TemplateIsNotSetError } from '@anyit/template-actor-dto';
import { TemplateActor, TemplateActorArgs } from '../src/template-actor';
import { MessageTemplate } from '../src/message-template';
import '@anyit/be-dev';

describe('Given a TemplateActor', () => {
  describe('When instantiated with a template', () => {
    const templateString = 'Hello {name}';
    let actor: TemplateActor;

    beforeEach(() => {
      const args: TemplateActorArgs = { address: 'actor-address', template: templateString };
      actor = new TemplateActor(args);
    });

    it('Then it should set the template', () => {
      expect((actor as any).template).toBeInstanceOf(MessageTemplate);
    });

    describe('And when fillTemplate is called with a message', () => {
      const messageData = { name: 'John' };
      let message: FillTemplate;

      beforeEach(() => {
        MessageTemplate.prototype.render = jest.fn();
        message = new FillTemplate({ data: messageData });
        actor.fillTemplate(message);
      });

      it('Then it should fill the template with the provided data', () => {
        expect(MessageTemplate.prototype.render).toHaveBeenCalledWith(messageData);
      });
    });
  });

  describe('When instantiated without a template', () => {
    let actor: TemplateActor;

    beforeEach(() => {
      const args: TemplateActorArgs = { address: 'actor-address' };
      actor = new TemplateActor(args);
    });

    describe('And when fillTemplate is called with a message that includes a template', () => {
      const messageTemplate = 'Hi {name}';
      const messageData = { name: 'Doe' };
      let message: FillTemplate;

      beforeEach(() => {
        MessageTemplate.prototype.render = jest.fn();
        message = new FillTemplate({ template: messageTemplate, data: messageData });
        actor.fillTemplate(message);
      });
      it('Then it should create and fill the provided template with data', () => {
        expect(MessageTemplate.prototype.render).toHaveBeenCalledWith(messageData);
      });
    });

    describe('And when fillTemplate is called with a message without a template', () => {
      let message: FillTemplate;

      beforeEach(() => {
        message = new FillTemplate({ data: { name: 'Alice' } });
      });

      it('Then it should throw a TemplateIsNotSetError', () => {
        expect(() => actor.fillTemplate(message)).toThrow(TemplateIsNotSetError);
      });
    });
  });
});
