import {
  Schema,
  CheckType,
  SchemaModel,
  SchemaCheckResult,
  SchemaDeclaration,
} from "schema-typed";
import {
  MessageBag,
  ObjectType,
  ParsedTypeRule,
  RulesInput,
  SchemaTypeAdaptor,
  Types,
} from "./types";
import StringTypeAdaptor from "./adaptors/StringTypeAdaptor";
import ArrayTypeAdaptor from "./adaptors/ArrayTypeAdaptor";
import ObjectTypeAdaptor from "./adaptors/ObjectTypeAdaptor";
import RulesParser from "./RulesParser";
import NumberTypeAdaptor from "./adaptors/NumberTypeAdaptor";
import BooleanTypeAdaptor from "./adaptors/BooleanTypeAdaptor";
import DateTypeAdaptor from "./adaptors/DateTypeAdaptor";
import defaultMessageBag from "./messages";

class Validator<Parsed extends Record<string, unknown>> {
  /**
   * 记录是否已经创建 Validator 实例，用于在设置语言包时给出警告
   */
  protected static $booted: boolean = false;

  protected static $globalMessageBag = defaultMessageBag;

  static make<T extends Record<string, unknown>>(
    rules: RulesInput,
    messages?: MessageBag
  ): Validator<T> {
    return new Validator(rules, messages);
  }

  static SchemaModel(rules: RulesInput, messages?: MessageBag): Schema {
    return this.make(rules, messages).getSchemaModel();
  }

  static check<T extends Record<string, unknown>>(
    data: any,
    rules: RulesInput,
    messages?: MessageBag
  ): SchemaCheckResult<T, string> {
    return this.make<T>(rules, messages).check(data);
  }

  static messages(messages: MessageBag): void {
    if (Validator.$booted) {
      console.warn(
        "Validator.messages() won't take effect in Validator instances created before it's called. You may want to call it in advance."
      );
    }
    if (messages) {
      this.$globalMessageBag = this.mergeMessageBag(
        this.$globalMessageBag,
        messages
      );
    }
  }

  protected static mergeMessageBag(
    origin: MessageBag,
    messages?: MessageBag
  ): MessageBag {
    return {
      ...origin,
      ...messages,
      fields: {
        ...origin.fields,
        ...messages?.fields,
      },
    };
  }

  protected $rawRules: RulesInput;

  protected $parsedRules!: {
    [P in keyof Parsed]: ParsedTypeRule;
  };

  protected $schemaModel!: Schema;

  protected $messageBag?: MessageBag;

  constructor(rules: RulesInput, messages?: MessageBag) {
    Validator.$booted = true;
    this.$rawRules = rules;
    this.$messageBag = messages;
    this.parseRules();
    this.makeSchemaModel();
  }

  check(data: any): SchemaCheckResult<Parsed, string> {
    // fixme use types from schema-typed directly in future updates
    return this.getSchemaModel().check(data) as any;
  }

  getRawRules(): RulesInput {
    return this.$rawRules;
  }

  getParsedRules(): { [P in keyof Parsed]: ParsedTypeRule } {
    return this.$parsedRules;
  }

  getMessageBag(): MessageBag {
    return Validator.mergeMessageBag(
      Validator.$globalMessageBag,
      this.$messageBag
    );
  }

  protected parseRules(): void {
    this.$parsedRules = RulesParser.parse(this.getRawRules());
  }

  protected makeSchemaModelSchema(): SchemaDeclaration<Parsed, string> {
    return this.parsedTypeRuleMap(this.getParsedRules());
  }

  protected parsedTypeRuleMap(input: {
    [path: string]: ParsedTypeRule;
  }): SchemaDeclaration<Parsed, string> {
    return Object.keys(input).reduce((acc, field: keyof Parsed) => {
      acc[field] = this.newAdaptorForRule(input[field]).getSchemaType();
      return acc;
    }, {} as SchemaDeclaration<Parsed, string>);
  }

  protected newAdaptorForRule({
    path: fieldName,
    type,
    rules,
    ...rule
  }: ParsedTypeRule): SchemaTypeAdaptor<any, any> {
    let adaptor: SchemaTypeAdaptor<any, any>;

    switch (type) {
      case "number":
        adaptor = new NumberTypeAdaptor(fieldName, this);
        break;
      case "array":
        adaptor = new ArrayTypeAdaptor(fieldName, this);
        if ("of" in rule) {
          (adaptor as ArrayTypeAdaptor<any, any>).setItemAdaptor(
            this.newAdaptorForRule(rule.of!)
          );
        }
        break;
      case "object":
        adaptor = new ObjectTypeAdaptor(fieldName, this);
        if ("shape" in rule) {
          (adaptor.getSchemaType() as ObjectType).shape(
            this.parsedTypeRuleMap(rule.shape!)
          );
        }
        break;
      case "boolean":
        adaptor = new BooleanTypeAdaptor(fieldName, this);
        break;
      case "date":
        adaptor = new DateTypeAdaptor(fieldName, this);
        break;
      case "string":
      default:
        adaptor = new StringTypeAdaptor(fieldName, this);
        break;
    }

    return adaptor.applyRules(rules);
  }

  protected makeSchemaModel(): void {
    this.$schemaModel = SchemaModel(this.makeSchemaModelSchema());
  }

  getSchemaModel(): Schema {
    return this.$schemaModel;
  }
}

export default Validator;
