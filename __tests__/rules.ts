import { Validator } from "../src";

describe("required", () => {
  test("Should fail if value is not present or has a non-null value.", () => {
    const result = Validator.check(
      {
        present: "and non-null",
        nullish: null,
      },
      {
        present: "required",
        absent: "required",
        nullish: "required",
      }
    );

    expect(result.present).toEqual({
      hasError: false,
    });

    expect((result as any).absent).toEqual({
      hasError: true,
      errorMessage: "The absent field is required.",
    });

    expect(result.nullish).toEqual({
      hasError: true,
      errorMessage: "The nullish field is required.",
    });
  });
});

describe("size:value", () => {
  test("Should fail if string length does not match", () => {
    const result = Validator.check(
      {
        match: "abcde",
        shorter: "abcd",
        longer: "abcdef",
      },
      {
        match: "size:5",
        shorter: "size:5",
        longer: "size:5",
      }
    );

    expect(result.match).toEqual({
      hasError: false,
    });

    expect(result.shorter).toEqual({
      hasError: true,
      errorMessage: "The shorter must be 5 characters.",
    });

    expect(result.longer).toEqual({
      hasError: true,
      errorMessage: "The longer must be 5 characters.",
    });
  });

  test("Should fail if number value does not match", () => {
    const result = Validator.check(
      {
        match: 5,
        smaller: 4,
        larger: 6,
      },
      {
        match: "number|size:5",
        smaller: "number|size:5",
        larger: "number|size:5",
      }
    );

    expect(result.match).toEqual({
      hasError: false,
    });

    expect(result.smaller).toEqual({
      hasError: true,
      errorMessage: "The smaller must be 5.",
    });

    expect(result.larger).toEqual({
      hasError: true,
      errorMessage: "The larger must be 5.",
    });
  });

  test("Should fail if array length does not match", () => {
    const result = Validator.check(
      {
        match: [1, 2, 3, 4, 5],
        shorter: [1, 2, 3, 4],
        longer: [1, 2, 3, 4, 5, 6],
      },
      {
        match: "array|size:5",
        shorter: "array|size:5",
        longer: "array|size:5",
      }
    );

    expect(result.match).toEqual({
      hasError: false,
    });

    expect(result.shorter).toEqual({
      hasError: true,
      errorMessage: "The shorter must contain 5 items.",
    });

    expect(result.longer).toEqual({
      hasError: true,
      errorMessage: "The longer must contain 5 items.",
    });
  });
});

describe("max:value", () => {
  test("Should fail if string length is larger than {value}", () => {
    const result = Validator.check(
      {
        exact: "abcde",
        shorter: "abcd",
        longer: "abcdef",
      },
      {
        exact: "max:5",
        shorter: "max:5",
        longer: "max:5",
      }
    );

    expect(result.exact).toEqual({
      hasError: false,
    });

    expect(result.shorter).toEqual({
      hasError: false,
    });

    expect(result.longer).toEqual({
      hasError: true,
      errorMessage: "The longer may not be greater than 5 characters.",
    });
  });

  test("Should fail if number is larger than {value}", () => {
    const result = Validator.check(
      {
        exact: 5,
        smaller: 4,
        larger: 6,
      },
      {
        exact: "number|max:5",
        smaller: "number|max:5",
        larger: "number|max:5",
      }
    );

    expect(result.exact).toEqual({
      hasError: false,
    });

    expect(result.smaller).toEqual({
      hasError: false,
    });

    expect(result.larger).toEqual({
      hasError: true,
      errorMessage: "The larger may not be greater than 5.",
    });
  });

  test("Should fail if array length is larger than {value}", () => {
    const result = Validator.check(
      {
        exact: [1, 2, 3, 4, 5],
        shorter: [1, 2, 3, 4],
        longer: [1, 2, 3, 4, 5, 6],
      },
      {
        exact: "array|max:5",
        shorter: "array|max:5",
        longer: "array|max:5",
      }
    );

    expect(result.exact).toEqual({
      hasError: false,
    });

    expect(result.shorter).toEqual({
      hasError: false,
    });

    expect(result.longer).toEqual({
      hasError: true,
      errorMessage: "The longer may not have more than 5 items.",
    });
  });
});

