import parser from "../src/RulesParser";

test("Parse dot notation as object", () => {
  const result = parser.parse({
    "pet.name": "required",
  });
  expect(result.pet).toHaveProperty("type", "object");
  expect(result.pet.shape).toHaveProperty("name");
});

test("Escape dot with backslash", () => {
  const result = parser.parse({
    "v1\\.0": "required",
    "object\\.withDot.property": "required",
    "anotherObject.withDot\\.inProperty": "required",
  });
  expect(Object.keys(result)).toHaveLength(3);
  expect(result).toHaveProperty(["v1.0"]);
  expect(result).toHaveProperty(
    ["object.withDot"],
    expect.objectContaining({
      type: "object",
    })
  );
  expect(result["object.withDot"].shape).toHaveProperty("property");
  expect(result["anotherObject"].shape).toHaveProperty(["withDot.inProperty"]);
});

test("Parse wildcard notation as array", () => {
  const result = parser.parse({
    "luckyNumbers.*": "number",
  });
  expect(result.luckyNumbers).toHaveProperty("type", "array");
  expect(result.luckyNumbers.of).toHaveProperty("type", "number");
});

test("Parse wildcard with dot as array of objects", () => {
  const result = parser.parse({
    "cars.*.price": "number|min:1000000000",
  });
  expect(result.cars).toHaveProperty("type", "array");
  expect(result.cars.of).toHaveProperty("type", "object");
  expect(result.cars.of?.shape).toHaveProperty(
    "price",
    expect.objectContaining({
      type: "number",
    })
  );
});
