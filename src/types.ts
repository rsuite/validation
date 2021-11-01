import { ArrayType } from "schema-typed/lib/ArrayType";
import { BooleanType } from "schema-typed/lib/BooleanType";
import { DateType } from "schema-typed/lib/DateType";
import { NumberType } from "schema-typed/lib/NumberType";
import { ObjectType } from "schema-typed/lib/ObjectType";
import { StringType } from "schema-typed/lib/StringType";

export type {
  ArrayType,
  BooleanType,
  DateType,
  NumberType,
  ObjectType,
  StringType,
};

export type Types =
  | ArrayType
  | BooleanType
  | DateType
  | NumberType
  | ObjectType
  | StringType;

export type TypesMap = {
  string: StringType;
  number: NumberType;
  boolean: BooleanType;
  date: DateType;
  array: ArrayType;
  object: ObjectType;
};

export type SchemaCheckResult<S = any, M = string> = {
  [K in keyof S]?: CheckResult<M>;
};

export interface CheckResult<M = string> {
  hasError: boolean;
  errorMessage: M;
}

export type ErrorMessageFormatter =
  | string
  | ((field: string, placeholderValues?: { [key: string]: any }) => string);

export interface TypedErrorMessageFormatter {
  [type: string]: ErrorMessageFormatter;
}

export interface Messages {
  [key: string]: ErrorMessageFormatter | TypedErrorMessageFormatter;
}

export type MessageBag = Messages & {
  fields?: {
    [field: string]: string;
  };
};

export type TypeSlug = keyof TypesMap;

export interface ParsedScalarRule {
  path: string;
  type: TypeSlug | undefined;
  rules: RuleType[];
}

export interface ParsedArrayRule extends ParsedScalarRule {
  type: "array";
  of?: ParsedTypeRule;
}

export interface ParsedObjectRule extends ParsedScalarRule {
  type: "object";
  shape?: {
    [prop: string]: ParsedTypeRule;
  };
}

export type ParsedTypeRule =
  | ParsedScalarRule
  | ParsedArrayRule
  | ParsedObjectRule;

export interface SchemaTypeAdaptor<
  Type extends Types,
  Schema = Record<string, unknown>
> {
  getType(): TypeSlug;

  getSchemaType(): Type;

  getFieldName(): string;

  applyRules(rules: RuleType[]): this;

  setArrayAdaptor(adaptor: SchemaTypeArrayAdaptor<Type, Schema>): any;

  getArrayAdaptor(): SchemaTypeArrayAdaptor<Type, Schema> | undefined;
}

export interface SchemaTypeArrayAdaptor<
  Type extends Types,
  Schema = Record<string, unknown>
> extends SchemaTypeAdaptor<ArrayType, Schema> {
  setItemAdaptor(adaptor: SchemaTypeAdaptor<Type, Schema>): any;

  getItemAdaptor(): SchemaTypeAdaptor<Type, Schema> | undefined;
}

export interface RuleInterface {
  check(field: string, value: any, data: any): boolean;

  errorMessage: ErrorMessageFormatter;
}

export type RuleType = string | RuleInterface;

type RulesExpression = string;

export interface RulesInput {
  [field: string]: RulesExpression | RuleType[];
}

interface Validator {
  getMessageBag(): MessageBag;
}

class Validator {}

export { Validator };
