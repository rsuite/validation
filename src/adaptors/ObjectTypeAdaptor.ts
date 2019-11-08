import { Schema} from 'rsuite';
import { ObjectType } from 'rsuite/es/Schema/ObjectType';
import BaseTypeAdaptor from './BaseTypeAdaptor';

class ObjectTypeAdaptor extends BaseTypeAdaptor<ObjectType> {

  protected $type = 'object';

  protected $schemaType = Schema.Types.ObjectType();

}

export default ObjectTypeAdaptor;
