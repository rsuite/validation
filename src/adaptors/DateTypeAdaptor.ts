import { Schema } from 'rsuite';
import { DateType } from 'rsuite/lib/Schema/DateType';
import BaseTypeAdaptor from './BaseTypeAdaptor';

class DateTypeAdaptor extends BaseTypeAdaptor<DateType> {

  protected $type = 'date';
}

export default DateTypeAdaptor;
