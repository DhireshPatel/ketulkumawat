/**
 * renderMarkdown.jsx
 * -----------------------------------------------------------------------
 * A small, dependency-free markdown renderer covering exactly what the
 * mock tutor responses use: headings, bold, inline code, fenced code
 * blocks, bullet/numbered lists, tables, horizontal rules, and
 * "math-ready" spans for $inline$ and $$block$$ LaTeX-style math.
 *
 * This keeps the component plug-and-play with zero extra npm installs.
 * If your project already uses `react-markdown` + `remark-gfm` (and
 * optionally `remark-math` / `rehype-katex` for real math typesetting),
 * you can swap the body of `renderMarkdown()` for a <ReactMarkdown>
 * call without touching ChatMessage.jsx — it only needs a component
 * back, not a specific renderer implementation.
 * -----------------------------------------------------------------------
 */

let keyCounter = 0;
const key = () => `md_${keyCounter++}`;

/** Inline-level formatting: bold, inline code, inline math. */
function renderInline(text) {
  const nodes = [];
  // Split on **bold**, `code`, and $math$ while keeping the delimiters.
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\$[^$]+\$)/g;
  const parts = text.split(pattern);

  parts.forEach((part) => {
    if (!part) return;
    if (part.startsWith('**') && part.endsWith('**')) {
      nodes.push(
        <strong key={key()} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    } else if (part.startsWith('`') && part.endsWith('`')) {
      nodes.push(<code key={key()}>{part.slice(1, -1)}</code>);
    } else if (part.startsWith('$') && part.endsWith('$')) {
      nodes.push(
        <span key={key()} className="italic font-mono text-[0.9em]">
          {part.slice(1, -1)}
        </span>
      );
    } else {
      nodes.push(part);
    }
  });

  return nodes;
}

function isTableRow(line) {
  return /^\s*\|.*\|\s*$/.test(line);
}

function isTableSeparator(line) {
  return /^\s*\|?[\s:|-]+\|?\s*$/.test(line) && line.includes('-');
}

function parseTable(lines, startIndex) {
  const headerCells = lines[startIndex]
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim());

  let i = startIndex + 2; // skip header + separator
  const rows = [];
  while (i < lines.length && isTableRow(lines[i])) {
    rows.push(
      lines[i]
        .trim()
        .replace(/^\||\|$/g, '')
        .split('|')
        .map((c) => c.trim())
    );
    i++;
  }

  const table = (
    <table key={key()}>
      <thead>
        <tr>
          {headerCells.map((cell) => (
            <th key={key()}>{renderInline(cell)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={key()}>
            {row.map((cell) => (
              <td key={key()}>{renderInline(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return { node: table, nextIndex: i };
}

/**
 * Parses a markdown string into an array of React nodes.
 */
export function renderMarkdown(source) {
  if (!source) return null;

  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;
  let listBuffer = [];
  let listType = null; // 'ul' | 'ol'

  const flushList = () => {
    if (listBuffer.length === 0) return;
    if (listType === 'ol') {
      blocks.push(
        <ol key={key()} className="list-decimal pl-5 space-y-1 my-2">
          {listBuffer.map((item) => (
            <li key={key()}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    } else {
      blocks.push(
        <ul key={key()} className="list-disc pl-5 space-y-1 my-2">
          {listBuffer.map((item) => (
            <li key={key()}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    }
    listBuffer = [];
    listType = null;
  };

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (/^\s*```/.test(line)) {
      flushList();
      const lang = line.trim().slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push(
        <pre key={key()}>
          <code data-lang={lang || undefined}>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // Block math $$...$$
    if (/^\s*\$\$/.test(line)) {
      flushList();
      const mathLines = [];
      let firstLine = line.trim().slice(2);
      if (firstLine.endsWith('$$')) {
        mathLines.push(firstLine.slice(0, -2));
        i++;
      } else {
        if (firstLine) mathLines.push(firstLine);
        i++;
        while (i < lines.length && !/\$\$\s*$/.test(lines[i])) {
          mathLines.push(lines[i]);
          i++;
        }
        if (i < lines.length) {
          mathLines.push(lines[i].replace(/\$\$\s*$/, ''));
          i++;
        }
      }
      blocks.push(
        <div
          key={key()}
          className="my-2 rounded-lg px-4 py-3 text-center italic font-mono text-[0.95em]"
          style={{ backgroundColor: 'var(--ai-bg-subtle)' }}
        >
          {mathLines.join(' ')}
        </div>
      );
      continue;
    }

    // Table
    if (isTableRow(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      flushList();
      const { node, nextIndex } = parseTable(lines, i);
      blocks.push(node);
      i = nextIndex;
      continue;
    }

    // Horizontal rule
    if (/^\s*---+\s*$/.test(line)) {
      flushList();
      blocks.push(<hr key={key()} className="my-3 border-t" style={{ borderColor: 'var(--ai-border-color)' }} />);
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const content = renderInline(headingMatch[2]);
      const sizes = {
        1: 'text-xl font-bold mt-3 mb-2',
        2: 'text-lg font-bold mt-3 mb-2',
        3: 'text-base font-semibold mt-2 mb-1',
        4: 'text-sm font-semibold mt-2 mb-1',
      };
      const Tag = `h${Math.min(level, 4)}`;
      blocks.push(
        <Tag key={key()} className={sizes[level]}>
          {content}
        </Tag>
      );
      i++;
      continue;
    }

    // Numbered list item
    const olMatch = line.match(/^\s*\d+\.\s+(.*)$/);
    if (olMatch) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      listBuffer.push(olMatch[1]);
      i++;
      continue;
    }

    // Bullet list item
    const ulMatch = line.match(/^\s*[-*]\s+(.*)$/);
    if (ulMatch) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      listBuffer.push(ulMatch[1]);
      i++;
      continue;
    }

    // Blank line
    if (line.trim() === '') {
      flushList();
      i++;
      continue;
    }

    // Regular paragraph
    flushList();
    blocks.push(
      <p key={key()} className="leading-relaxed">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  flushList();
  return blocks;
}
