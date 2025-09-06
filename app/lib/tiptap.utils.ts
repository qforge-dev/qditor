import type { JSONContent } from "@tiptap/core";

export function getHeadingsFromJson(jsonContent: JSONContent) {
  const headings: JSONContent[] = [];

  traverseNodes(jsonContent.content, headings);

  return headings;
}

function traverseNodes(nodes: any, headings: JSONContent) {
  if (!nodes) {
    return;
  }

  for (const node of nodes) {
    if (node.type === "heading") {
      const headingText = node.content
        .map((textNode: any) => textNode.text)
        .join("");
      const headingLevel = node.attrs.level;
      headings.push({ text: headingText, level: headingLevel });
    }

    if (node.content) {
      traverseNodes(node.content, headings);
    }
  }
}
