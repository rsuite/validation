import { StringType } from "../types";
import BaseTypeAdaptor from "./BaseTypeAdaptor";

class StringTypeAdaptor<
  T extends Record<string, unknown>
> extends BaseTypeAdaptor<StringType<T>, T> {
  protected $type = "string" as const;

  protected getSize(str: string): number {
    return str.length;
  }

  // StringType() native methods
  in(...values: any[]): this {
    this.getSchemaType().isOneOf(
      values,
      this.getErrorMessage("in", { values })
    );

    return this;
  }

  between(min: number, max: number): this {
    this.getSchemaType().rangeLength(
      min,
      max,
      this.getErrorMessage("between", { min, max })
    );

    return this;
  }

  min(value: number): this {
    this.getSchemaType().minLength(
      value,
      this.getErrorMessage("min", { value })
    );

    return this;
  }

  max(value: number): this {
    this.getSchemaType().maxLength(
      value,
      this.getErrorMessage("max", { value })
    );

    return this;
  }

  email(): this {
    this.getSchemaType().isEmail(this.getErrorMessage("email"));

    return this;
  }

  url(): this {
    this.getSchemaType().isURL(this.getErrorMessage("url"));

    return this;
  }

  regex(pattern: string): this {
    this.getSchemaType().pattern(
      new RegExp(pattern),
      this.getErrorMessage("regex", { pattern })
    );

    return this;
  }

  endsWith(...values: string[]): this {
    this.getSchemaType().addRule(
      (value: string) => values.some((v) => value.endsWith(v)),
      this.getErrorMessage("endsWith", { values })
    );

    return this;
  }

  startsWith(...values: string[]): this {
    this.getSchemaType().addRule(
      (value: string) => values.some((v) => value.startsWith(v)),
      this.getErrorMessage("startsWith", { values })
    );

    return this;
  }
}

export default StringTypeAdaptor;
