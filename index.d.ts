import { Schema } from "schema-typed";

type SchemaCheckResult<S, ErrorMsgType = string> = {
  [K in keyof S]: CheckResult<ErrorMsgType>
};

interface CheckResult<ErrorMsgType = string> {
  hasError: boolean;
  errorMessage: ErrorMsgType;
}

interface ErrorMessageFormatter {
  (field: string, placeholderValues?: { [key: string]: any }): string;
}

export interface Rule {
  check(field: string, value: any, data: any): boolean;

  errorMessage: string | ErrorMessageFormatter;
}

interface TypedErrorMessageFormatter {
  [type: string]: string | ErrorMessageFormatter;
}

interface Messages {
  [rule: string]: string | ErrorMessageFormatter | TypedErrorMessageFormatter;
}

type MessageBag = Messages & {
  fields?: {
    [field: string]: string;
  };
};

type RuleExpression = string;
type RuleType = string | Rule;

interface RulesInput {
  [field: string]: RuleExpression | RuleType[];
}

declare interface ValidatorStatic {
  make(rules: RulesInput, messages?: MessageBag): ValidatorInstance;

  SchemaModel(rules: RulesInput, messages?: MessageBag): Schema;

  messages(messages: MessageBag): void;
}

declare interface ValidatorInstance<S = any> {

  getSchemaModel(): Schema;

  check(data: any): SchemaCheckResult<S>;
}

declare const Validator: ValidatorStatic;

export { Validator };
