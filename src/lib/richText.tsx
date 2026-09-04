import type { ReactNode } from 'react';

const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

// Splits `[label](url)` out of a plain-text line into real <a> elements;
// everything else stays as-is. The only "light markdown" this site supports.
function renderLine(line: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(line))) {
    if (match.index > last) nodes.push(line.slice(last, match.index));
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
    last = match.index + match[0].length;
  }
  if (last < line.length) nodes.push(line.slice(last));
  return nodes;
}

// Renders plain text as paragraphs (split on blank lines), with `[label](url)`
// turned into real links within each paragraph.
export function renderRichText(text: string): ReactNode {
  return text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((para, i) => <p key={i}>{renderLine(para, `p${i}`)}</p>);
}
