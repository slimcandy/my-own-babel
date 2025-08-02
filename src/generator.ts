import {
  AnonymousFunctionDeclaration,
  AnyNode,
  ArrowFunctionExpression,
  BlockStatement,
  FunctionDeclaration,
  Identifier,
  Literal,
  Program,
  ReturnStatement,
  VariableDeclaration,
  VariableDeclarator,
} from "acorn";
import { SourceMapGenerator } from "source-map";

type NodeHandler = (node: AnyNode) => void;

type HandlerMap = {
  [K in AnyNode["type"]]?: (node: Extract<AnyNode, { type: K }>) => void;
};

class Generator {
  private code = "";
  private indentLevel = 0;

  private handlers: HandlerMap;

  constructor() {
    this.handlers = {
      Program: this.Program.bind(this),
      VariableDeclaration: this.VariableDeclaration.bind(this),
      VariableDeclarator: this.VariableDeclarator.bind(this),
      Identifier: this.Identifier.bind(this),
      Literal: this.Literal.bind(this),
      FunctionDeclaration: this.FunctionDeclaration.bind(this),
      ArrowFunctionExpression: this.ArrowFunctionExpression.bind(this),
      BlockStatement: this.BlockStatement.bind(this),
      ReturnStatement: this.ReturnStatement.bind(this),
    };
  }

  private callHandler(node: AnyNode): void {
    const handler = this.handlers[node.type] as NodeHandler | undefined;
    if (handler) {
      handler(node);
    }
  }

  // ========== Utility methods ==========

  private add(text: string) {
    this.code += text;
  }

  private newLine() {
    this.code += "\n" + "  ".repeat(this.indentLevel);
  }

  private indent() {
    this.indentLevel++;
    this.newLine();
  }

  private dedent() {
    this.indentLevel = Math.max(0, this.indentLevel - 1);
    this.newLine();
  }

  private generateSourceMap() {
    return new SourceMapGenerator({
      file: "output.js.map",
    });
  }

  // ========== Node handlers ==========

  Program(node: Program) {
    node.body.forEach((statement) => {
      this.callHandler(statement);
      this.add(";");
      this.newLine();
    });
  }

  VariableDeclaration(node: VariableDeclaration) {
    this.add(`${node.kind} `);
    node.declarations.forEach((declaration, index) => {
      if (index > 0) this.add(", ");
      this.callHandler(declaration);
    });
  }

  VariableDeclarator(node: VariableDeclarator) {
    this.callHandler(node.id);

    if (node.init) {
      this.add(" = ");
      this.callHandler(node.init);
    }
  }

  Identifier(node: Identifier) {
    this.add(node.name);
  }

  Literal(node: Literal) {
    if (typeof node.value === "string") {
      this.add(`"${node.value}"`);
    } else {
      this.add(String(node.value));
    }
  }

  FunctionDeclaration(
    node: FunctionDeclaration | AnonymousFunctionDeclaration
  ) {
    if (node.id === null) {
      this.add(`function(`);
    } else {
      this.add(`function ${node.id.name}(`);
    }
    this.add(
      node.params
        .filter((parameter) => parameter.type === "Identifier")
        .map((parameter) => parameter.name)
        .join(", ")
    );
    this.add(") {");
    this.indent();
    this.callHandler(node.body);
    this.dedent();
    this.add("}");
  }

  ArrowFunctionExpression(node: ArrowFunctionExpression) {
    this.add("function(");
    this.add(
      node.params
        .filter((parameter) => parameter.type === "Identifier")
        .map((parameter) => parameter.name)
        .join(", ")
    );
    this.add(") {");
    this.indent();

    if (node.body.type === "BlockStatement") {
      this.callHandler(node.body);
    } else {
      this.add("return ");
      this.callHandler(node.body);
      this.add(";");
      this.newLine();
    }

    this.dedent();
    this.add("}");
  }

  BlockStatement(node: BlockStatement) {
    node.body.forEach((statement) => {
      this.callHandler(statement);
      this.add(";");
      this.newLine();
    });
  }

  ReturnStatement(node: ReturnStatement) {
    this.add("return");
    if (node.argument) {
      this.add(" ");
      this.callHandler(node.argument);
    }
  }

  // ========== Entry Point ==========

  generate(node: AnyNode) {
    this.callHandler(node);
    return {
      code: this.code,
      map: this.generateSourceMap(),
    };
  }
}

export default function generate(node: any) {
  return new Generator().generate(node);
}
