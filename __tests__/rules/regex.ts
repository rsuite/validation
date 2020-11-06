import { Validator } from "../../src";

describe("regex:pattern", () => {
  test("Should fail if value does not match regular expression", () => {
    // fixme incorrect return type of check()
    const result: any = Validator.make({
      link: "regex:google",
    }).check({
      link: "youtube.com",
    });

    expect(result.link).toHaveProperty("hasError", true);
    expect(result.link).toHaveProperty(
      "errorMessage",
      "The link format is invalid."
    );
  });
});
