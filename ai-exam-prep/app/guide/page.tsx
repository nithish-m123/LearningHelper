import Link from 'next/link'

export default function GuidePage() {
  return (
    <div className="flex flex-col min-h-screen p-6 sm:p-12 max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-center pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            User Guide <span className="text-clarity">Focal Engine</span>
          </h1>
          <p className="text-muted text-sm mt-1">Learn how to make the most of your study sessions</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 border border-border text-muted rounded-lg text-sm hover:border-clarity hover:text-foreground transition-colors"
        >
          Back to App
        </Link>
      </header>

      <main className="space-y-6">
        <section className="bg-surface rounded-xl p-6 border border-border space-y-4">
          <h2 className="text-xl font-bold text-clarity flex items-center gap-2">
            <span className="bg-clarity/10 text-clarity px-2.5 py-0.5 rounded text-sm">1</span>
            Upload Study Materials
          </h2>
          <p className="text-muted text-sm leading-relaxed">
            Drag & drop or select your university lecture slides (PPT, PPTX) or textbook materials (PDF). The Focal Engine runs an extraction pipeline (using LlamaParse) to convert text and embeds it locally using a tiny WASM vector model.
          </p>
        </section>

        <section className="bg-surface rounded-xl p-6 border border-border space-y-4">
          <h2 className="text-xl font-bold text-clarity flex items-center gap-2">
            <span className="bg-clarity/10 text-clarity px-2.5 py-0.5 rounded text-sm">2</span>
            Study Companion (Chat)
          </h2>
          <p className="text-muted text-sm leading-relaxed">
            Query your documents using the interactive chat. Answers are strictly grounded in your uploaded source materials. If a concept is missing, the system will fall back to an internet web search (via Tavily) to verify the explanation, presenting results with LaTeX math calculations and flowchart visualizations.
          </p>
        </section>

        <section className="bg-surface rounded-xl p-6 border border-border space-y-4">
          <h2 className="text-xl font-bold text-clarity flex items-center gap-2">
            <span className="bg-clarity/10 text-clarity px-2.5 py-0.5 rounded text-sm">3</span>
            Mock Exam Simulator
          </h2>
          <p className="text-muted text-sm leading-relaxed">
            Toggle the panel to active <strong>Mock Exam Simulator</strong>. Select the number of questions, and the engine will synthesize full university-level multiple choice questions from your slides. You will receive an immediate graded scorecard, line-by-line answer explanations, and weak-area study recommendations upon submission.
          </p>
        </section>

        <section className="bg-surface rounded-xl p-6 border border-border space-y-4">
          <h2 className="text-xl font-bold text-danger flex items-center gap-2">
            <span className="bg-danger/10 text-danger px-2.5 py-0.5 rounded text-sm">4</span>
            Cookie-Based Session Security
          </h2>
          <p className="text-muted text-sm leading-relaxed">
            This platform uses anonymous httpOnly UUID cookies. Your uploaded textbooks and RAG chat history are strictly isolated to your browser tab. <strong>Sessions self-destruct automatically after 24 hours</strong> via an hourly cron cleanup. You can manually purge your data instantly by clicking the "Clear Session" button in the library panel.
          </p>
        </section>
      </main>

      <footer className="text-center text-xs text-muted pt-6 border-t border-border">
        © 2026 AI Exam Prep Focal Engine. Built for college exam excellence.
      </footer>
    </div>
  )
}
