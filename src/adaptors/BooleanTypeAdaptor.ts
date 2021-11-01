import { BooleanType } from "../types";
import BaseTypeAdaptor from "./BaseTypeAdaptor";

class BooleanTypeAdaptor<
  T extends Record<string, unknown>
> extends BaseTypeAdaptor<BooleanType<T>, T> {
  protected $type = "boolean" as const;
}

export default BooleanTypeAdaptor;
