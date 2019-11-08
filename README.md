# [WIP]@rsuite/validation

> Validate like a boss.

    npm install -S @rsuite/validation # not now
    
## Features

- Rich built-in validation rules called with a single expression.
- Auto-detects objects and arrays.
- Easy to extend.
- `@rsuite/schema-typed` as data validation.

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

## API

#### `Validator`

    import { Validator } from '@rsuite/validation

- `static make(rules: object, messages?: object): Validator`

    Create a validator from given rules and custom message if necessary.

- `static SchemaModel(rules: object, messages?: object): Schema`
    
    Equivalent to `Validator.make(rules, messages).getSchemaModel()`,
    
- `static check(data: any, rules: object): CheckResult`

    Equivalent to `Validator.make(rules).check()`
    
- `getSchemaModel(): Schema`

    Return the `SchemaModel` instance inside the `Validator`.
    
- `check(data: any): CheckResult`
    
    Equivalent to `validator.getSchemaModel().check()`

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

## `@rsuite/schema-typed` API coverage

- Common

| API | Rule |
| --- | ---- |
| `.isRequired()` | `required` |
| `.addRule()` | - |

- `StringType()`

| API | Rule |
| --- | ---- |
| `StringType()` | `string` |
| `.isEmail()` | `email` |
| `.isURL()` | `url` |
| `.isOneOf(items)` | `in:value1,value2...` |
| `.containsLetter()` | - |
| `.containsUppercaseLetter()` | - |
| `.containsLowercaseLetter()` | - |
| `.containsLetterOnly()` | - |
| `.containsNumber()` | - |
| `.pattern(regExp)` | - |
| `.rangeLength(minLength, maxLength)` | `between:min,max` |
| `.minLength(minLength)` | `min:value` |
| `.maxLength(maxLength)` | `max:value` |

- `NumberType()`

| API | Rule |
| --- | ---- |
| `NumberType()` | `number` |
| `.isInteger()` | `integer` |
| `.isOneOf(items)` | `in:value1,value2...` |
| `.pattern(regExp)` | - |
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
- Implemented with `@rsuite/schema-typed`.

## License

MIT Licensed.
