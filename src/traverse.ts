import type { AnyNode } from "acorn";
import astDefinitions from "./ast-map";

type VisitorFunction<T extends AnyNode = AnyNode> = (node: T) => void;

interface Visitor {
  enter?: VisitorFunction;
  exit?: VisitorFunction;
}

export interface Visitors extends Visitor {
  [nodeType: string]: Visitor | VisitorFunction | undefined;
}

function getNodeField<T>(node: AnyNode, field: string): T | undefined {
  return (node as any)[field];
}

function traverse(node: AnyNode, visitors: Visitors) {
  function visit(currentNode: AnyNode) {
    // Get the node-specific visitor if defined
    let specificVisitor = visitors[currentNode.type];

    // Normalize function-style visitor to { enter }
    if (typeof specificVisitor === "function") {
      specificVisitor = { enter: specificVisitor };
    }

    // === ENTER HOOKS ===
    visitors.enter?.(currentNode);
    specificVisitor?.enter?.(currentNode);

    const astDefinition = astDefinitions.get(currentNode.type);
    if (astDefinition) {
      for (const property of astDefinition.visitor) {
        const nodeValue = getNodeField<AnyNode | AnyNode[]>(
          currentNode,
          property
        );

        if (Array.isArray(nodeValue)) {
          for (const child of nodeValue) {
            if (child && typeof child.type === "string") {
              visit(child);
            }
          }
        } else if (nodeValue && typeof nodeValue.type === "string") {
          visit(nodeValue);
        }
      }
    }

    // === EXIT HOOKS ===
    specificVisitor?.exit?.(currentNode);
    visitors.exit?.(currentNode);
  }

  visit(node);
}
export default traverse;
