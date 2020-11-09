import parser from "../src/RulesParser";

test("parse dot notation as object", () => {
  const result = parser.parse({
    "pet.name": "required",
  });
  expect(result.pet).toHaveProperty("type", "object");
  expect(result.pet.shape).toHaveProperty("name");
});

test("parse wildcard notation as array", () => {
  const result = parser.parse({
    "luckyNumbers.*": "number",
  });
  expect(result.luckyNumbers).toHaveProperty("type", "array");
  expect(result.luckyNumbers.of).toHaveProperty("type", "number");
});

test("wildcard with dot", () => {
  const result = parser.parse({
    "cars.*.price": "number|min:1000000000",
  });
  expect(result.cars).toHaveProperty("type", "array");
  expect(result.cars.of).toHaveProperty("type", "object");
  expect(result.cars.of.shape).toHaveProperty(
    "price",
    expect.objectContaining({
      type: "number",
    })
  );
});
