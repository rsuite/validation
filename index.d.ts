import { Schema } from "rsuite/es/Schema/Schema";
import { CheckResult } from "rsuite/es/Schema/Type";

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

interface MessageBag {
  [rule: string]: string | ErrorMessageFormatter | TypedErrorMessageFormatter;
}

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

declare interface ValidatorInstance {

  getSchemaModel(): Schema;

  check(data: any): CheckResult;
}

declare const Validator: ValidatorStatic;

export { Validator };
