import { Schema } from "rsuite";
import { ObjectType } from "rsuite/lib/Schema/ObjectType";
import BaseTypeAdaptor from "./BaseTypeAdaptor";

class ObjectTypeAdaptor extends BaseTypeAdaptor<ObjectType> {
  protected $type = "object";
}

export default ObjectTypeAdaptor;
