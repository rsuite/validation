import { Validator } from '../src';

describe('required', () => {
    test('Should fail if value is not present or has a non-null value.', () => {
        const result = Validator.check({
            present: 'and non-null',
            nullish: null
        }, {
            present: 'required',
            absent: 'required',
            nullish: 'required'
        })

        expect(result.present).toEqual({
            hasError: false,
        })

        expect((result as any).absent).toEqual({
            hasError: true,
            errorMessage: 'The absent field is required.'
        })

        expect(result.nullish).toEqual({
            hasError: true,
            errorMessage: 'The nullish field is required.'
        })
    })
})

describe('size:value', () => {
    test('Should fail if string length does not match', () => {
        const result = Validator.check({
            match: 'abcde',
            shorter: 'abcd',
            longer: 'abcdef'
        }, {
            match: 'size:5',
            shorter: 'size:5',
            longer: 'size:5'
        });

        expect(result.match).toEqual({
            hasError: false,
        })

        expect(result.shorter).toEqual({
            hasError: true,
            errorMessage: 'The shorter must be 5 characters.'
        })

        expect(result.longer).toEqual({
            hasError: true,
            errorMessage: 'The longer must be 5 characters.'
        })
    })

    test('Should fail if number value does not match', () => {
        const result = Validator.check({
            match: 5,
            smaller: 4,
            larger: 6
        }, {
            match: 'number|size:5',
            smaller: 'number|size:5',
            larger: 'number|size:5'
        });

        expect(result.match).toEqual({
            hasError: false,
        })

        expect(result.smaller).toEqual({
            hasError: true,
            errorMessage: 'The smaller must be 5.'
        })

        expect(result.larger).toEqual({
            hasError: true,
            errorMessage: 'The larger must be 5.'
        })
    })

    test('Should fail if array length does not match', () => {
        const result = Validator.check({
            match: [1, 2, 3, 4, 5],
            shorter: [1, 2, 3, 4],
            longer: [1, 2, 3, 4, 5, 6]
        }, {
            match: 'array|size:5',
            shorter: 'array|size:5',
            longer: 'array|size:5'
        });

        expect(result.match).toEqual({
            hasError: false,
        })

        expect(result.shorter).toEqual({
            hasError: true,
            errorMessage: 'The shorter must contain 5 items.'
        })

        expect(result.longer).toEqual({
            hasError: true,
            errorMessage: 'The longer must contain 5 items.'
        })
    })
})

describe('max:value', () => {
    test('Should fail if string length is larger than {value}', () => {
        const result = Validator.check({
            exact: 'abcde',
            shorter: 'abcd',
            longer: 'abcdef'
        }, {
            exact: 'max:5',
            shorter: 'max:5',
            longer: 'max:5'
        });

        expect(result.exact).toEqual({
            hasError: false,
        })

        expect(result.shorter).toEqual({
            hasError: false,
        })

        expect(result.longer).toEqual({
            hasError: true,
            errorMessage: 'The longer may not be greater than 5 characters.'
        })
    })

    test('Should fail if number is larger than {value}', () => {
        const result = Validator.check({
            exact: 5,
            smaller: 4,
            larger: 6
        }, {
            exact: 'number|max:5',
            smaller: 'number|max:5',
            larger: 'number|max:5'
        });

        expect(result.exact).toEqual({
            hasError: false,
        })

        expect(result.smaller).toEqual({
            hasError: false,
        })

        expect(result.larger).toEqual({
            hasError: true,
            errorMessage: 'The larger may not be greater than 5.'
        })
    })

    test('Should fail if array length is larger than {value}', () => {
        const result = Validator.check({
            exact: [1, 2, 3, 4, 5],
            shorter: [1, 2, 3, 4],
            longer: [1, 2, 3, 4, 5, 6]
        }, {
            exact: 'array|max:5',
            shorter: 'array|max:5',
            longer: 'array|max:5'
        });

        expect(result.exact).toEqual({
            hasError: false,
        })

        expect(result.shorter).toEqual({
            hasError: false,
        })

        expect(result.longer).toEqual({
            hasError: true,
            errorMessage: 'The longer may not have more than 5 items.'
        })
    })
})

describe('min:value', () => {
    test('Should fail if string length is smaller than {value}', () => {
        const result = Validator.check({
            exact: 'abcde',
            shorter: 'abcd',
            longer: 'abcdef'
        }, {
            exact: 'min:5',
            shorter: 'min:5',
            longer: 'min:5'
        });

        expect(result.exact).toEqual({
            hasError: false,
        })

        expect(result.shorter).toEqual({
            hasError: true,
            errorMessage: 'The shorter must be at least 5 characters.'
        })

        expect(result.longer).toEqual({
            hasError: false,
        })
    })

    test('Should fail if number is smaller than {value}', () => {
        const result = Validator.check({
            exact: 5,
            smaller: 4,
            larger: 6
        }, {
            exact: 'number|min:5',
            smaller: 'number|min:5',
            larger: 'number|min:5'
        });

        expect(result.exact).toEqual({
            hasError: false,
        })

        expect(result.smaller).toEqual({
            hasError: true,
            errorMessage: 'The smaller must be at least 5.'
        })

        expect(result.larger).toEqual({
            hasError: false,
        })
    })

    test('Should fail if array length is smaller than {value}', () => {
        const result = Validator.check({
            exact: [1, 2, 3, 4, 5],
            shorter: [1, 2, 3, 4],
            longer: [1, 2, 3, 4, 5, 6]
        }, {
            exact: 'array|min:5',
            shorter: 'array|min:5',
            longer: 'array|min:5'
        });

        expect(result.exact).toEqual({
            hasError: false,
        })

        expect(result.shorter).toEqual({
            hasError: true,
            errorMessage: 'The shorter must have at least 5 items.'
        })

        expect(result.longer).toEqual({
            hasError: false,
        })
    })
})