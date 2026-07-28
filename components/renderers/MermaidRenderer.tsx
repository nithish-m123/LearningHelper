'use client'
import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

// ponytail: initializes mermaid. SOLID: Single Responsibility (render diagrams only)
mermaid.initialize({ startOnLoad: true, theme: 'dark' })

export default function MermaidRenderer({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
        // dynamically render the diagram
        mermaid.render('mermaid-' + Date.now(), code).then(res => {
            if (ref.current) ref.current.innerHTML = res.svg
        })
    }
  }, [code])

  return <div ref={ref} className="bg-surface p-4 rounded-xl my-4 text-center" />
}
