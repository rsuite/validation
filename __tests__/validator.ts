import Validator from "../src/Validator";

describe("Custom rules", () => {
  test("Call custom checks", () => {
    const check = jest.fn();
    Validator.check(
      {
        name: "awesome",
      },
      {
        name: [
          {
            check,
            errorMessage: "invalid",
          },
        ],
      }
    );

    expect(check).toHaveBeenCalled();
  });
});
