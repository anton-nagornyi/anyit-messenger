export class TemplateIsNotSetError extends Error {
  constructor(message?: string) {
    super(message ?? 'Template is not set');
  }

  code = 'TEMPLATE_IS_NOT_SET';
}
