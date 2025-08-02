import parser from "./parser";
import traverse from "./traverse";
import generate from "./generator";

// === Source Code ===
const code = `
let name = "Alex";
let age = 21;

const showMyAge = () => {
  return age;
};
console.log(showMyAge());
`;

console.log("🔹 Original Source Code:\n");
console.log(code);

// === Phase 1: Parse ===
const ast = parser(code);

console.log("\n📦 Parsed AST:");
console.log(JSON.stringify(ast, null, 2));

// === Phase 2: Transform ===
traverse(ast, {
  Identifier(node) {
    if (node.type === "Identifier") {
      if (node.name === "name") {
        node.name = "firstName";
      }
    }
  },
});

console.log("\n🔁 Transformed AST:");
console.log(JSON.stringify(ast, null, 2));

// === Phase 3: Generate Code ===
const { code: outputCode } = generate(ast);

console.log("\n🧾 Generated Output Code:\n");
console.log(outputCode);
