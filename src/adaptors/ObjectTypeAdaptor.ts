import { ObjectType } from "../types";
import BaseTypeAdaptor from "./BaseTypeAdaptor";

class ObjectTypeAdaptor<
  T extends Record<string, unknown>
> extends BaseTypeAdaptor<ObjectType, T> {
  protected $type = "object" as const;
}

export default ObjectTypeAdaptor;
