import { Schema } from "rsuite";
import { ArrayType } from "rsuite/lib/Schema/ArrayType";
import _uniqBy from "lodash.uniqby";
import BaseTypeAdaptor from "./BaseTypeAdaptor";
import { SchemaTypeAdaptor, SchemaTypeArrayAdaptor } from "../types";
import { CheckType } from "rsuite/lib/Schema";

class ArrayTypeAdaptor<T extends CheckType = any>
  extends BaseTypeAdaptor<ArrayType>
  implements SchemaTypeArrayAdaptor<T> {
  protected $type = "array";

  protected $itemAdaptor?: SchemaTypeAdaptor<T>;

  protected getSize(array: any[]): number {
    return array.length;
  }

  setItemAdaptor(adaptor: SchemaTypeAdaptor<T>): void {
    this.$itemAdaptor = adaptor;
    adaptor.setArrayAdaptor(this);
    this.getSchemaType().of(
      adaptor.getSchemaType(),
      "" // fixme
    );
  }

  getItemAdaptor(): SchemaTypeAdaptor<T> | undefined {
    return this.$itemAdaptor;
  }

  // ArrayType() native methods
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

  unique(by?: string): this {
    if (!by) {
      this.getSchemaType().unrepeatable(this.getErrorMessage("unique"));
    } else {
      this.getSchemaType().addRule((array) => {
        return array.length === _uniqBy(array, by).length;
      }, this.getErrorMessage("unique", { by }));
    }

    return this;
  }
}

export default ArrayTypeAdaptor;
