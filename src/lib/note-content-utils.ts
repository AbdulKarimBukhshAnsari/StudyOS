/**
 * Extract plain text from TipTap/ProseMirror JSON content for use in prompts.
 * Handles doc with content array; falls back to raw string.
 */
function extractTextFromNode(node: { type?: string; text?: string; content?: unknown[] }): string {
  if (node.text) return node.text;
  if (!Array.isArray(node.content)) return '';
  return node.content.map((child) => extractTextFromNode(child as typeof node)).join(' ');
}

export function noteContentToPlainText(content: string): string {
  if (!content || !content.trim()) return '';
  try {
    const parsed = JSON.parse(content) as { type?: string; content?: unknown[] };
    if (parsed?.type === 'doc' && Array.isArray(parsed.content)) {
      const text = parsed.content
        .map((node) => extractTextFromNode(node as { type?: string; text?: string; content?: unknown[] }))
        .join('\n\n')
        .trim();
      return text || content.slice(0, 15000);
    }
  } catch {
    // not JSON
  }
  return content.slice(0, 15000);
}
