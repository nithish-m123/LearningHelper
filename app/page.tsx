"use client"

import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'
import Link from 'next/link'
import ChatPanel from '@/components/ChatPanel'
import MCQQuiz from '@/components/MCQQuiz'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'exam'>('chat')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  // ponytail: trigger visitor analytics on first load
  useEffect(() => {
    fetch('/api/session', { method: 'POST' })
      .catch(err => logger.error('Analytics ping failed', err))
  }, [])

  const handleClearSession = async () => {
    try {
      const res = await fetch('/api/session/delete', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to delete session')
      setUploadedFiles([])
      setSuccess('Session cleared successfully')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setSuccess(`Success! Extracted ${data.chunks} chunks from ${data.document}`)
      setUploadedFiles(prev => [...new Set([...prev, data.document])])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-6 sm:p-12 max-w-7xl mx-auto">
      {/* Top Navigation / Brand */}
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            AI Exam Prep <span className="text-clarity">Focal Engine</span>
          </h1>
          <p className="text-muted text-sm mt-1">Study materials RAG search & mock testing</p>
        </div>
        <div className="flex gap-2">
            <Link
              href="/guide"
              className="px-4 py-2 border border-border text-muted rounded-lg text-sm hover:border-clarity hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              Guide
            </Link>
        {uploadedFiles.length > 0 && (
          <>
            <button
              onClick={handleClearSession}
              className="px-4 py-2 border border-danger/50 text-danger rounded-lg text-sm hover:bg-danger/10 transition-colors"
            >
              Clear Session
            </button>
            <div className="bg-surface border border-border px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-clarity animate-pulse"></span>
              <span className="text-muted">Ingested:</span>
              <span className="font-semibold text-foreground">{uploadedFiles.length} File(s)</span>
            </div>
          </>
        )}
        </div>
      </header>

      {/* Main Two-Column Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Side: Interactive Panel (Study Chat or Exam Mode) */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex bg-surface border border-border rounded-xl p-1 mb-4">
              <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'chat' ? 'bg-clarity text-[#0F172A]' : 'text-muted'}`}>
                Study Companion
              </button>
              <button
                  onClick={() => setActiveTab('exam')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'exam' ? 'bg-clarity text-[#0F172A]' : 'text-muted'}`}>
                Mock Exam Simulator
              </button>
          </div>

          {activeTab === 'chat' && <ChatPanel documentName={uploadedFiles[0] || null} />}
          {activeTab === 'exam' && <MCQQuiz documentName={uploadedFiles[0] || null} />}
        </section>

        {/* Right Side: Upload & Management Panel */}
        <aside className="lg:col-span-4 space-y-6">

          {/* Ingestion Panel */}
          <div className="bg-surface rounded-xl p-6 border border-border">
            <h2 className="text-lg font-semibold mb-2 text-foreground">Materials Upload</h2>
            <p className="text-muted text-xs mb-4">Feed PDFs or PPTX lecture slides into your Vector Database.</p>

            <div className="relative group cursor-pointer">
              <input
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={handleUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              />
              <div className={`
                border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
                ${isUploading ? 'border-clarity bg-clarity/5' : 'border-border group-hover:border-clarity group-hover:bg-clarity/5'}
              `}>
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clarity mb-2"></div>
                    <p className="text-clarity text-sm font-medium">Processing...</p>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-8 w-8 text-clarity mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-sm font-medium text-foreground">Upload file</p>
                    <p className="text-muted text-xs mt-1">PDF or PPT / PPTX</p>
                  </>
                )}
              </div>
            </div>

            {/* Error notifications */}
            {error && (
              <div className="mt-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-xs">
                {error}
              </div>
            )}

            {/* Success notifications */}
            {success && (
              <div className="mt-4 p-3 bg-clarity/10 border border-clarity/20 rounded-lg text-clarity text-xs">
                {success}
              </div>
            )}
          </div>

          {/* List of active materials */}
          {uploadedFiles.length > 0 && (
            <div className="bg-surface rounded-xl p-6 border border-border">
              <h3 className="text-sm font-semibold mb-3 text-muted uppercase tracking-wider">Active Library</h3>
              <ul className="space-y-2">
                {uploadedFiles.map((file, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-foreground bg-background/50 border border-border/50 px-3 py-2 rounded-lg truncate">
                    <svg className="h-4 w-4 text-clarity flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="truncate">{file}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </aside>

      </div>
    </div>
  )
}
