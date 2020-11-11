import { Schema } from "rsuite";
import { BooleanType } from "rsuite/lib/Schema/BooleanType";
import BaseTypeAdaptor from "./BaseTypeAdaptor";

class BooleanTypeAdaptor extends BaseTypeAdaptor<BooleanType> {
  protected $type = "boolean";
}

export default BooleanTypeAdaptor;
