const createExcludeRegex = require("../lib/to-abstract-base-template-utils/oc-webpack/lib/configurator/createExcludeRegex");

test("should create a regex that match against any node module set aside given ones", () => {
  const regex = createExcludeRegex([
    "ot-oc-template-react-email-compiler/utils",
    "@ot-react-ui/timeslots",
    "underscore"
  ]);
  expect(regex).toBeInstanceOf(RegExp);

  expect(regex.test("node_modules/lodash")).toBe(true);
  expect(regex.test("node_modules/ot-oc-template-react-email-compiler")).toBe(
    true
  );
  expect(regex.test("node_modules/@ot-react-ui/dtp")).toBe(true);

  expect(
    regex.test("node_modules/ot-oc-template-react-email-compiler/utils")
  ).toBe(false);
  expect(regex.test("node_modules/underscore")).toBe(false);
  expect(regex.test("node_modules/@ot-react-ui/timeslots")).toBe(false);
});