describe("min:value", () => {
  test("Should fail if string length is smaller than {value}", () => {
    const result = Validator.check(
      {
        exact: "abcde",
        shorter: "abcd",
        longer: "abcdef",
      },
      {
        exact: "min:5",
        shorter: "min:5",
        longer: "min:5",
      }
    );

    expect(result.exact).toEqual({
      hasError: false,
    });

    expect(result.shorter).toEqual({
      hasError: true,
      errorMessage: "The shorter must be at least 5 characters.",
    });

    expect(result.longer).toEqual({
      hasError: false,
    });
  });

  test("Should fail if number is smaller than {value}", () => {
    const result = Validator.check(
      {
        exact: 5,
        smaller: 4,
        larger: 6,
      },
      {
        exact: "number|min:5",
        smaller: "number|min:5",
        larger: "number|min:5",
      }
    );

    expect(result.exact).toEqual({
      hasError: false,
    });

    expect(result.smaller).toEqual({
      hasError: true,
      errorMessage: "The smaller must be at least 5.",
    });

    expect(result.larger).toEqual({
      hasError: false,
    });
  });

  test("Should fail if array length is smaller than {value}", () => {
    const result = Validator.check(
      {
        exact: [1, 2, 3, 4, 5],
        shorter: [1, 2, 3, 4],
        longer: [1, 2, 3, 4, 5, 6],
      },
      {
        exact: "array|min:5",
        shorter: "array|min:5",
        longer: "array|min:5",
      }
    );

    expect(result.exact).toEqual({
      hasError: false,
    });

    expect(result.shorter).toEqual({
      hasError: true,
      errorMessage: "The shorter must have at least 5 items.",
    });

    expect(result.longer).toEqual({
      hasError: false,
    });
  });
});

describe("between:min,max", () => {
  test("Should fail if string length is out of range {min}-{max}", () => {
    const result = Validator.check(
      {
        exact: "abcde",
        shorter: "abc",
        longer: "abcdefg",
      },
      {
        exact: "between:4,6",
        shorter: "between:4,6",
        longer: "between:4,6",
      }
    );

    expect(result.exact).toEqual({
      hasError: false,
    });

    expect(result.shorter).toEqual({
      hasError: true,
      errorMessage: "The shorter must be between 4 and 6 characters.",
    });

    expect(result.longer).toEqual({
      hasError: true,
      errorMessage: "The longer must be between 4 and 6 characters.",
    });
  });

  test("Should fail if number is out of range {min}-{max}", () => {
    const result = Validator.check(
      {
        exact: 5,
        smaller: 3,
        larger: 7,
      },
      {
        exact: "number|between:4,6",
        smaller: "number|between:4,6",
        larger: "number|between:4,6",
      }
    );

    expect(result.exact).toEqual({
      hasError: false,
    });

    expect(result.smaller).toEqual({
      hasError: true,
      errorMessage: "The smaller must be between 4 and 6.",
    });

    expect(result.larger).toEqual({
      hasError: true,
      errorMessage: "The larger must be between 4 and 6.",
    });
  });

  test("Should fail if array length is out of range {min}-{max}", () => {
    const result = Validator.check(
      {
        exact: [1, 2, 3, 4, 5],
        shorter: [1, 2, 3],
        longer: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        exact: "array|between:4,6",
        shorter: "array|between:4,6",
        longer: "array|between:4,6",
      }
    );

    expect(result.exact).toEqual({
      hasError: false,
    });

    expect(result.shorter).toEqual({
      hasError: true,
      errorMessage: "The shorter must have between 4 and 6 items.",
    });

    expect(result.longer).toEqual({
      hasError: true,
      errorMessage: "The longer must have between 4 and 6 items.",
    });
  });
});

