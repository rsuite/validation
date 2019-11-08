import { Schema } from "rsuite/es/Schema/Schema";
import { CheckResult } from "rsuite/es/Schema/Type";

interface ErrorMessageFormatter {
  (field: string, placeholderValues?: { [key: string]: any }): string;
}

export interface Rule {
  check(field: string, value: any, data: any): boolean;

  errorMessage: string | ErrorMessageFormatter;
}

interface MessageBag {
  [rule: string]: string | ErrorMessageFormatter;
}

type RuleExpression = string;
type RuleType = string | Rule;

interface RulesInput {
  [field: string]: RuleExpression | RuleType[];
}

declare interface Validator {
  make(rules: RulesInput, messages?: MessageBag): Validator;

  SchemaModel(rules: RulesInput, messages?: MessageBag): Schema;

  messages(messages: MessageBag): void;
}

declare class Validator {
  check(data: any): CheckResult;
}

export { Validator };
