import { BooleanType } from 'schema-typed/types/BooleanType';
import BaseTypeAdaptor from './BaseTypeAdaptor';

class BooleanTypeAdaptor extends BaseTypeAdaptor<BooleanType> {

  protected $type = 'boolean';
}

export default BooleanTypeAdaptor;
