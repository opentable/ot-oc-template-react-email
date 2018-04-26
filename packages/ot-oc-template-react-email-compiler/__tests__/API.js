const compiler = require("../index");

// jest.mock("ot-oc-template-react-email", () => ({
//   getInfo() {
//     return {
//       version: "6.6.6",
//       externals: [
//         { name: "prop-types", global: "PropTypes", url: "cdn.com/prop-types" },
//         { name: "react", global: "React", url: "cdn.com/react" },
//         { name: "react-dom", global: "ReactDOM", url: "cdn.com/react-dom" }
//       ]
//     };
//   }
// }));

test("should expose the correct methods", () => {
  expect(compiler).toMatchSnapshot();
});
