import type { AnyNode } from "acorn";
import astDefinitions from "./ast-map";

type VisitorFunction = (node: AnyNode) => void;

interface Visitor {
  enter?: VisitorFunction;
  exit?: VisitorFunction;
}

type Visitors = {
  enter?: VisitorFunction;
  exit?: VisitorFunction;

  [key: string]: Visitor | VisitorFunction | undefined;
};

function traverse(node: AnyNode, visitors: Visitors) {
  function visit(node: AnyNode) {
    let visitor = visitors[node.type];

    if (typeof visitor === "function") {
      visitor = { enter: visitor };
    }

    visitors?.enter && visitors.enter(node);
    visitor?.enter && visitor.enter(node);

    const astDefinition = astDefinitions.get(node.type);
    if (!astDefinition) return;

    astDefinition.visitor.forEach((prop) => {
      const nodeValue = (node as Record<string, any>)[prop];

      if (Array.isArray(nodeValue)) {
        nodeValue.forEach((child, i) => {
          if (child) visit(child);
        });
      } else if (nodeValue && typeof nodeValue === "object") {
        visit(nodeValue);
      }
    });

    visitors?.exit && visitors.exit(node);
    visitor?.exit && visitor.exit(node);
  }

  visit(node);
}
export default traverse;
