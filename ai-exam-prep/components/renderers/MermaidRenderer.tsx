'use client'
import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

// ponytail: initializes mermaid. SOLID: Single Responsibility (render diagrams only)
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark'
})

export default function MermaidRenderer({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isCancelled = false

    const renderDiagram = async () => {
      if (!ref.current || !code.trim()) return

      try {
        // By NOT passing suppressErrors, parse() will throw on syntax errors,
        // which immediately runs our catch block and prevents rendering a broken/partial diagram.
        await mermaid.parse(code)

        const res = await mermaid.render('mermaid-' + Date.now(), code)
        if (!isCancelled && ref.current) {
          ref.current.innerHTML = res.svg
        }
      } catch (err) {
        // During streaming, incomplete syntax will throw. We catch and ignore it.
        // The previously rendered valid diagram (if any) or nothing will remain.

        // Mermaid may sometimes auto-inject an error element to the body depending on setup,
        // so we make sure our own div doesn't show the error SVG text string if it was returned.
      }
    }

    renderDiagram()

    return () => {
      isCancelled = true
    }
  }, [code])

  return <div ref={ref} className="bg-surface p-4 rounded-xl my-4 text-center" />
}