describe("gt:other", () => {
  test("Should fail if string length is smaller than or equal to {other}'s", () => {
    const result = Validator.check(
      {
        exact: "abcde",
        shorter: "abcd",
        same: "abcde",
        longer: "abcdef",
      },
      {
        shorter: "gt:exact",
        same: "gt:exact",
        longer: "gt:exact",
      }
    );

    ["shorter", "same"].forEach((field) => {
      expect(result[field]).toEqual({
        hasError: true,
        errorMessage: `The ${field} must be greater than 5 characters.`,
      });
    });

    expect(result.longer).toEqual({
      hasError: false,
    });
  });

  test("Should fail if number is smaller than or equal to {other}", () => {
    const result = Validator.check(
      {
        exact: 5,
        smaller: 4,
        same: 5,
        larger: 6,
      },
      {
        smaller: "number|gt:exact",
        same: "number|gt:exact",
        larger: "number|gt:exact",
      }
    );

    ["smaller", "same"].forEach((field) => {
      expect(result[field]).toEqual({
        hasError: true,
        errorMessage: `The ${field} must be greater than 5.`,
      });
    });

    expect(result.larger).toEqual({
      hasError: false,
    });
  });

  test("Should fail if array length is smaller than or equal to {other}'s", () => {
    const result = Validator.check(
      {
        exact: [1, 2, 3, 4, 5],
        shorter: [1, 2, 3, 4],
        same: [1, 2, 3, 4, 5],
        longer: [1, 2, 3, 4, 5, 6],
      },
      {
        shorter: "array|gt:exact",
        same: "array|gt:exact",
        longer: "array|gt:exact",
      }
    );

    ["shorter", "same"].forEach((field) => {
      expect(result[field]).toEqual({
        hasError: true,
        errorMessage: `The ${field} must have more than 5 items.`,
      });
    });

    expect(result.longer).toEqual({
      hasError: false,
    });
  });
});

describe("gte:other", () => {
  test("Should fail if string length is smaller than {other}'s", () => {
    const result = Validator.check(
      {
        exact: "abcde",
        shorter: "abcd",
        same: "abcde",
        longer: "abcdef",
      },
      {
        shorter: "gte:exact",
        same: "gte:exact",
        longer: "gte:exact",
      }
    );

    expect(result.shorter).toEqual({
      hasError: true,
      errorMessage: `The shorter must be greater than or equal 5 characters.`,
    });

    expect(result.same).toEqual({
      hasError: false,
    });

    expect(result.longer).toEqual({
      hasError: false,
    });
  });

  test("Should fail if number is smaller than {other}", () => {
    const result = Validator.check(
      {
        exact: 5,
        smaller: 4,
        same: 5,
        larger: 6,
      },
      {
        smaller: "number|gte:exact",
        same: "number|gte:exact",
        larger: "number|gte:exact",
      }
    );

    expect(result.smaller).toEqual({
      hasError: true,
      errorMessage: `The smaller must be greater than or equal 5.`,
    });

    expect(result.same).toEqual({
      hasError: false,
    });

    expect(result.larger).toEqual({
      hasError: false,
    });
  });

  test("Should fail if array length is smaller than {other}'s", () => {
    const result = Validator.check(
      {
        exact: [1, 2, 3, 4, 5],
        shorter: [1, 2, 3, 4],
        same: [1, 2, 3, 4, 5],
        longer: [1, 2, 3, 4, 5, 6],
      },
      {
        shorter: "array|gte:exact",
        same: "array|gte:exact",
        longer: "array|gte:exact",
      }
    );

    expect(result.shorter).toEqual({
      hasError: true,
      errorMessage: `The shorter must have 5 items or more.`,
    });

    expect(result.same).toEqual({
      hasError: false,
    });

    expect(result.longer).toEqual({
      hasError: false,
    });
  });
});

describe("lt:other", () => {
  test("Should fail if string length is larger than or equal to {other}'s", () => {
    const result = Validator.check(
      {
        exact: "abcde",
        shorter: "abcd",
        same: "abcde",
        longer: "abcdef",
      },
      {
        shorter: "lt:exact",
        same: "lt:exact",
        longer: "lt:exact",
      }
    );

    ["same", "longer"].forEach((field) => {
      expect(result[field]).toEqual({
        hasError: true,
        errorMessage: `The ${field} must be less than 5 characters.`,
      });
    });

    expect(result.shorter).toEqual({
      hasError: false,
    });
  });

  test("Should fail if number is larger than or equal to {other}", () => {
    const result = Validator.check(
      {
        exact: 5,
        smaller: 4,
        same: 5,
        larger: 6,
      },
      {
        smaller: "number|lt:exact",
        same: "number|lt:exact",
        larger: "number|lt:exact",
      }
    );

    ["same", "larger"].forEach((field) => {
      expect(result[field]).toEqual({
        hasError: true,
        errorMessage: `The ${field} must be less than 5.`,
      });
    });

    expect(result.smaller).toEqual({
      hasError: false,
    });
  });

  test("Should fail if array length is larger than or equal to {other}'s", () => {
    const result = Validator.check(
      {
        exact: [1, 2, 3, 4, 5],
        shorter: [1, 2, 3, 4],
        same: [1, 2, 3, 4, 5],
        longer: [1, 2, 3, 4, 5, 6],
      },
      {
        shorter: "array|lt:exact",
        same: "array|lt:exact",
        longer: "array|lt:exact",
      }
    );

    ["same", "longer"].forEach((field) => {
      expect(result[field]).toEqual({
        hasError: true,
        errorMessage: `The ${field} must have less than 5 items.`,
      });
    });

    expect(result.shorter).toEqual({
      hasError: false,
    });
  });
});

