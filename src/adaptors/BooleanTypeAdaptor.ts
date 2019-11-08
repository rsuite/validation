import { Schema } from 'rsuite';
import { BooleanType } from 'rsuite/es/Schema/BooleanType';
import BaseTypeAdaptor from './BaseTypeAdaptor';

class BooleanTypeAdaptor extends BaseTypeAdaptor<BooleanType> {

  protected $type = 'boolean';

  protected $schemaType = Schema.Types.BooleanType();
}

export default BooleanTypeAdaptor;
