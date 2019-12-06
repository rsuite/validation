import Schema, { CheckType } from 'rsuite/es/Schema';
import _upperFirst from 'lodash.upperfirst';
import {
  ErrorMessageFormatter,
  RuleInterface,
  RuleType,
  SchemaTypeAdaptor,
  SchemaTypeArrayAdaptor,
  Validator
} from '../types';
import MessageFormatter from '../MessageFormatter';

abstract class BaseTypeAdaptor<T extends CheckType> implements SchemaTypeAdaptor<T> {

  protected $fieldName: string;

  protected $messageFormatter: MessageFormatter;

  protected abstract $type: string;

  protected $arrayAdaptor?: SchemaTypeArrayAdaptor<T>;

  protected $schemaType?: T;

  protected $schemaTypeConstructor?: (...args: any[]) => T;

  constructor(fieldName: string, validator: Validator) {
    this.$fieldName = fieldName;
    this.$messageFormatter = new MessageFormatter(validator).setAdaptor(this);
  }

  getFieldName(): string {
    return this.$fieldName;
  }

  getType(): string {
    return this.$type;
  }

  setArrayAdaptor(adaptor: SchemaTypeArrayAdaptor<T>): void {
    this.$arrayAdaptor = adaptor;
  }

  getArrayAdaptor(): SchemaTypeArrayAdaptor<T> | undefined {
    return this.$arrayAdaptor;
  }

  getSchemaType(): T {
    if (!this.$schemaType) {
      this.$schemaType = this.makeSchemaType();
    }
    return this.$schemaType;
  }

  protected makeSchemaType(): T {
    return this.guessSchemaTypeConstructor()?.(this.getErrorMessage(this.$type));
  }

  protected guessSchemaTypeConstructor(): (...args: any[]) => T {
    return this.$schemaTypeConstructor ?? (Schema.Types as any)[`${_upperFirst(this.$type)}Type`];
  }

  protected applyRule(rule: RuleType): void {
    if (typeof rule === 'string') {
      const [slug, args] = rule.split(':', 2);

      const method = this[slug as keyof this];

      if (typeof method !== 'function') {
        this.ignoreRule(rule, `no such rule as '${slug}' is found on type '${this.$type}'`);
      } else {
        method.apply(this, (args ?? '').split(','));
      }
    } else if (this.isCustomRule(rule)) {
      this.getSchemaType().addRule(
        (value, data) => rule.check(this.getFieldName(), value, data),
        this.$messageFormatter.formatMessage(rule.errorMessage)
      );
    }
  }

  protected isCustomRule(rule: any): rule is RuleInterface {
    return !!rule && typeof rule === 'object' && typeof rule.check === 'function';
  }

  protected ignoreRule(rule: string, reason: string): void {
    console.warn(new Error(`Validation '${rule}' for field '${this.getFieldName()}' is ignored because ${reason}.`));
  }

  protected getErrorMessage(rule: string, placeholderValues?: { [name: string]: any }): string {
    return this.$messageFormatter.getFormattedMessage(rule, placeholderValues) ?? '';
  }

  applyRules(rules: RuleType[]): this {

    rules.forEach(rule => {
      this.applyRule(rule);
    });

    return this;
  }

  /**
   * Common rules implementations
   */
  required(): this {

    this.getSchemaType().isRequired(this.getErrorMessage('required'));

    return this;
  }

  protected getSize?(value: any): number;

  size(value: number): this {

    this.getSchemaType().addRule(v => {
      return this.getSize!(v) === +value;
    }, this.getErrorMessage('size', { value }));

    return this;
  }

  min(value: number): this {

    this.getSchemaType().addRule(v => {
      return this.getSize!(v) >= +value;
    }, this.getErrorMessage('min', { value }));

    return this;
  }

  max(value: number): this {

    this.getSchemaType().addRule(v => {
      return this.getSize!(v) <= +value;
    }, this.getErrorMessage('max', { value }));

    return this;
  }

  between(min: number, max: number): this {

    this.getSchemaType().addRule(v => {

      const size = this.getSize!(v);

      return size >= +min && size <= +max;
    }, this.getErrorMessage('between', { min, max }));

    return this;
  }

  same(field: string): this {

    this.getSchemaType().addRule((value, data) => {
      return value === data[field];
    }, this.getErrorMessage('same', { other: field }));

    return this;
  }

  different(field: string): this {

    this.getSchemaType().addRule((value, data) => {
      return value !== data[field];
    }, this.getErrorMessage('same', { other: field }));

    return this;
  }

  in(...values: any[]): this {

    this.getSchemaType().addRule(value => {
      return values.includes(value);
    }, this.getErrorMessage('in', { values }));

    return this;
  }

  notIn(...values: any[]): this {

    this.getSchemaType().addRule(value => {
      return !values.includes(value);
    }, this.getErrorMessage('notIn', { values }));

    return this;
  }
}


export default BaseTypeAdaptor;