describe("lte:other", () => {
  test("Should fail if string length is larger than {other}'s", () => {
    const result = Validator.check(
      {
        exact: "abcde",
        shorter: "abcd",
        same: "abcde",
        longer: "abcdef",
      },
      {
        shorter: "lte:exact",
        same: "lte:exact",
        longer: "lte:exact",
      }
    );

    expect(result.shorter).toEqual({
      hasError: false,
    });

    expect(result.same).toEqual({
      hasError: false,
    });

    expect(result.longer).toEqual({
      hasError: true,
      errorMessage: `The longer must be less than or equal 5 characters.`,
    });
  });

  test("Should fail if number is larger than {other}", () => {
    const result = Validator.check(
      {
        exact: 5,
        smaller: 4,
        same: 5,
        larger: 6,
      },
      {
        smaller: "number|lte:exact",
        same: "number|lte:exact",
        larger: "number|lte:exact",
      }
    );

    expect(result.smaller).toEqual({
      hasError: false,
    });

    expect(result.same).toEqual({
      hasError: false,
    });

    expect(result.larger).toEqual({
      hasError: true,
      errorMessage: `The larger must be less than or equal 5.`,
    });
  });

  test("Should fail if array length is larger than {other}'s", () => {
    const result = Validator.check(
      {
        exact: [1, 2, 3, 4, 5],
        shorter: [1, 2, 3, 4],
        same: [1, 2, 3, 4, 5],
        longer: [1, 2, 3, 4, 5, 6],
      },
      {
        shorter: "array|lte:exact",
        same: "array|lte:exact",
        longer: "array|lte:exact",
      }
    );

    expect(result.shorter).toEqual({
      hasError: false,
    });

    expect(result.same).toEqual({
      hasError: false,
    });

    expect(result.longer).toEqual({
      hasError: true,
      errorMessage: `The longer must not have more than 5 items.`,
    });
  });
});

describe.skip("same:other", () => {
  test("to be done", () => {
    // todo
  });
});

describe.skip("different:other", () => {
  test("to be done", () => {
    // todo
  });
});

describe("in:value1,value2...", () => {
  test("Should fail if value is not included in given list", () => {
    const result = Validator.check(
      {
        included: "A",
        excluded: "E",
      },
      {
        included: "in:A,B,C",
        excluded: "in:A,B,C",
      }
    );

    expect(result.included).toEqual({
      hasError: false,
    });
    expect(result.excluded).toEqual({
      hasError: true,
      errorMessage: "The selected excluded is invalid.",
    });
  });
});

describe("notIn:value1,value2...", () => {
  test("Should fail if value is included in given list", () => {
    const result = Validator.check(
      {
        included: "A",
        excluded: "E",
      },
      {
        included: "notIn:A,B,C",
        excluded: "notIn:A,B,C",
      }
    );

    expect(result.included).toEqual({
      hasError: true,
      errorMessage: "The selected included is invalid.",
    });
    expect(result.excluded).toEqual({
      hasError: false,
    });
  });
});

describe("email", () => {
  test("Should fail if value is not formatted as an e-mail address", () => {
    const result = Validator.check(
      {
        email: "john@example.com",
        string: "any other string",
      },
      {
        email: "email",
        string: "email",
      }
    );
    expect(result.email).toEqual({
      hasError: false,
    });
    expect(result.string).toEqual({
      hasError: true,
      errorMessage: "The string must be a valid email address.",
    });
  });
});

