import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import MermaidRenderer from './MermaidRenderer'

// ponytail: Markdown renderer (Strategy Pattern: code blocks routed to specialised components)
// Fix: Use 'node' and 'ref' destructuring correctly for v9 compatibility
export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            if (match && match[1] === 'mermaid') {
              return <MermaidRenderer code={String(children).replace(/\n$/, '')} />
            }
            // Strip out react-markdown specific internal props that cause validation errors
            const { node, ...restProps } = props
            return <code className={className} {...restProps}>{children}</code>
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
