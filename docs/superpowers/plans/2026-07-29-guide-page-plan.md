# Guide Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a dedicated `/guide` route detailing step-by-step instructions on how the application works, linked via a button in the home page header.

**Architecture:** Use App Router file-based routing (`app/guide/page.tsx`). Follow SOLID principles and reuse existing design tokens/typography styles in Tailwind CSS v4.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4, React 19

## Global Constraints
- Target route: `app/guide/page.tsx`
- Tailwind classes: prose, prose-sm, gap-tightening overrides.
- Commits: Commit each task cleanly.

---

### Task 1: Update HLD, LLD, Implementation and Status Documentation

**Files:**
- Modify: `HLD.html`
- Modify: `LLD.html`
- Modify: `Implementation.html`
- Modify: `ImplementationStatus.html`

- [ ] **Step 1: Edit `HLD.html` to add `/guide` route description**
- [ ] **Step 2: Edit `LLD.html` to update page routing structure in Section 1 and API contracts in Section 4**
- [ ] **Step 3: Edit `Implementation.html` to add Guide Page Phase 9**
- [ ] **Step 4: Edit `ImplementationStatus.html` to record Phase 9 as In Progress**
- [ ] **Step 5: Verify build works**
- [ ] **Step 6: Commit changes**

---

### Task 2: Create a Dedicated `/guide` Route Page

**Files:**
- Create: `app/guide/page.tsx`

**Interfaces:**
- Produces: Exported default React component `GuidePage()` yielding a clean, structured guide UI.

- [ ] **Step 1: Write `app/guide/page.tsx` component**
```tsx
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
```
- [ ] **Step 2: Verify compiling of `app/guide/page.tsx`**
- [ ] **Step 3: Commit changes**

---

### Task 3: Add Guide Button Link on Home page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Import Link helper in `app/page.tsx`**
- [ ] **Step 2: Render a "User Guide" button in the header nav**
```tsx
            <Link
              href="/guide"
              className="px-4 py-2 border border-border text-muted rounded-lg text-sm hover:border-clarity hover:text-foreground transition-colors mr-2 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-clarity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Guide
            </Link>
```
- [ ] **Step 3: Verify compiling and link functionality**
- [ ] **Step 4: Commit changes**
- [ ] **Step 5: Push everything to Origin branch**
