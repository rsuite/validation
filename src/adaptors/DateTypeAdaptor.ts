import { DateType } from "../types";
import BaseTypeAdaptor from "./BaseTypeAdaptor";

class DateTypeAdaptor<
  T extends Record<string, unknown>
> extends BaseTypeAdaptor<DateType, T> {
  protected $type = "date" as const;

  after(date: string): this {
    this.getSchemaType().addRule(
      (v) => v > new Date(date),
      this.getErrorMessage("after", { date })
    );

    return this;
  }

  afterOrEqual(date: string): this {
    this.getSchemaType().min(
      date,
      this.getErrorMessage("afterOrEqual", { date })
    );

    return this;
  }

  before(date: string): this {
    this.getSchemaType().addRule(
      (v) => v < new Date(date),
      this.getErrorMessage("before", { date })
    );

    return this;
  }

  beforeOrEqual(date: string): this {
    this.getSchemaType().max(
      date,
      this.getErrorMessage("beforeOrEqual", { date })
    );

    return this;
  }
}

export default DateTypeAdaptor;
