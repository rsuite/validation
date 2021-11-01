import {
  ParsedArrayRule,
  ParsedObjectRule,
  ParsedTypeRule,
  RulesInput,
  RuleType,
  TypeSlug,
} from "./types";

function isArrayRule(rule: ParsedTypeRule): rule is ParsedArrayRule {
  return rule.type === "array";
}

function isObjectRule(rule: ParsedTypeRule): rule is ParsedObjectRule {
  return rule.type === "object";
}
/**
 * Parse input rule object
 */
class RulesParser {
  protected $validTypeSlugs = [
    "string",
    "number",
    "date",
    "boolean",
    "array",
    "object",
  ];

  protected isTypeRule(rule: string): boolean {
    return this.$validTypeSlugs.includes(rule);
  }

  parse<Parsed extends Record<string, unknown>>(
    input: RulesInput
  ): { [P in keyof Parsed]: ParsedTypeRule } {
    const rawMap = Object.keys(input).reduce<{
      [path: string]: ParsedTypeRule;
    }>((acc, path) => {
      const rules = this.getRulesFromExpression(input[path]);

      acc[path] = {
        path,
        type: rules.find((rule) => this.isTypeRule(rule as string)) as TypeSlug,
        rules: rules.filter((rule) => !this.isTypeRule(rule as string)),
      };

      return acc;
    }, {});

    Object.keys(rawMap)
      .filter((path) => /[^\\]\./.test(path))
      .forEach((path) => {
        this.mergeWildcardToParents(path, rawMap);
      });

    return Object.keys(rawMap)
      .filter((path) => !/[^\\]\./.test(path))
      .reduce((acc, path) => {
        acc[path.replace(/\\\./g, ".") as keyof Parsed] = rawMap[path];
        return acc;
      }, {} as { [P in keyof Parsed]: ParsedTypeRule });
  }

  protected getRulesFromExpression(
    expression: string | RuleType[]
  ): RuleType[] {
    if (!expression) return [];

    if (Array.isArray(expression)) return expression;

    return expression.split("|");
  }

  protected mergeWildcardToParents(
    path: string,
    rawMap: { [path: string]: ParsedTypeRule }
  ): void {
    const parentPath = this.getParentPath(path);
    if (parentPath) {
      if (!rawMap[parentPath]) {
        rawMap[parentPath] = {
          path: parentPath,
          type: undefined,
          rules: [],
        };
        this.mergeWildcardToParents(parentPath, rawMap);
      }

      if (!rawMap[parentPath].type) {
        if (path.endsWith("*")) {
          rawMap[parentPath].type = "array";
        } else {
          rawMap[parentPath].type = "object";
        }
      }
      const rule = rawMap[parentPath];
      if (isArrayRule(rule)) {
        rule.of = rawMap[path];
      }
      if (isObjectRule(rule)) {
        if (!rule.shape) {
          rule.shape = {};
        }
        (rule.shape as { [field: string]: ParsedTypeRule })[
          path.substr(parentPath.length + 1).replace(/\\\./g, ".")
        ] = rawMap[path];
      }
    }
  }

  protected getParentPath(path: string): string | null {
    let lastDotWithoutBackslashIndex = -1;
    const regex = /[^\\]\./g;
    while (regex.exec(path) !== null) {
      lastDotWithoutBackslashIndex = regex.lastIndex - 1;
    }
    if (lastDotWithoutBackslashIndex === -1) return null;

    return path.substr(0, lastDotWithoutBackslashIndex);
  }
}

export default new RulesParser();
