# @rsuite/validation

> Validate like a boss.

![Node.js CI](https://github.com/rsuite/validation/workflows/Node.js%20CI/badge.svg)
[![npm version](https://badge.fury.io/js/%40rsuite%2Fvalidation.svg)](https://badge.fury.io/js/%40rsuite%2Fvalidation)

    npm install -S @rsuite/validation
    
## Features

- Rich built-in validation rules called with a single expression.
- Auto-detects objects and arrays.
- Easy to extend.
- [`rsuite/schema-typed`](https://github.com/rsuite/schema-typed) as data validation.

## Usage

### Validate data

```js
import { Validator } from '@rsuite/validation';

const checkResult = Validator.check(data, {
  name: 'required',
  email: 'required|email',
  age: 'number|between:18,30'
});
```

### Create SchemaModel for `<Form>` component

```js
import { Validator } from '@rsuite/validation';

const model = Validator.SchemaModel({
  name: 'required',
  email: 'required|email',
  age: 'number|between:18,30'
});
```

### Validate array items and object properties

```js
import { Validator } from '@rsuite/validation';

const validator = Validator.make({
  'pet.name': 'required', // Auto-detects `pet` as an object of shape { name: string }
  'luckyNumbers.*': 'number', // Auto-detects `luckyNumbers` as an array, whose items should be numbers
  'cars.*.price': 'number|min:1000000000' // Auto-detects `cars` as an array of objects of shape { price: number }
});
```

### Custom error messages

You can override error message for any rule, or for any rule on any field specifically.
```js
import { Validator } from '@rsuite/validation';

const validator = Validator.make({
  name: 'required',
  email: 'required|email',
  age: 'required|number|between:18,30'
}, {
  required: 'You should not omit {field}!',
  'email.required'(field) {
    return 'Email is a must.'
  },
  'age.between': 'Age should be between {min} and {max}',
  fields: {
    email: 'Email address'
  }
});
```

Learn more in Error messages.

### Custom rules

```js
import { Validator } from '@rsuite/validation';

const validator = Validator.make({
  name: ['required', {
    check(field, value, data) {
      return value === 'Tom';
    },
    errorMessage: 'Only whose {field} is Tom shall pass.'
  }]
});
```

Learn more in Custom validation rules.

## API

#### `Validator`

    import { Validator } from '@rsuite/validation

- `static make(rules: object, messages?: object): Validator`

    Create a validator from given rules and custom message if necessary.
    
- `static message(messages: object): void`

    Define custom error messages for all Validators.

- `static SchemaModel(rules: object, messages?: object): Schema`
    
    Equivalent to `Validator.make(rules, messages).getSchemaModel()`,
    
- `static check(data: any, rules: object): CheckResult`

    Equivalent to `Validator.make(rules).check()`
    
- `getSchemaModel(): Schema`

    Return the `SchemaModel` instance inside the `Validator`.
    
- `check(data: any): CheckResult`
    
    Equivalent to `validator.getSchemaModel().check()`

## Error messages

`@rsuite/validation` is packed with predefined messages for every built-in rules.
You can define your own messages for Validator, either per rule or per rule per field.

```js
const validator = Validator.make({
  name: 'required',
  email: 'required|email',
  age: 'required|number|between:18,30'
}, {
  required: customMessage1,
  'age.between': customMessage2
});
```

A custom message should be either a string or a `ErrorMessageFormatter`.

```typescript
interface ErrorMessageFormatter {
  (field: string, placeholderValues?: any): string;
}
```

If you want to customize how your field names are displayed in the error messages (by default is capitalized), set them in `field` property of the message bag.

```typescript
const validator = Validator.make({
  name: 'required',
  email: 'required|email',
  age: 'required|number|between:18,30'
}, {
  required: 'Please enter {field}',
  fields: {
    email: 'Email address'
  }
});
```

### Defined messages globally

Use `Validator.messages()` to register message bag globally.

```javascript
Validator.messages({
  required: 'Please enter {field}.'
})
```

### Placeholders

You can use placeholders (marked with brackets) in your error message string.
Note that you can only use them when your error message is a string, not a formatter function.

```javascript
const messages = {
  required: '{field} is required.',
  min: '{field} must be no smaller than {value}.'
}
```

Each rule has different placeholders available, while `{field}` is available across all rules, representing the field name declared in your rules object.
Most placeholders have the same name as the rule signature.
Here is a full list of built-in rules that have placeholders in messages.

| Rule signature | Placeholders |
| -------------- | ------------ |
| `size:value` | `{value}` |
| `max:value` | `{value}` |
| `min:value` | `{value}` |
| `between:min,max` | `{min}`, `{max}` |
| `same:other` | `{other}` |
| `different:other` | `{other}` |
| `in:value1,value2...` | `{values}` |
| `notIn:value1,value2...` | `{values}` |
| `unique:by?` | `{by}` |
| `regex:pattern` | `{pattern}` |

If you use `ErrorMessageFormatter`, placeholders values are passed in as an object to its second argument.

## Available rules

### Type rules

`@rsuite/validation` has 6 supported types.
Some rules are effective among all these types, some are only effective under specific types.

- `string`

    Equivalent to `StringType()`. 
    Most of time you can omit this because `string` is the default type.

- `number`
    
    Equivalent to `NumberType()`.
    
- `array`

    Equivalent to `ArrayType()`.
    
- `date`

    Equivalent to `DateType()`.
    
- `object`

    Equivalent to `ObjectType()`.
    
- `boolean`

    Equivalent to `BooleanType()`.
    
### Validation rules

- `required` for all types
    
    The field under validation must be present and have a non-empty value. Apply `isRequired()` from `@rsuite/schema-typed`.
    
- `size:value` for `string`, `number`, `array`
    
    The field under validation must have a 'size' of `value`, where size is:
    
    - `string`'s length.
    - `number`'s value.
    - `array`'s length.

- `max:value` for `string`, `number`, `array`

    The field under validation must have a 'size' no larger than `value`. See `size` rule for more about 'size'.
    
- `min:value` for `string`, `number`, `array`

    The field under validation must have a 'size' no smaller than `value`. See `size` rule for more about 'size'.
    
- `between:min,max` for `string`, `number`, `array`

    The field under validation must have a 'size' between `min` and `max`. See `size` rule for more about 'size'.
    
- `same:other` for all types

    The field under validation must have the same value with `other` field.
    
- `different:other` for all types

    The field under validation must have the different value from `other` field.
    
- `in:value1,value2...` for `string`, `number`

    The field under validation must be included in the given list of values.
    
- `notIn:value1,value2...` for `string`, `number`

    The field under validation must not be included in the given list of values.
    
- `email` for `string`

    The field under validation must be formatted as an e-mail address.

- `url` for `string`

    The field under validation must be a valid URL.
    
- `unique:by?` for `array`

    The array under validation must not have any duplicate items.
    If `by` is provided for array of objects, duplication is checked by object property.

- `integer` for `number`

    The field under validation must be an integer.

- `regex:pattern` for `string`, `number`

    The field under validation must match the given regular expression.

    **Note:** When using the `regex` patterns, it may be necessary to specify rules in an array instead of using pipe delimiters, especially if the regular expression contains a pipe character.
    
## Custom validation rules

In addition to built-in validation rules, you can also define you own validation rules.

```javascript
Validator.make({
  name: ['required', customRule1, customRule2],
  email: ['required', 'email', customRule3]
})
```

A custom rule must implement `Rule` interface.

```typescript
interface Rule {
  /**
   * Check whether the value passes this rule
   */
  check(field: string, value: any, data: any): boolean;

  /**
   * Message to show when this rule fails.
   */
  errorMessage: string | ErrorMessageFormatter;
}
```

## `@rsuite/schema-typed` API coverage

The table below shows `@rsuite/schema-typed` API and their equivalent rules in `@rsuite/validation`.
Note that *equivalent means equivalent*, which is, implementation of the rule is calling the according API or copies its underlying implementation.
Those APIs that don't have an equivalent rule for now (marked as `-`) can still be achieved using Custom validation rules.

- Common

| API | Rule |
| --- | ---- |
| `.isRequired()` | `required` |
| `.addRule()` | Custom validation rules |

- `StringType()`

| API | Rule |
| --- | ---- |
| `StringType()` | `string` |
| `.isEmail()` | `email` |
| `.isURL()` | `url` |
| `.isOneOf(items)` | `in:value1,value2...` |
| `.containsLetter()` | `regex:[a-zA-Z]` |
| `.containsUppercaseLetter()` | `regex:[A-Z]` |
| `.containsLowercaseLetter()` | `regex:[a-z]` |
| `.containsLetterOnly()` | `regex:^[a-zA-Z]+$` |
| `.containsNumber()` | `regex:[0-9]` |
| `.pattern(regExp)` | `regex:pattern` |
| `.rangeLength(minLength, maxLength)` | `between:min,max` |
| `.minLength(minLength)` | `min:value` |
| `.maxLength(maxLength)` | `max:value` |

- `NumberType()`

| API | Rule |
| --- | ---- |
| `NumberType()` | `number` |
| `.isInteger()` | `integer` |
| `.isOneOf(items)` | `in:value1,value2...` |
| `.pattern(regExp)` | `regex:pattern` |
| `.range(min, max)` | `between:min,max` |
| `.min(min)` | `min:value` |
| `.max(max)` | `max:value` |

- `ArrayType()`

| API | Rule |
| --- | ---- |
| `ArrayType()` | `array` or auto-detect from field expression |
| `.rangeLength(minLength, maxLength)` | `between:min,max` |
| `.minLength(minLength)` | `min:value` |
| `.maxLength(maxLength)` | `max:value` |
| `.unrepeatable()` | `unique` |
| `.of(type)` | Wildcard field expression |


- `DateType()`

| API | Rule |
| --- | ---- |
| `DateType()` | `date` |
| `.range(min,max)` | - |
| `.min(min)` | - |
| `.max(max)` | - |

- `ObjectType()`

| API | Rule |
| --- | ---- |
| `ObjectType()` | `object` or auto-detect from field expression |
| `.shape(type)` | Auto-detect from field expression |

- `BooleanType()`

| API | Rule |
| --- | ---- |
| `BooleanType()` | `boolean` |


## Philosophy

- `@rsuite/validation` supposes default type for a field to be `string`, 
  respecting HTML `<input>`s' value definition, 
  so you can get rid of calling `StringType()` every time.

- `@rsuite/validation` normalizes error messages for rules,
  so you don't need to declare error messages for every call of a rule,
  but only when you need to customize them.

- `@rsuite/validation` extracts common rules across different types like `min`, `max`, etc.
  so you remember them easily.


## Prior Art

- Inspired by Laravel Validation.
- Implemented with [`rsuite/schema-typed`](https://github.com/rsuite/schema-typed).

## License

MIT Licensed.
