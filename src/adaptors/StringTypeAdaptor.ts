import { Schema } from 'rsuite';
import { StringType } from 'rsuite/es/Schema/StringType';
import BaseTypeAdaptor from './BaseTypeAdaptor';

class StringTypeAdaptor extends BaseTypeAdaptor<StringType> {

  protected $type = 'string';

  protected getSize(str: string): number {
    return str.length;
  }

  // StringType() native methods
  in(...values: any[]): this {

    this.getSchemaType().isOneOf(values, this.getErrorMessage('in', { values }));

    return this;
  }

  between(min: number, max: number): this {
    this.getSchemaType().rangeLength(min, max, this.getErrorMessage('between', { min, max }));

    return this;
  }

  min(value: number): this {

    this.getSchemaType().minLength(value, this.getErrorMessage('min', { value }));

    return this;
  }

  max(value: number): this {

    this.getSchemaType().maxLength(value, this.getErrorMessage('max', { value }));

    return this;
  }

  email(): this {
    this.getSchemaType().isEmail(this.getErrorMessage('email'));

    return this;
  }

  url(): this {
    this.getSchemaType().isURL(this.getErrorMessage('url'));

    return this;
  }
}

export default StringTypeAdaptor;
