import { Identifier } from "acorn";
import parser from "./parser";
import traverse from "./traverse";

const code = `
let name = "Alex";
let age = 21;

const showMyAge = () => {
  return age;
};
console.log(showMyAge());
`;

const ast = parser(code);

console.log("🪾 AST: ", ast);

const traversedAST = traverse(ast, {
  Program(node) {
    if (node.type === "Program") {
      console.log("💻 Program: ", node);
    }
  },
  Identifier(node) {
    if (node.type === "Identifier") {
      if (node.name === "name") {
        node.name = "firstName";
      }
    }
  },
});

console.log("🪾 traversed AST: ", ast);
