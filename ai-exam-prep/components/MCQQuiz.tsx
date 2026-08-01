'use client'

import { useState, useEffect, useRef } from 'react'
import { logger } from '@/lib/logger'

interface MCQ {
  question: string
  options: [string, string, string, string]
  correctIndex: number
  explanation: string
}

interface MCQQuizProps {
  documentName: string | null
}

export default function MCQQuiz({ documentName }: MCQQuizProps) {
  const [questions, setQuestions] = useState<MCQ[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currIndex, setCurrIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [count, setCount] = useState(5) // default questions
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Start/Stop Timer
  useEffect(() => {
    if (questions.length > 0 && !isSubmitted) {
      logger.info('Starting quiz timer')
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        logger.info('Clearing quiz timer')
        clearInterval(timerRef.current)
      }
    }
  }, [questions.length, isSubmitted])

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60)
    const secs = totalSecs % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartQuiz = async () => {
    setIsGenerating(true)
    setError(null)
    setQuestions([])
    setUserAnswers({})
    setIsSubmitted(false)
    setElapsedSeconds(0)
    setCurrIndex(0)
    logger.info('Requesting quiz generation', { count, documentName })

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count, documentName }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate quiz')
      }

      setQuestions(data.questions)
      logger.info('Quiz generated successfully', { questionCount: data.questions.length })
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown quiz error'
      logger.error('Quiz start error', err)
      setError(errMsg)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = () => {
    logger.info('Submitting quiz results', { userAnswers, totalQuestions: questions.length })
    setIsSubmitted(true)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const handleReset = () => {
    logger.info('Resetting quiz state')
    setQuestions([])
    setUserAnswers({})
    setIsSubmitted(false)
    setElapsedSeconds(0)
    setCurrIndex(0)
    setError(null)
  }

  const handleOptionSelect = (qIdx: number, oIdx: number) => {
    if (isSubmitted) return
    logger.info('User selected option', { questionIndex: qIdx, optionSelected: oIdx })
    setUserAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))
  }

  const calculateScore = () => {
    let score = 0
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score++
      }
    })
    return score
  }

  // Render Section 1: Pre-Quiz Setup Configuration
  if (questions.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 flex flex-col justify-center items-center text-center space-y-6 min-h-[400px]">
        <div className="bg-clarity/10 border border-clarity/20 p-4 rounded-full">
          <svg className="w-10 h-10 text-clarity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <div className="max-w-md">
          <h2 className="text-xl font-bold mb-2">Generate Practice exam</h2>
          <p className="text-muted text-sm">
            Ready to test your knowledge? We'll analyze your active study materials and synthesize custom university-level multiple choice questions.
          </p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger rounded-lg p-3 text-xs w-full max-w-md">
            {error}
          </div>
        )}

        <div className="w-full max-w-xs space-y-4">
          <div className="flex flex-col text-left space-y-1">
            <label className="text-xs font-semibold text-muted">Number of questions</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              disabled={isGenerating}
              className="bg-[#0F172A] border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-clarity w-full"
            >
              <option value={3}>3 Questions (Express)</option>
              <option value={5}>5 Questions (Standard)</option>
              <option value={10}>10 Questions (Full exam)</option>
            </select>
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={isGenerating || !documentName}
            className="w-full py-3 bg-clarity text-[#0F172A] font-bold rounded-lg hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-[#0F172A] border-t-transparent rounded-full"></span>
                Generating Quiz...
              </span>
            ) : (
              'Start Exam'
            )}
          </button>
          {!documentName && (
            <p className="text-xs text-danger">⚠️ Please upload study slides or PDF files first.</p>
          )}
        </div>
      </div>
    )
  }

  // Render Section 2: Active Exam Page (Steppers)
  if (!isSubmitted) {
    const currentQuestion = questions[currIndex]
    const answeredCount = Object.keys(userAnswers).length

    return (
      <div className="bg-surface border border-border rounded-xl p-6 flex flex-col justify-between min-h-[500px]">
        {/* Header Info */}
        <div className="flex justify-between items-center pb-4 border-b border-border mb-6">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-clarity">Mock exam</span>
            <span className="text-xs bg-[#0F172A] px-2.5 py-1 rounded text-muted font-medium">
              Q: {currIndex + 1} of {questions.length} ({answeredCount} answered)
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-muted text-sm">
            <svg className="w-4 h-4 text-clarity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(elapsedSeconds)}
          </div>
        </div>

        {/* Stepper Question Navigation Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrIndex(idx)}
              className={`h-9 w-9 rounded-lg font-mono font-bold text-xs transition-all border ${
                currIndex === idx
                  ? 'bg-clarity border-clarity text-[#0F172A]'
                  : userAnswers[idx] !== undefined
                  ? 'bg-clarity/10 border-clarity/30 text-clarity'
                  : 'bg-[#0F172A] border-border text-muted hover:border-muted/50'
              }`}
            >
              {(idx + 1).toString().padStart(2, '0')}
            </button>
          ))}
        </div>

        {/* Question Text */}
        <div className="flex-1 space-y-6">
          <h3 className="text-md font-bold leading-relaxed">{currentQuestion.question}</h3>

          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, oIdx) => {
              const letter = String.fromCharCode(65 + oIdx) // A, B, C, D
              const isSelected = userAnswers[currIndex] === oIdx

              return (
                <button
                  key={oIdx}
                  onClick={() => handleOptionSelect(currIndex, oIdx)}
                  className={`flex items-center gap-4 text-left p-4 rounded-xl border text-sm transition-all ${
                    isSelected
                      ? 'bg-clarity/10 border-clarity text-foreground font-medium'
                      : 'bg-[#0F172A] border-border hover:border-border/80 text-muted'
                  }`}
                >
                  <span className={`h-6 w-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-clarity text-[#0F172A]' : 'bg-surface border border-border'
                  }`}>
                    {letter}
                  </span>
                  <span>{option}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
          <button
            onClick={() => setCurrIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currIndex === 0}
            className="px-4 py-2 border border-border text-muted rounded-lg text-sm hover:border-border/80 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {answeredCount === questions.length ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-danger text-foreground font-bold rounded-lg hover:brightness-110 active:scale-98 transition-all"
            >
              Submit &amp; Grade
            </button>
          ) : (
            <button
              onClick={() => setCurrIndex((prev) => Math.min(prev + 1, questions.length - 1))}
              disabled={currIndex === questions.length - 1}
              className="px-6 py-2 border border-clarity/50 text-clarity rounded-lg text-sm hover:bg-clarity/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>
      </div>
    )
  }

  // Render Section 3: Graded Results Page (Review and Analysis)
  const score = calculateScore()
  const percent = Math.round((score / questions.length) * 100)
  const isPassed = percent >= 60

  return (
    <div className="bg-surface border border-border rounded-xl p-6 space-y-8 max-h-[600px] overflow-y-auto">
      {/* Banner */}
      <div className={`p-6 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left ${
        isPassed
          ? 'bg-clarity/10 border-clarity/30 text-foreground'
          : 'bg-danger/10 border-danger/30 text-foreground'
      }`}>
        <div>
          <h2 className="text-xl font-extrabold">Exam Results</h2>
          <p className="text-sm text-muted mt-1">
            Time elapsed: <span className="font-mono">{formatTime(elapsedSeconds)}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-gradient font-black text-4xl">
            {score} / {questions.length}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            isPassed ? 'bg-clarity/20 text-clarity' : 'bg-danger/20 text-danger'
          }`}>
            {percent}% — {isPassed ? 'PASSED' : 'RETRY'}
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Question Review</h3>

        {questions.map((q, idx) => {
          const userSelection = userAnswers[idx]
          const isCorrect = userSelection === q.correctIndex

          return (
            <div key={idx} className="bg-[#0F172A] border border-border rounded-lg p-5 space-y-4">
              <div className="flex justify-between items-start gap-2">
                <h4 className="text-sm font-bold leading-relaxed">{idx + 1}. {q.question}</h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isCorrect ? 'bg-clarity/20 text-clarity' : 'bg-danger/20 text-danger'
                }`}>
                  {isCorrect ? 'CORRECT' : 'INCORRECT'}
                </span>
              </div>

              {/* Display Options review */}
              <div className="grid grid-cols-1 gap-2 text-xs">
                {q.options.map((opt, oIdx) => {
                  const letter = String.fromCharCode(65 + oIdx)
                  const wasSelected = userSelection === oIdx
                  const wasCorrect = q.correctIndex === oIdx

                  let optClass = 'border-border text-muted bg-surface/30'
                  if (wasSelected && !isCorrect) optClass = 'border-danger bg-danger/5 text-danger'
                  if (wasCorrect) optClass = 'border-clarity bg-clarity/5 text-clarity font-bold'

                  return (
                    <div key={oIdx} className={`p-2.5 rounded-lg border flex items-center gap-2 ${optClass}`}>
                      <span className={`h-5 w-5 rounded flex items-center justify-center font-bold text-[10px] ${
                        wasCorrect
                          ? 'bg-clarity text-[#0F172A]'
                          : wasSelected
                          ? 'bg-danger text-foreground'
                          : 'bg-surface border border-border'
                      }`}>
                        {letter}
                      </span>
                      <span>{opt}</span>
                    </div>
                  )
                })}
              </div>

              {/* Explanations block */}
              <div className="pt-2 border-t border-border/50 text-xs leading-relaxed text-muted bg-[#1E293B]/20 p-3 rounded-lg">
                <strong className="text-foreground">Explanation:</strong> {q.explanation}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recommendations & Weak Area Analysis */}
      {!isPassed && (
        <div className="bg-danger/5 border border-danger/10 rounded-lg p-4 text-xs space-y-2">
          <h4 className="font-bold text-danger">⚠️ Recommended actions</h4>
          <p className="text-muted leading-relaxed">
            Your results show some gaps. Review the specific questions marked INCORRECT above and use study cards to re-read the sections of the slide library referencing these concepts before attempting a retake.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleReset}
          className="px-6 py-2.5 bg-clarity text-[#0F172A] font-bold rounded-lg hover:brightness-110 active:scale-98 transition-all"
        >
          Retake / New Exam
        </button>
      </div>
    </div>
  )
}
