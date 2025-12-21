import { cn } from "@/lib/utils";

interface RichTextProps {
  content: string;
  className?: string;
}

/**
 * RichText component that parses Markdown-style syntax and renders styled HTML.
 * Supports:
 * - **bold** text
 * - *italic* text
 * - ~~strikethrough~~ text
 * - `inline code`
 * - Bullet lists (- item or • item)
 * - Numbered lists (1. item)
 * - Blockquotes (> quote)
 * - Arrows (-> or →)
 * - Horizontal rules (---)
 * - Line breaks
 */
export const RichText = ({ content, className }: RichTextProps) => {
  const parseInlineFormatting = (text: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold: **text**
      const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
      if (boldMatch) {
        result.push(<strong key={key++} className="font-semibold">{parseInlineFormatting(boldMatch[1])}</strong>);
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // Italic: *text* (but not **)
      const italicMatch = remaining.match(/^\*([^*]+?)\*/);
      if (italicMatch) {
        result.push(<em key={key++} className="italic">{parseInlineFormatting(italicMatch[1])}</em>);
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // Strikethrough: ~~text~~
      const strikeMatch = remaining.match(/^~~(.+?)~~/);
      if (strikeMatch) {
        result.push(<del key={key++} className="line-through text-muted-foreground">{parseInlineFormatting(strikeMatch[1])}</del>);
        remaining = remaining.slice(strikeMatch[0].length);
        continue;
      }

      // Inline code: `code`
      const codeMatch = remaining.match(/^`([^`]+?)`/);
      if (codeMatch) {
        result.push(
          <code key={key++} className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // Arrow: -> or →
      const arrowMatch = remaining.match(/^(->|→)/);
      if (arrowMatch) {
        result.push(<span key={key++} className="text-primary font-medium mx-0.5">→</span>);
        remaining = remaining.slice(arrowMatch[0].length);
        continue;
      }

      // Regular character
      const nextSpecialIndex = remaining.slice(1).search(/(\*\*|\*|~~|`|->|→)/);
      if (nextSpecialIndex === -1) {
        result.push(remaining);
        break;
      } else {
        result.push(remaining.slice(0, nextSpecialIndex + 1));
        remaining = remaining.slice(nextSpecialIndex + 1);
      }
    }

    return result;
  };

  const parseContent = (text: string): React.ReactNode[] => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let key = 0;
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Empty line - add spacing
      if (trimmedLine === '') {
        i++;
        continue;
      }

      // Horizontal rule: ---
      if (trimmedLine === '---' || trimmedLine === '***' || trimmedLine === '___') {
        elements.push(<hr key={key++} className="my-3 border-border" />);
        i++;
        continue;
      }

      // Blockquote: > text
      if (trimmedLine.startsWith('> ')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('> ')) {
          quoteLines.push(lines[i].trim().slice(2));
          i++;
        }
        elements.push(
          <blockquote key={key++} className="border-l-2 border-primary/50 pl-3 my-2 text-muted-foreground italic">
            {quoteLines.map((ql, idx) => (
              <span key={idx}>
                {parseInlineFormatting(ql)}
                {idx < quoteLines.length - 1 && <br />}
              </span>
            ))}
          </blockquote>
        );
        continue;
      }

      // Unordered list: - item or • item
      if (trimmedLine.match(/^[-•]\s/)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].trim().match(/^[-•]\s/)) {
          listItems.push(lines[i].trim().slice(2));
          i++;
        }
        elements.push(
          <ul key={key++} className="list-none my-2 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary mt-1.5 text-xs">●</span>
                <span className="flex-1">{parseInlineFormatting(item)}</span>
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Ordered list: 1. item
      if (trimmedLine.match(/^\d+\.\s/)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
          listItems.push(lines[i].trim().replace(/^\d+\.\s/, ''));
          i++;
        }
        elements.push(
          <ol key={key++} className="my-2 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary font-medium min-w-[1.25rem]">{idx + 1}.</span>
                <span className="flex-1">{parseInlineFormatting(item)}</span>
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Regular paragraph
      const paragraphLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !lines[i].trim().startsWith('> ') &&
        !lines[i].trim().match(/^[-•]\s/) &&
        !lines[i].trim().match(/^\d+\.\s/) &&
        !['---', '***', '___'].includes(lines[i].trim())
      ) {
        paragraphLines.push(lines[i].trim());
        i++;
      }

      if (paragraphLines.length > 0) {
        elements.push(
          <p key={key++} className="my-1.5">
            {paragraphLines.map((pl, idx) => (
              <span key={idx}>
                {parseInlineFormatting(pl)}
                {idx < paragraphLines.length - 1 && ' '}
              </span>
            ))}
          </p>
        );
      }
    }

    return elements;
  };

  return (
    <div className={cn("rich-text", className)}>
      {parseContent(content)}
    </div>
  );
};
