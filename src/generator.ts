import { Program } from "acorn";
import { SourceMapGenerator } from "source-map";

class Generator {
  private code = "";
  private indentLevel = 0;

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

  // Node handlers
  Program(node: Program) {
    node.body.forEach((stmt) => {
      this[stmt.type](stmt);
      this.add(";");
      this.newLine();
    });
  }

  VariableDeclaration(node: any) {
    this.add(node.kind + " ");
    node.declarations.forEach((decl: any, i: number) => {
      if (i > 0) this.add(", ");
      this[decl.type](decl);
    });
  }

  VariableDeclarator(node: any) {
    this[node.id.type](node.id);
    if (node.init) {
      this.add(" = ");
      this[node.init.type](node.init);
    }
  }

  Identifier(node: any) {
    this.add(node.name);
  }

  StringLiteral(node: any) {
    this.add(`"${node.value}"`);
  }

  NumericLiteral(node: any) {
    this.add(String(node.value));
  }

  FunctionDeclaration(node: any) {
    this.add(`function ${node.id.name}(`);
    this.add(node.params.map((p: any) => p.name).join(", "));
    this.add(") {");
    this.indent();
    this[node.body.type](node.body);
    this.dedent();
    this.add("}");
  }

  ArrowFunctionExpression(node: any) {
    this.add("(");
    this.add(node.params.map((p: any) => p.name).join(", "));
    this.add(") => {");
    this.indent();
    this[node.body.type](node.body);
    this.dedent();
    this.add("}");
  }

  BlockStatement(node: any) {
    node.body.forEach((stmt: any) => {
      this[stmt.type](stmt);
      this.add(";");
      this.newLine();
    });
  }

  ReturnStatement(node: any) {
    this.add("return");
    if (node.argument) {
      this.add(" ");
      this[node.argument.type](node.argument);
    }
  }

  generate(node: any) {
    this[node.type](node);
    return {
      code: this.code,
      map: this.generateSourceMap(),
    };
  }
}

export default function generate(node: any) {
  return new Generator().generate(node);
}
