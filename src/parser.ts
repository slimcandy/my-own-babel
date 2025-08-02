import { type Options, Parser } from "acorn";

function parser(code: string, options: Options = { ecmaVersion: "latest" }) {
  return Parser.parse(code, options);
}

export default parser;
