# Focal Engine - AI Exam Prep

Focal Engine is a zero-login, zero-cost, privacy-first AI study assistant. It empowers students to upload lecture materials (PDF, PPT, PPTX), query them through a RAG-grounded chat, and test their knowledge with an interactive, timed MCQ Mock Exam simulator.

## 🚀 Key Features

*   **Zero-Login Anonymous Workflow:** Start studying immediately with no account creation. Sessions are scoped by an anonymous browser session and automatically purged after 24 hours via database cron jobs.
*   **RAG-Grounded Chat:** Chat with your study materials. Answers are strictly grounded in your provided documents. If content is missing, the engine falls back to real-time internet search (Tavily AI) to fill the gaps.
*   **Structured Visualizations:** 
    *   **Mermaid.js:** Generates interactive process flow diagrams and charts directly from study material.
    *   **KaTeX:** Renders university-level LaTeX math formulas and equations inline perfectly.
*   **Mock Exam Simulator:** Generate dynamic, timed multiple-choice quizzes (MCQs) synthesized directly from your study materials with immediate scoring, detailed answer explanations, and weak-area analysis.
*   **Zero-Local-CPU Processing:** Built on a cloud-native architecture. All heavy lifting (PDF parsing, LLM generation, vector search) is delegated to cloud services, ensuring lightning-fast performance even on low-end devices.

---

## 🛠 Tech Stack

*   **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4
*   **Streaming:** Native Server-Sent Events (SSE) via `groq-sdk`
*   **RAG Engine:** Supabase pgvector, Xenova/Transformers.js (local 384-dim embeddings)
*   **LLM:** Groq API (`llama-3.3-70b-versatile`)
*   **PDF Extraction:** LlamaParse Cloud
*   **Visualization:** Mermaid.js, KaTeX, Tailwind Typography

---

## 📖 Setup Guide

Looking to run Focal Engine locally? See our comprehensive [Setup.md](./Setup.md) for step-by-step instructions.