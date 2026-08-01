# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Next.js 16, Tailwind CSS v4, Supabase (pgvector), Groq API, LlamaParse, Xenova/all-MiniLM-L6-v2 (WASM).

## Users
College students preparing for exams who need to transform course materials (PDF/PPT) into structured study aids (explanations, Q&A, mock exams) quickly and privately.

## Product Purpose
A zero-login, zero-cost AI study assistant that enables students to upload documents and get immediate, RAG-grounded academic support in an anonymous browser session. Success means the user feels prepared for their exam without needing an account or paying for a subscription.

## Positioning
An "auth-free" experience that prioritizes immediate utility and privacy over user retention. Unlike most AI tools, it requires no login and auto-deletes all session data after 24 hours.

## Operating Context
Students studying in high-pressure environments (libraries, dorms, cafes) using browsers. The product integrates into a study workflow: Upload $\rightarrow$ Learn $\rightarrow$ Test $\rightarrow$ Forget.

## Capabilities and Constraints
- **Capabilities:** PDF/PPT parsing, semantic search via pgvector, LLM-powered explanations, Mermaid/KaTeX visualizations, timed MCQ exams.
- **Constraints:** Must operate entirely within the free tiers of Groq, Supabase, LlamaParse, and Vercel. Data is strictly isolated by session ID and purged every 24h.

## Brand Commitments
- **Identity:** Minimalist, academic, efficient, and privacy-first.
- **Voice:** Supportive, clear, and technically precise.

## Evidence on Hand
- Project Plan (ProjectPlan.html)
- High-Level Design (HLD.html)
- Low-Level Design (LLD.html)
- Existing Next.js project structure in `/ai-exam-prep`

## Product Principles
1. **Immediate Utility:** No friction to start (zero login).
2. **Ephemerality by Design:** Privacy is guaranteed by the 24h auto-purge.
3. **Visual Learning:** Complex concepts must be supported by diagrams or math.
4. **Sustainable Zero-Cost:** All features must fit within cloud free-tiers.

## Accessibility & Inclusion
Standard web accessibility (WCAG) to ensure all students can use the study tools.
