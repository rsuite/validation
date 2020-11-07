import { Validator } from "../../src";

describe("after:date", () => {
    test("Should fail if value is earlier than date", () => {
        const result= Validator.check({
            startDate: new Date('08/01/2017')
        }, {
            startDate: 'date|after:09/01/2017'
        });

        expect(result.startDate).toHaveProperty("hasError", true);
        expect(result.startDate).toHaveProperty(
            "errorMessage",
            "The startDate must be a date after 09/01/2017."
        );
    });

    test("{date} placeholder", () => {
        const result = Validator.check({
            startDate: new Date('08/01/2017')
        }, {
            startDate: 'date|after:09/01/2017'
        }, {
            after: 'The {field} should be later than {date}.'
        });

        expect(result.startDate).toHaveProperty("hasError", true);
        expect(result.startDate).toHaveProperty(
            "errorMessage",
            "The startDate should be later than 09/01/2017."
        );
    });
});

describe('afterOrEqual:date', () => {
    test("Should fail if value is earlier than or equal to date", () => {
        const result = Validator.check({
            startDate: new Date('08/01/2017')
        }, {
            startDate: 'date|afterOrEqual:09/01/2017'
        });

        expect(result.startDate).toHaveProperty("hasError", true);
        expect(result.startDate).toHaveProperty(
            "errorMessage",
            "The startDate must be a date after or equal to 09/01/2017."
        );
    });

    test("{date} placeholder", () => {
        const result = Validator.check({
            startDate: new Date('08/01/2017')
        }, {
            startDate: 'date|afterOrEqual:09/01/2017'
        }, {
            afterOrEqual: 'The {field} should be later than or equal to {date}.'
        });

        expect(result.startDate).toHaveProperty("hasError", true);
        expect(result.startDate).toHaveProperty(
            "errorMessage",
            "The startDate should be later than or equal to 09/01/2017."
        );
    });
})
