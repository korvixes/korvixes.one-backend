import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Chrome, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import logoSrc from '../assets/logo-header.webp'

export default function SignupPage() {
  const { user, loading, error, authLoading, signUpWithEmail, signInWithGoogle, clearError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

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

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setValidationError(null)
    clearError()

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) return

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.')
      return
    }

    await signUpWithEmail(email.trim(), password)
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch {
      // Error is already set in context
    }
  }

  const displayError = validationError || error

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
            <div className="mx-auto mb-3 flex items-center justify-center">
              <img
                src={logoSrc}
                alt="Korvixes"
                className="h-12 sm:h-[52px] max-w-[160px] sm:max-w-[180px] object-contain"
              />
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-display text-ink-primary tracking-tight">
              Create Account
            </h1>
            <p className="mt-1 text-[12px] text-ink-muted">
              Korvixes Platform
            </p>
          </div>

          {/* Error */}
          {displayError && (
            <div className="mb-4 rounded-lg border border-bad/30 bg-bad/10 px-3.5 py-2.5">
              <p className="text-[12px] text-bad leading-snug">{displayError}</p>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            <div>
              <label className="mb-1.5 block text-[11px] font-mono text-ink-muted uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); setValidationError(null) }}
                placeholder="you@korvixes.io"
                required
                disabled={authLoading}
                className="input text-[13px]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-mono text-ink-muted uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); setValidationError(null) }}
                  placeholder="Min. 6 characters"
                  required
                  disabled={authLoading}
                  className="input text-[13px] pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-secondary"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-mono text-ink-muted uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearError(); setValidationError(null) }}
                  placeholder="Repeat password"
                  required
                  disabled={authLoading}
                  className="input text-[13px] pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-secondary"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading || !email.trim() || !password.trim() || !confirmPassword.trim()}
              className="btn btn-primary w-full justify-center text-[13px] py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          {/* Google Sign-Up */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={authLoading}
            className="group relative flex w-full items-center justify-center gap-3 rounded-lg border border-line bg-bg-raised px-4 py-2.5 text-[13px] font-medium text-ink-primary transition-all hover:border-brand-blue/40 hover:bg-bg-raised hover:shadow-[0_0_20px_rgba(42,107,219,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              className="absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(42,107,219,0.08), rgba(59,196,232,0.06))',
              }}
            />
            <Chrome size={18} className="text-ink-secondary group-hover:text-brand-blue transition-colors shrink-0" />
            <span className="relative">Sign up with Google</span>
          </button>

          {/* Already have an account */}
          <p className="mt-5 text-center text-[12px] text-ink-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-cyan hover:text-brand-blue transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-[10px] text-ink-muted/60 font-mono">
          Korvixes Admin — v1.0.0
        </p>
      </div>
    </div>
  )
}
