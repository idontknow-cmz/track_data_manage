const { pathToRegexp } = require("path-to-regexp");
const multer = require("multer");
const bodyParser = require("body-parser");
import mockApiData from "./api";


const BODY_PARSED_METHODS = ["post", "put", "patch", "delete"];
export function parseKey(key: string) {

  console.log('key', key)

  let method = "get";
  let path = key;
  if (/\s+/.test(key)) {
    const splited = key.split(/\s+/);
    method = splited[0].toLowerCase();
    path = splited[1]; // eslint-disable-line
  }

  console.log('method', method)
  console.log('path', path)

  return {
    method,
    path,
  };
}

function createHandler(method: any, path: any, handler: any) {
  return function (req: Request, res: any, next: any) {
    if (BODY_PARSED_METHODS.includes(method)) {
      // @ts-ignore
      bodyParser.json({ limit: "5mb", strict: false })(req, res, () => {
        // @ts-ignore
        bodyParser.urlencoded({ limit: "5mb", extended: true })(
          req,
          res as any,
          () => {
            sendData();
          }
        );
      });
    } else {
      sendData();
    }

    function sendData() {
      if (typeof handler === "function") {
        multer().any()(req, res, () => {
          handler(req, res, next);
        });
      } else {
        res.json(handler);
      }
    }
  };
}

export const normalizeConfig = (config: any) => {
  return Object.keys(config).reduce((memo: any, key) => {
    const handler = config[key];
    const type = typeof handler;

    const { method, path } = parseKey(key);
    const keys: any[] = [];
    // @ts-ignore
    const re = pathToRegexp(path, keys);
    memo.push({
      method,
      path,
      re,
      keys,
      handler: createHandler(method, path, handler),
    });
    return memo;
  }, []);
};

export default function mockServer(app: any) {
  const mockData = normalizeConfig(mockApiData);
  for (const mock of mockData) {
    const { method, re, handler } = mock;
    app[method](re, handler);
  }
}
