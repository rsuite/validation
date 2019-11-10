import { MessageBag, Validator, SchemaTypeAdaptor, ErrorMessageFormatter, TypedErrorMessageFormatter } from './types';

class MessageFormatter {

  protected $validator: Validator;

  protected $adaptor!: SchemaTypeAdaptor<any>;

  constructor(validator: Validator) {
    this.$validator = validator;
  }

  setAdaptor(adaptor: SchemaTypeAdaptor<any>): this {
    this.$adaptor = adaptor;
    return this;
  }

  getAdaptor(): SchemaTypeAdaptor<any> {
    return this.$adaptor;
  }

  getMessageBag(): MessageBag {
    return this.$validator.getMessageBag();
  }

  formatMessage(rule: string, fieldName: string, placeholderValues?: { [name: string]: any }): string | null {

    const messages = this.getMessageBag();

    const ruleMessage = messages[`${fieldName}.${rule}` as keyof MessageBag] ?? messages[rule as keyof MessageBag];

    const message = this.messageIsTyped(ruleMessage) ? ruleMessage[this.getAdaptor().getType()] : ruleMessage;

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

  protected messageIsTyped(message: any): message is TypedErrorMessageFormatter {
    return !!message && typeof message === 'object';
  }

  renderMessageTemplate(template: string, placeholderValues: { [key: string]: any }): string {
    return Object.keys(placeholderValues).reduce((str, key) => {
      return str.replace(`{${key}}`, placeholderValues[key]);
    }, template);
  }
}

export default MessageFormatter;
