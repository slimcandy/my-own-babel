import { type Options, Parser } from "acorn";

function parser(code: string, options: Options = { ecmaVersion: 2020 }) {
  return Parser.parse(code, options);
}

export default parser;
