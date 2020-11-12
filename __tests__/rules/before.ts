import { Validator } from "../../src";

describe("before:date", () => {
  test("Should fail if value is later than date", () => {
    // fixme incorrect return type of check()
    const result = Validator.check(
      {
        startDate: new Date("08/01/2017"),
      },
      {
        startDate: "date|before:07/01/2017",
      }
    );

    expect(result.startDate).toHaveProperty("hasError", true);
    expect(result.startDate).toHaveProperty(
      "errorMessage",
      "The startDate must be a date before 07/01/2017."
    );
  });

  test("{date} placeholder", () => {
    const result = Validator.check(
      {
        startDate: new Date("08/01/2017"),
      },
      {
        startDate: "date|before:07/01/2017",
      },
      {
        before: "The {field} should be later than {date}.",
      }
    );

    expect(result.startDate).toHaveProperty("hasError", true);
    expect(result.startDate).toHaveProperty(
      "errorMessage",
      "The startDate should be later than 07/01/2017."
    );
  });
});

describe("beforeOrEqual:date", () => {
  test("Should fail if value is later than or equal to date", () => {
    // fixme incorrect return type of check()
    const result = Validator.check(
      {
        startDate: new Date("08/01/2017"),
      },
      {
        startDate: "date|beforeOrEqual:07/01/2017",
      }
    );

    expect(result.startDate).toHaveProperty("hasError", true);
    expect(result.startDate).toHaveProperty(
      "errorMessage",
      "The startDate must be a date before or equal to 07/01/2017."
    );
  });

  test("{date} placeholder", () => {
    const result = Validator.check(
      {
        startDate: new Date("08/01/2017"),
      },
      {
        startDate: "date|beforeOrEqual:07/01/2017",
      },
      {
        beforeOrEqual: "The {field} should be earlier than or equal to {date}.",
      }
    );

    expect(result.startDate).toHaveProperty("hasError", true);
    expect(result.startDate).toHaveProperty(
      "errorMessage",
      "The startDate should be earlier than or equal to 07/01/2017."
    );
  });
});
