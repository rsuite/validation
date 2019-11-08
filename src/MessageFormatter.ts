import { MessageBag, Validator } from './types';

class MessageFormatter {

  protected $validator: Validator;

  constructor(validator: Validator) {
    this.$validator = validator;
  }

  getMessageBag(): MessageBag {
    return this.$validator.getMessageBag();
  }

  formatMessage(rule: string, fieldName: string, placeholderValues?: { [name: string]: any }): string | null {

    const messages = this.getMessageBag();

    const message = messages[`${fieldName}.${rule}` as keyof MessageBag] ?? messages[rule as keyof MessageBag];

    if (!message) {
      console.warn(new Error(`No error message defined for rule '${rule}'.`));

      return null;
    }
    // message template
    if (typeof message === 'string') {
      return this.renderMessageTemplate(message, { ...placeholderValues, field: fieldName });
    }

    return message(fieldName, placeholderValues);
  }

  renderMessageTemplate(template: string, placeholderValues: { [key: string]: any }): string {
    return Object.keys(placeholderValues).reduce((str, key) => {
      return str.replace(`{${key}}`, placeholderValues[key]);
    }, template);
  }
}

export default MessageFormatter;
