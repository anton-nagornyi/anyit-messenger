const tokenizer = /\{@?\w+}/g;

interface Token {
  name?: string;
  text?: string;
  destructure?: boolean;
  raw?: string;
}

export class MessageTemplate {
  private raw: string;

  private tokens: Token[];

  constructor(messageTemplate: string) {
    if (!messageTemplate) {
      throw new Error('Argument "messageTemplate" is required.');
    }

    this.raw = messageTemplate;
    this.tokens = this.tokenize(messageTemplate);
  }

  render(properties: Record<string, any> = {}): string {
    if (!this.tokens.length) {
      return this.raw;
    }

    return this.tokens
      .map((token) => {
        if (token.name && properties.hasOwnProperty(token.name)) {
          return this.toText(properties[token.name]);
        }
        return token.text ?? token.raw;
      })
      .join('');
  }

  bindProperties(...positionalArgs: any[]): Record<string, any> {
    const result: Record<string, any> = {};
    let nextArg = 0;

    for (const token of this.tokens) {
      if (typeof token.name === 'string' && nextArg < positionalArgs.length) {
        result[token.name] = this.capture(
          positionalArgs[nextArg],
          token.destructure,
        );
        nextArg++;
      }
    }

    while (nextArg < positionalArgs.length) {
      const arg = positionalArgs[nextArg];
      result[`a${nextArg}`] = this.capture(arg);
      nextArg++;
    }

    return result;
  }

  private tokenize(template: string): Token[] {
    const tokens: Token[] = [];
    let result: RegExpExecArray | null;
    let textStart = 0;

    while ((result = tokenizer.exec(template)) !== null) {
      if (result.index !== textStart) {
        tokens.push({ text: template.slice(textStart, result.index) });
      }

      const token = result[0];
      const destructure = token.startsWith('{@');

      tokens.push({
        name: token.substring(destructure ? 2 : 1, token.length - 1),
        destructure,
        raw: token,
      });

      textStart = tokenizer.lastIndex;
    }

    if (textStart < template.length) {
      tokens.push({ text: template.slice(textStart) });
    }

    return tokens;
  }

  private toText(property: any): string {
    if (property === null) {
      return 'null';
    }

    if (
      typeof property === 'string' ||
      typeof property === 'number' ||
      typeof property === 'boolean'
    ) {
      return property.toString();
    }

    if (typeof property === 'object') {
      if (typeof property.toISOString === 'function') {
        return property.toISOString();
      }

      let s = JSON.stringify(property);
      return s.length > 70 ? `${s.slice(0, 67)}...` : s;
    }

    return property?.toString() ?? 'undefined';
  }

  private capture(property: any, destructure?: boolean): any {
    if (typeof property === 'function') {
      return property.toString();
    }

    if (property === null || typeof property !== 'object') {
      return property;
    }

    if (destructure || typeof property.toISOString === 'function') {
      return property;
    }

    return property.toString();
  }
}
