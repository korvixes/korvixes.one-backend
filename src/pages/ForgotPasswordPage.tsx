import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { user, loading, error, authLoading, sendPasswordReset, clearError } = useAuth()

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-base">
        <Loader2 size={24} className="animate-spin text-brand-cyan" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()

    const trimmed = email.trim()
    if (!trimmed) return
    if (!EMAIL_REGEX.test(trimmed)) {
      return
    }

    try {
      await sendPasswordReset(trimmed)
      setSent(true)
      setCountdown(3)
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer)
            navigate('/login', { replace: true })
            return 0
          }
          return c - 1
        })
      }, 1000)
    } catch {
      // Error is set in context
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg-base overflow-hidden">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,196,232,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,196,232,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow orbs */}
      <div className="pointer-events-none absolute -left-48 sm:-left-32 top-1/4 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-brand-blue/10 blur-[80px] sm:blur-[120px]" />
      <div className="pointer-events-none absolute -right-48 sm:-right-32 bottom-1/4 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-brand-cyan/8 blur-[80px] sm:blur-[100px]" />

      <div className="relative z-10 w-full max-w-sm px-3 sm:px-4 animate-fade-in">
        <div className="rounded-xl border border-line bg-bg-surface p-6 sm:p-8 shadow-card">
          {/* Logo / Brand */}
          <div className="mb-6 sm:mb-8 text-center">
            <img
              src="/logo-header.webp"
              alt="Korvixes"
              className="mx-auto h-12 sm:h-[52px] max-w-[160px] sm:max-w-[180px] object-contain"
            />
            <h1 className="mt-3 text-lg sm:text-xl font-bold font-display text-ink-primary tracking-tight">
              Reset Password
            </h1>
            <p className="mt-1 text-[12px] text-ink-muted">
              Enter your email to receive a reset link
            </p>
          </div>

          {/* Success state */}
          {sent ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ok/15">
                <CheckCircle2 size={24} className="text-ok" />
              </div>
              <p className="text-[13px] text-ink-primary font-medium">
                Password reset email sent successfully
              </p>
              <p className="mt-1.5 text-[11px] text-ink-muted">
                Redirecting to login in {countdown}s…
              </p>
              <button
                onClick={() => navigate('/login')}
                className="mt-4 text-[12px] text-brand-cyan hover:text-brand-blue transition-colors font-medium"
              >
                Back to login
              </button>
            </div>
          ) : (
            <>
              {/* Error */}
              {error && (
                <div className="mb-4 rounded-lg border border-bad/30 bg-bad/10 px-3.5 py-2.5">
                  <p className="text-[12px] text-bad leading-snug">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-mono text-ink-muted uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError() }}
                    placeholder="admin@korvixes.io"
                    required
                    disabled={authLoading}
                    className="input text-[13px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading || !email.trim() || !EMAIL_REGEX.test(email.trim())}
                  className="btn btn-primary w-full justify-center text-[13px] py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              {/* Back to login */}
              <div className="mt-5 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-[12px] text-ink-muted hover:text-ink-secondary transition-colors"
                >
                  <ChevronLeft size={13} />
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-[10px] text-ink-muted/60 font-mono">
          Korvixes Admin — v1.0.0
        </p>
      </div>
    </div>
  )
}
