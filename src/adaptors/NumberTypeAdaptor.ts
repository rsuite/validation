import { Schema } from "rsuite";
import { NumberType } from "rsuite/lib/Schema/NumberType";
import BaseTypeAdaptor from "./BaseTypeAdaptor";

class NumberTypeAdaptor extends BaseTypeAdaptor<NumberType> {
  protected $type = "number";

  protected getSize(value: number): number {
    return value;
  }

  // NumberType() native methods
  in(...values: any[]): this {
    this.getSchemaType().isOneOf(
      values.map(Number),
      this.getErrorMessage("in", { values })
    );

    return this;
  }

  between(min: number, max: number): this {
    this.getSchemaType().range(
      min,
      max,
      this.getErrorMessage("between", { min, max })
    );

    return this;
  }

  min(value: number): this {
    this.getSchemaType().min(value, this.getErrorMessage("min", { value }));

    return this;
  }

  max(value: number): this {
    this.getSchemaType().max(value, this.getErrorMessage("max", { value }));

    return this;
  }

  integer(): this {
    this.getSchemaType().isInteger(this.getErrorMessage("integer"));

    return this;
  }

  regex(pattern: string): this {
    this.getSchemaType().pattern(
      new RegExp(pattern),
      this.getErrorMessage("regex")
    );

    return this;
  }
}

export default NumberTypeAdaptor;
