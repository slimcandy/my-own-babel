# Babel-like Compiler (Educational)

This is an educational project that demonstrates how Babel works under the hood by implementing a simplified compiler with three main phases:

1. **Parsing** - converts source code to an Abstract Syntax Tree (AST)
2. **Transforming** - traverses and modifies the AST
3. **Generating** - converts the transformed AST back to source code

## Features

- Parser using Acorn
- AST traversal with visitor pattern
- Code generation with proper formatting
- Source map support (basic)
- TypeScript type safety

## How It Works

1. **Parsing**: Uses Acorn to parse JavaScript code into an AST
2. **Traversing**: Walks the AST with visitor callbacks (enter/exit hooks)
3. **Generating**: Reconstructs JavaScript code from the AST with proper indentation

## Installation

```bash
npm install
```

Run typescript in watch mode

```bash
npm run typescript
```

Run project in watch mode

```bash
npm run dev
```

## Usage

```javascript
import parser from "./parser";
import traverse from "./traverse";
import generate from "./generator";

const code = `let x = 10;`;
const ast = parser(code);

traverse(ast, {
  Identifier(node) {
    if (node.name === "x") {
      node.name = "y";
    }
  },
});

const { code: output } = generate(ast);
console.log(output); // "let y = 10;"
```

## Project Structure

- `parser.ts`: Converts source code to AST using Acorn
- `traverse.ts`: Implements AST traversal with visitor pattern
- `generator.ts`: Converts AST back to JavaScript code
- `ast-map.ts`: Defines AST node types and their traversal properties

## Learning Resources

- [Write your own Babel](https://mohammadtaheri.medium.com/write-your-own-babel-54ab880f1dfd) by Mohammad Taheri
- [Babel Plugin Handbook](https://github.com/jamiebuilds/babel-handbook)
- [AST Explorer](https://astexplorer.net/)
- [Acorn Documentation](https://github.com/acornjs/acorn)
