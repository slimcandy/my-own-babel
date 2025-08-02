type ASTDefinition = {
  visitor: string[];
  isBlock?: boolean;
};

const astDefinitions = new Map<string, ASTDefinition>([
  ["Program", { visitor: ["body"], isBlock: true }],
  ["VariableDeclaration", { visitor: ["declarations"] }],
  ["VariableDeclarator", { visitor: ["id", "init"] }],
  ["Identifier", { visitor: [] }],
  ["StringLiteral", { visitor: [] }],
  ["NumericLiteral", { visitor: [] }],
  ["FunctionDeclaration", { visitor: ["id", "params", "body"] }],
  ["ArrowFunctionExpression", { visitor: ["params", "body"] }],
  ["BlockStatement", { visitor: ["body"] }],
  ["ReturnStatement", { visitor: ["argument"] }],
]);

export default astDefinitions;
