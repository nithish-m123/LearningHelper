# Setup Guide

Follow these steps to run Focal Engine locally.

## Prerequisites

- Node.js (v20+)
- Git
- A [Supabase](https://supabase.com/) account
- A [Groq](https://console.groq.com/) API key
- A [LlamaCloud](https://cloud.llamaindex.ai/) API key

## Step-by-Step Setup

### 1. Clone the repository
```bash
git clone https://github.com/nithish-m123/LearningHelper.git
cd LearningHelper
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```
Fill in the following details in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
- `GROQ_API_KEY`: Your Groq API Key (get it from Groq console).
- `LLAMA_CLOUD_API_KEY`: Your LlamaCloud API Key (for PDF extraction).

### 4. Supabase Setup
- Go to the Supabase project **SQL Editor**.
- Run the schema provided in the `ImplementationStatus.html` or LLD documents to create the `document_chunks` table, `visitor_analytics` table, `match_chunks` function, and `cleanup-old-sessions` cron job.

### 5. Start Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to see Focal Engine in action.
