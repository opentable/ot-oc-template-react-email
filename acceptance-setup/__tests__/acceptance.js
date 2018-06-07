/**
 * @testEnvironment jsdom
 */

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

const { cli, Registry } = require("oc");
const path = require("path");
const r = require("request-promise-native");
const fs = require("fs-extra");

jest.unmock("minimal-request");

const registryPort = 3000;
const registryUrl = `http://localhost:${registryPort}/`;
const ocComponentPath = path.join(
  __dirname,
  "../../acceptance-components/react-email-component"
);
let registry;

const semverRegex = /\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b/gi;

beforeAll(done => {
  fs.removeSync(path.join(ocComponentPath, "_package"));
  cli.package(
    {
      componentPath: ocComponentPath
    },
    (err, compiledInfo) => {
      if (err) {
        return done(err);
      }

      registry = new Registry({
        local: true,
        discovery: true,
        verbosity: 0,
        path: path.join(__dirname, "../../acceptance-components"),
        port: registryPort,
        baseUrl: registryUrl,
        env: { name: "local" },
        hotReloading: false,
        templates: [require("../../packages/ot-oc-template-react-email")]
      });

      registry.start(err => {
        if (err) {
          return done(err);
        }
        done();
      });
    }
  );
});

afterAll(done => {
  registry.close(() => {
    fs.removeSync(path.join(ocComponentPath, "_package"));
    done();
  });
});

test("Registry should correctly serve rendered and unrendered components", done => {
  const rendered = r(registryUrl + `react-email-component/?name=SuperMario`)
    .then(function(body) {
      const bodyVersionless = body
        .replace(semverRegex, "6.6.6")
        .replace(/data-hash=\\\".*?\\\"/, "")
        .replace(
          /\[\\\"oc\\\",.*?\\\"reactComponents\\\",.*?\\\".*?\\\"\]/,
          '["oc", "reactComponents", "dummyContent"]'
        );
      expect(bodyVersionless).toMatchSnapshot();
    })
    .catch(err => expect(err).toBeNull());

  rendered.then(() => done()).catch(err => done(err));
});
