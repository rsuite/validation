import { MessageBag } from './types';

const messages: MessageBag = {

  required: 'The {field} field is required.',

  size: '{field} must have a size of {value}.',

  min: '{field} must have a size no smaller than {value}.',

  max: '{field} must have a size no larger than {value}.',

  between: '{field} must have a size in range of {min}, {max}.',

  same: '{field} must have a same value as {other}.',

  different: '{field} must have a different value from {other}.',

  in: '',

  notIn: '',

  email: 'The {field} must be a valid email address.',

  url: 'The {field} format is invalid.',

  unique: 'The {field} field has duplicate items.',

  integer: 'The {field} must be an integer.'
};

export default messages;
