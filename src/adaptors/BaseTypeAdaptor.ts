import {
  CheckType,
  ArrayType,
  BooleanType,
  DateType,
  NumberType,
  ObjectType,
  StringType,
} from "schema-typed";
import _upperFirst from "lodash.upperfirst";
import {
  ErrorMessageFormatter,
  RuleInterface,
  RuleType,
  SchemaTypeAdaptor,
  SchemaTypeArrayAdaptor,
  Types,
  TypeSlug,
  Validator,
} from "../types";
import MessageFormatter from "../MessageFormatter";

const Types = {
  ArrayType,
  BooleanType,
  DateType,
  NumberType,
  ObjectType,
  StringType,
} as const;

abstract class BaseTypeAdaptor<Type extends Types, T = Record<string, unknown>>
  implements SchemaTypeAdaptor<Type, T> {
  protected $fieldName: string;

  protected $messageFormatter: MessageFormatter;

  protected abstract $type: TypeSlug;

  protected $arrayAdaptor?: SchemaTypeArrayAdaptor<Type, T>;

  protected $schemaType?: Type;

  protected $schemaTypeConstructor?: (...args: any[]) => Type;

  constructor(fieldName: string, validator: Validator) {
    this.$fieldName = fieldName;
    this.$messageFormatter = new MessageFormatter(validator).setAdaptor(this);
  }

  getFieldName(): string {
    return this.$fieldName;
  }

  getType(): TypeSlug {
    return this.$type;
  }

  setArrayAdaptor(adaptor: SchemaTypeArrayAdaptor<Type, T>): void {
    this.$arrayAdaptor = adaptor;
  }

  getArrayAdaptor(): SchemaTypeArrayAdaptor<Type, T> | undefined {
    return this.$arrayAdaptor;
  }

  getSchemaType(): Type {
    if (!this.$schemaType) {
      this.$schemaType = this.makeSchemaType();
    }
    return this.$schemaType!;
  }

  protected makeSchemaType(): Type {
    return this.guessSchemaTypeConstructor()?.(
      this.getErrorMessage(this.$type)
    );
  }

  protected guessSchemaTypeConstructor(): (...args: any[]) => Type {
    return (
      this.$schemaTypeConstructor ??
      (Types[`${_upperFirst(this.$type) as Capitalize<TypeSlug>}Type`] as any)
    );
  }

  protected applyRule(rule: RuleType): void {
    if (typeof rule === "string") {
      const [slug, args] = rule.split(":", 2);

      const method = this[slug as keyof this];

      if (typeof method !== "function") {
        this.ignoreRule(
          rule,
          `no such rule as '${slug}' is found on type '${this.$type}'`
        );
      } else {
        method.apply(this, (args ?? "").split(","));
      }
    } else if (this.isCustomRule(rule)) {
      this.getSchemaType().addRule(
        (value, data) => rule.check(this.getFieldName(), value, data),
        this.$messageFormatter.formatMessage(rule.errorMessage)
      );
    }
  }

  protected isCustomRule(rule: any): rule is RuleInterface {
    return (
      !!rule && typeof rule === "object" && typeof rule.check === "function"
    );
  }

  protected ignoreRule(rule: string, reason: string): void {
    console.warn(
      new Error(
        `Validation '${rule}' for field '${this.getFieldName()}' is ignored because ${reason}.`
      )
    );
  }

  protected getErrorMessage(
    rule: string,
    placeholderValues?: { [name: string]: any }
  ): string {
    return (
      this.$messageFormatter.getFormattedMessage(rule, placeholderValues) ?? ""
    );
  }

  applyRules(rules: RuleType[]): this {
    rules.forEach((rule) => {
      this.applyRule(rule);
    });

    return this;
  }

  /**
   * Common rules implementations
   */
  required(): this {
    this.getSchemaType().isRequired(this.getErrorMessage("required"));

    return this;
  }

  protected getSize?(value: any): number;

  size(value: number): this {
    this.getSchemaType().addRule((v) => {
      return this.getSize!(v) === +value;
    }, this.getErrorMessage("size", { value }));

    return this;
  }

  min(value: number): this {
    this.getSchemaType().addRule((v) => {
      return this.getSize!(v) >= +value;
    }, this.getErrorMessage("min", { value }));

    return this;
  }

  max(value: number): this {
    this.getSchemaType().addRule((v) => {
      return this.getSize!(v) <= +value;
    }, this.getErrorMessage("max", { value }));

    return this;
  }

  between(min: number, max: number): this {
    this.getSchemaType().addRule((v) => {
      const size = this.getSize!(v);

      return size >= +min && size <= +max;
    }, this.getErrorMessage("between", { min, max }));

    return this;
  }

  gt(field: string): this {
    this.getSchemaType().addRule((value, data) => {
      const otherSize = this.getSize!(data![field as keyof T]);
      return {
        hasError: !(this.getSize!(value) > otherSize),
        errorMessage: this.getErrorMessage("gt", {
          other: field,
          value: otherSize,
        }),
      };
    }, "");

    return this;
  }

  gte(field: string): this {
    this.getSchemaType().addRule((value, data) => {
      const otherSize = this.getSize!(data![field as keyof T]);
      return {
        hasError: !(this.getSize!(value) >= otherSize),
        errorMessage: this.getErrorMessage("gte", {
          other: field,
          value: otherSize,
        }),
      };
    }, "");

    return this;
  }

  lt(field: string): this {
    this.getSchemaType().addRule((value, data) => {
      const otherSize = this.getSize!(data![field as keyof T]);
      return {
        hasError: !(this.getSize!(value) < otherSize),
        errorMessage: this.getErrorMessage("lt", {
          other: field,
          value: otherSize,
        }),
      };
    }, "");

    return this;
  }

  lte(field: string): this {
    this.getSchemaType().addRule((value, data) => {
      const otherSize = this.getSize!(data![field as keyof T]);
      return {
        hasError: !(this.getSize!(value) <= otherSize),
        errorMessage: this.getErrorMessage("lte", {
          other: field,
          value: otherSize,
        }),
      };
    }, "");

    return this;
  }

  same(field: string): this {
    this.getSchemaType().addRule((value, data) => {
      return value === data![field as keyof T];
    }, this.getErrorMessage("same", { other: field }));

    return this;
  }

  different(field: string): this {
    this.getSchemaType().addRule((value, data) => {
      return value !== data![field as keyof T];
    }, this.getErrorMessage("same", { other: field }));

    return this;
  }

  in(...values: any[]): this {
    this.getSchemaType().addRule((value) => {
      return values.includes(value);
    }, this.getErrorMessage("in", { values }));

    return this;
  }

  notIn(...values: any[]): this {
    this.getSchemaType().addRule((value) => {
      return !values.includes(value);
    }, this.getErrorMessage("notIn", { values }));

    return this;
  }
}

export default BaseTypeAdaptor;