describe("url", () => {
  test("Should fail if value is not a valid URL", () => {
    const result = Validator.check(
      {
        url: "https://google.com",
        string: "any other string",
      },
      {
        url: "url",
        string: "url",
      }
    );
    expect(result.url).toEqual({
      hasError: false,
    });
    expect(result.string).toEqual({
      hasError: true,
      errorMessage: "The string format is invalid.",
    });
  });
});

describe("unique:by?", () => {
  test("Should fail if array contains duplicated items", () => {
    const result = Validator.check(
      {
        distinct: [1, 2, 3, 4, 5],
        duplicated: [1, 2, 3, 4, 5, 5],
      },
      {
        distinct: "array|unique",
        duplicated: "array|unique",
      }
    );
    expect(result.distinct).toEqual({
      hasError: false,
    });
    expect(result.duplicated).toEqual({
      hasError: true,
      errorMessage: "The duplicated field has duplicate items.",
    });
  });
  test("Should fail if array contains duplicated items by property", () => {
    const result = Validator.check(
      {
        distinct: [{ id: 1 }, { id: 2 }],
        duplicatedById: [
          { id: 1, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        duplicatedByName: [
          { id: 1, name: "Tom" },
          { id: 2, name: "Tom" },
        ],
      },
      {
        distinct: "array|unique:id",
        duplicatedById: "array|unique:id",
        duplicatedByName: "array|unique:id",
      }
    );
    expect(result.distinct).toEqual({
      hasError: false,
    });
    expect(result.duplicatedById).toEqual({
      hasError: true,
      errorMessage: "The duplicatedById field has duplicate items.",
    });
    expect(result.duplicatedByName).toEqual({
      hasError: false,
    });
  });
});

describe("integer", () => {
  test("Should fail if value is not integer", () => {
    const result = Validator.check(
      {
        integer: 1,
        float: 1.2,
      },
      {
        integer: "number|integer",
        float: "number|integer",
      }
    );

    expect(result.integer).toEqual({
      hasError: false,
    });
    expect(result.float).toEqual({
      hasError: true,
      errorMessage: "The float must be an integer.",
    });
  });
});

describe("endsWith", () => {
  test("Should fail if value does not end with {values}", () => {
    const result = Validator.check(
      {
        foo: "hello world",
        bar: "hello world",
        baz: "hello world",
      },
      {
        foo: "endsWith:hello",
        bar: "endsWith:world",
        baz: "endsWith:world,hello",
      }
    );

    expect(result.foo).toHaveProperty("hasError", true);
    expect(result.bar).toHaveProperty("hasError", false);
    expect(result.baz).toHaveProperty("hasError", false);
  });

  test("Renders message correctly", () => {
    const result = Validator.check(
      {
        url: "rsuitejs.com",
      },
      {
        url: "endsWith:http",
      }
    );

    expect(result.url).toHaveProperty(
      "errorMessage",
      "The url must end with one of the following: http."
    );
  });

  test("Renders message correctly with multiple values", () => {
    const result = Validator.check(
      {
        url: "rsuitejs.com",
      },
      {
        url: "endsWith:http,https",
      }
    );

    expect(result.url).toHaveProperty(
      "errorMessage",
      "The url must end with one of the following: http,https."
    );
  });
});

describe("startsWith", () => {
  test("Should fail if value does not end with {values}", () => {
    const result = Validator.check(
      {
        foo: "hello world",
        bar: "hello world",
        baz: "hello world",
      },
      {
        foo: "startsWith:hello",
        bar: "startsWith:world",
        baz: "startsWith:world,hello",
      }
    );

    expect(result.foo).toHaveProperty("hasError", false);
    expect(result.bar).toHaveProperty("hasError", true);
    expect(result.baz).toHaveProperty("hasError", false);
  });

  test("Renders message correctly", () => {
    const result = Validator.check(
      {
        url: "rsuitejs.com",
      },
      {
        url: "startsWith:http",
      }
    );

    expect(result.url).toHaveProperty(
      "errorMessage",
      "The url must start with one of the following: http."
    );
  });

  test("Renders message correctly with multiple values", () => {
    const result = Validator.check(
      {
        url: "rsuitejs.com",
      },
      {
        url: "startsWith:http,https",
      }
    );

    expect(result.url).toHaveProperty(
      "errorMessage",
      "The url must start with one of the following: http,https."
    );
  });
});
