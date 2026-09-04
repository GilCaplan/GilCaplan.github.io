import type { ReactNode } from 'react';

// The only "light markdown" this site supports: [label](url) links and
// **bold** emphasis, applied left-to-right over one paragraph of plain text.
const TOKEN_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*/g;

function renderLine(line: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(line))) {
    if (match.index > last) nodes.push(line.slice(last, match.index));
    if (match[1] !== undefined) {
      nodes.push(
        <a
          key={`${keyPrefix}-${i++}`}
          href={match[2]}
          target="_blank"
          rel="noreferrer"
          className="link"
        >
          {match[1]}
        </a>,
      );
    } else {
      nodes.push(<strong key={`${keyPrefix}-${i++}`}>{match[3]}</strong>);
    }
    last = match.index + match[0].length;
  }
  if (last < line.length) nodes.push(line.slice(last));
  return nodes;
}

// Renders plain text as paragraphs (split on blank lines), applying the
// inline link/bold syntax above within each paragraph.
export function renderRichText(text: string): ReactNode {
  return text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((para, i) => <p key={i}>{renderLine(para, `p${i}`)}</p>);
}
