import { marked } from "marked";
import * as React from "react";
import ReactMarkdown, { type Components, type ExtraProps } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "../utils/cn";
import { CodeBlock, InlineCode } from "./code-block";
import { parseIncompleteMarkdown } from "./parse-incomplete-markdown";
import { Response } from "./response";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableRow } from "./table";

type MarkdownComponentProps<T extends keyof Components> = React.ComponentProps<T> & ExtraProps;

type MarkdownBlockSource = {
  content: string;
  isCode: boolean;
};

function parseMarkdownIntoBlocks(markdown: string): MarkdownBlockSource[] {
  return marked.lexer(markdown).map((token) => ({
    content: token.raw,
    isCode: token.type === "code",
  }));
}

function replaceLatexDelimiters(markdown: string): string {
  return markdown
    .replace(/\\\\\[/g, "$$$$")
    .replace(/\\\\\]/g, "$$$$")
    .replace(/\\\\\(/g, "$$$$")
    .replace(/\\\\\)/g, "$$$$")
    .replace(/\\\[/g, "$$$$")
    .replace(/\\\]/g, "$$$$")
    .replace(/\\\(/g, "$$$$")
    .replace(/\\\)/g, "$$$$");
}

function isEscaped(markdown: string, index: number): boolean {
  let backslashes = 0;
  for (let cursor = index - 1; cursor >= 0 && markdown[cursor] === "\\"; cursor--) backslashes += 1;
  return backslashes % 2 === 1;
}

function getBacktickRunLength(markdown: string, index: number): number {
  let length = 0;
  while (markdown[index + length] === "`") length += 1;
  return length;
}

function transformLatex(markdown: string): string {
  let result = "";
  let cursor = 0;

  while (cursor < markdown.length) {
    let opening = markdown.indexOf("`", cursor);
    while (opening !== -1 && isEscaped(markdown, opening)) opening = markdown.indexOf("`", opening + 1);

    if (opening === -1) return result + replaceLatexDelimiters(markdown.slice(cursor));

    result += replaceLatexDelimiters(markdown.slice(cursor, opening));
    const delimiterLength = getBacktickRunLength(markdown, opening);
    let closing = opening + delimiterLength;

    while (closing < markdown.length) {
      closing = markdown.indexOf("`", closing);
      if (closing === -1) break;

      const runLength = getBacktickRunLength(markdown, closing);
      if (runLength === delimiterLength) break;
      closing += runLength;
    }

    if (closing === -1) return result + markdown.slice(opening);

    const end = closing + delimiterLength;
    result += markdown.slice(opening, end);
    cursor = end;
  }

  return result;
}

function transformIncorrectListFormat(markdown: string): string {
  return markdown.replace(/^( *)• /gm, "$1- ");
}

function MarkdownAnchor({ node: _node, className, ...props }: MarkdownComponentProps<"a">) {
  return (
    <a
      {...props}
      className={cn(
        "underline decoration-gray-a9 underline-offset-2 transition-colors hover:decoration-gray-a12 active:decoration-gray-a12",
        className,
      )}
    />
  );
}

function MarkdownSpan({ node: _node, className, ...props }: MarkdownComponentProps<"span">) {
  const value = Array.isArray(className) ? className.filter((item) => typeof item === "string").join(" ") : className;
  return <span {...props} className={typeof value === "string" && value ? value : undefined} />;
}

function MarkdownTable({ node: _node, className, ...props }: MarkdownComponentProps<"table">) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden">
      <Table className={className} {...(props as React.ComponentProps<typeof Table>)} />
    </div>
  );
}

const tableComponents: Components = {
  table: MarkdownTable,
  tbody: ({ node: _node, ...props }) => <TableBody {...props} />,
  tr: ({ node: _node, ...props }) => <TableRow {...props} />,
  th: ({ node: _node, ...props }) => <TableHead {...props} />,
  td: ({ node: _node, ...props }) => <TableCell {...props} />,
  tfoot: ({ node: _node, ...props }) => <TableFooter {...props} />,
  caption: ({ node: _node, ...props }) => <TableCaption {...props} />,
};

interface MarkdownBlockProps {
  content: string;
  isCode: boolean;
  isStreaming: boolean;
  syntaxHighlighting: boolean;
  onCopyCode?: (code: string) => void | Promise<void>;
  components?: Components;
}

const MarkdownBlock = React.memo(
  ({ content: rawContent, isCode, isStreaming, syntaxHighlighting, onCopyCode, components }: MarkdownBlockProps) => {
    let content = rawContent;
    if (!isCode) content = transformLatex(transformIncorrectListFormat(content));
    if (isStreaming) content = parseIncompleteMarkdown(content);

    const resolvedComponents = React.useMemo<Components>(
      () => ({
        pre: ({ node: _node, onCopy: _onCopy, ...props }) => <CodeBlock onCopy={onCopyCode} {...props} />,
        code: ({ node, children, ...props }) => {
          const isInline =
            typeof node?.position?.start.line !== "number" || node.position.start.line === node.position.end.line;
          return isInline ? <InlineCode {...props}>{children}</InlineCode> : children;
        },
        span: MarkdownSpan,
        a: MarkdownAnchor,
        ...tableComponents,
        ...components,
      }),
      [components, onCopyCode],
    );

    const rehypePlugins: NonNullable<React.ComponentProps<typeof ReactMarkdown>["rehypePlugins"]> = syntaxHighlighting
      ? [[rehypeKatex, { output: "mathml" }], [rehypeHighlight]]
      : [[rehypeKatex, { output: "mathml" }]];

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: false }]]}
        rehypePlugins={rehypePlugins}
        components={resolvedComponents}
      >
        {content}
      </ReactMarkdown>
    );
  },
);
MarkdownBlock.displayName = "MarkdownBlock";

interface MarkdownProps {
  children: string;
  isStreaming?: boolean;
  syntaxHighlighting?: boolean;
  onCopyCode?: (code: string) => void | Promise<void>;
  components?: Components;
  className?: string;
}

const Markdown = React.memo(
  ({ children, isStreaming = false, syntaxHighlighting = true, onCopyCode, components, className }: MarkdownProps) => {
    const blocks = parseMarkdownIntoBlocks(children);
    return (
      <Response data-slot="markdown" className={className}>
        {blocks.map((block, index) => (
          <MarkdownBlock
            key={index}
            content={block.content}
            isCode={block.isCode}
            isStreaming={isStreaming && index === blocks.length - 1}
            syntaxHighlighting={syntaxHighlighting}
            onCopyCode={onCopyCode}
            components={components}
          />
        ))}
      </Response>
    );
  },
);
Markdown.displayName = "Markdown";

export { Markdown, type MarkdownProps, type Components as MarkdownComponents };
