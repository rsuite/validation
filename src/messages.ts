import { MessageBag } from "./types";

const messages: MessageBag = {
  required: "The {field} field is required.",

  size: {
    number: "The {field} must be {value}.",
    string: "The {field} must be {value} characters.",
    array: "The {field} must contain {value} items."
  },

  min: {
    number: "The {field} must be at least {value}.",
    string: "The {field} must be at least {value} characters.",
    array: "The {field} must have at least {value} items."
  },

  max: {
    number: "The {field} may not be greater than {value}.",
    string: "The {field} may not be greater than {value} characters.",
    array: "The {field} may not have more than {value} items."
  },

  between:  {
    number: "The {field} must be between {min} and {max}.",
    string: "The {field} must be between {min} and {max} characters.",
    array: "The {field} must have between {min} and {max} items."
  },

  same: "The {field} and {other} must match.",

  different: "The {field} and {other} must be different.",

  in: "The selected {field} is invalid.",

  notIn: "The selected {} is invalid.",

  email: "The {field} must be a valid email address.",

  url: "The {field} format is invalid.",

  unique: "The {field} field has duplicate items.",

  integer: "The {field} must be an integer.",
};

export default messages;
