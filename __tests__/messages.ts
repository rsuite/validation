import { Validator } from "../src";

describe("Custom error messages", () => {
  test("Should render custom rule messages", () => {
    const result = Validator.check(
      {
        name: 1,
      },
      {
        name: "string",
      },
      {
        string: "I want {field} to be a string.",
      }
    );

    expect(result.name).toHaveProperty(
      "errorMessage",
      "I want name to be a string."
    );
  });

  test("Should render custom rule messages for specific fields", () => {
    const result = Validator.check(
      {
        name: 1,
        id: 1,
      },
      {
        name: "string",
        id: "string",
      },
      {
        string: "I want {field} to be a string.",
        "id.string": "{field} shall be string.",
      }
    );

    expect(result.name).toHaveProperty(
      "errorMessage",
      "I want name to be a string."
    );

    expect(result.id).toHaveProperty("errorMessage", "id shall be string.");
  });

  test("Should render custom field names", () => {
    const result = Validator.check(
      {
        name: 1,
      },
      {
        name: "string",
      },
      {
        fields: {
          name: "CODENAME",
        },
      }
    );

    expect(result.name).toHaveProperty(
      "errorMessage",
      "The CODENAME must be a string."
    );
  });

  test("Should render custom messages with custom field names", () => {
    const result = Validator.check(
      {
        name: 1,
      },
      {
        name: "string",
      },
      {
        string: "I want {field} to be a string.",
        fields: {
          name: "CODENAME",
        },
      }
    );

    expect(result.name).toHaveProperty(
      "errorMessage",
      "I want CODENAME to be a string."
    );
  });

  test("Should render custom rule messages with custom field names for specific fields", () => {
    const result = Validator.check(
      {
        name: 1,
        id: 1,
      },
      {
        name: "string",
        id: "string",
      },
      {
        string: "I want {field} to be a string.",
        "id.string": "{field} shall be string.",
        fields: {
          id: "ID",
        },
      }
    );

    expect(result.name).toHaveProperty(
      "errorMessage",
      "I want name to be a string."
    );

    expect(result.id).toHaveProperty("errorMessage", "ID shall be string.");
  });
});
