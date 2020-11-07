import { ObjectType } from 'schema-typed/types/ObjectType';
import BaseTypeAdaptor from './BaseTypeAdaptor';

class ObjectTypeAdaptor extends BaseTypeAdaptor<ObjectType> {

  protected $type = 'object';

}

export default ObjectTypeAdaptor;
