import { Validator } from "../../src";

describe("regex:pattern", () => {
  test("Should fail if value does not match regular expression", () => {
    // fixme incorrect return type of check()
    const result: any = Validator.check({
      link: "youtube.com",
    }, {
      link: "regex:google",
    });

    expect(result.link).toHaveProperty("hasError", true);
    expect(result.link).toHaveProperty(
      "errorMessage",
      "The link format is invalid."
    );
  });

  test("{pattern} placeholder", () => {
    const result: any = Validator.check({
      link: "youtube.com",
    }, {
      link: "regex:google",
    }, {
      regex: 'The {field} does not match {pattern} pattern.'
    });

    expect(result.link).toHaveProperty("hasError", true);
    expect(result.link).toHaveProperty(
      "errorMessage",
      "The link does not match google pattern."
    );
  });
});
