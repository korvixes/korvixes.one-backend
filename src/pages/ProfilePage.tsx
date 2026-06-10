import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Calendar, Clock, Key, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatDateTime(dateStr: string | undefined): string {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getProviderLabel(providerId: string | undefined): string {
  if (providerId === 'google.com') return 'Google'
  if (providerId === 'password') return 'Email / Password'
  return providerId ?? 'Unknown'
}

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  if (email && email.trim()) {
    return email.trim()[0].toUpperCase()
  }
  return 'A'
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const photoURL = user?.photoURL
  const displayName = user?.displayName
  const email = user?.email
  const providerId = user?.providerData?.[0]?.providerId
  const creationTime = user?.metadata?.creationTime
  const lastSignInTime = user?.metadata?.lastSignInTime

  return (
    <div className="page animate-in">
      <div className="page-header flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm btn-icon shrink-0">
            <ArrowLeft size={14} />
          </button>
          <div className="min-w-0">
            <h1 className="page-title truncate">My Profile</h1>
            <p className="page-subtitle">// Personal account and authentication details</p>
          </div>
        </div>
      </div>

      <div className="rg-profile-layout">
        {/* Avatar & summary card */}
        <div className="card p-6 text-center">
          {/* Avatar */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-cyan text-[26px] font-bold text-white shadow-[0_0_24px_rgba(42,107,219,0.3)] overflow-hidden">
            {photoURL ? (
              <img src={photoURL} alt="" className="h-full w-full object-cover" />
            ) : (
              getInitials(displayName, email)
            )}
          </div>

          <div className="text-[16px] font-semibold font-display text-ink-primary truncate">
            {displayName ?? 'User'}
          </div>
          <div className="mt-0.5 text-[12px] text-brand-cyan font-mono truncate">
            {email ?? 'No email'}
          </div>

          {/* Provider badge */}
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 rounded border border-line-mid bg-bg-raised px-2.5 py-1 text-[10px] font-mono text-ink-secondary">
              <Key size={11} />
              {getProviderLabel(providerId)}
            </span>
          </div>

          {/* Status */}
          <div className="mt-4 inline-flex items-center gap-1.5 rounded border border-ok/25 bg-ok/10 px-3 py-1 text-[10px] font-mono text-ok">
            <span className="h-1.5 w-1.5 rounded-full bg-ok shadow-[0_0_6px_rgba(76,195,138,0.7)]" />
            ACTIVE
          </div>

          {/* Metadata */}
          <div className="mt-5 space-y-3 border-t border-line pt-4 text-left">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted uppercase tracking-wider mb-1">
                <Calendar size={11} />
                Member since
              </div>
              <div className="text-[12px] text-ink-secondary">
                {formatDate(creationTime)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted uppercase tracking-wider mb-1">
                <Clock size={11} />
                Last sign in
              </div>
              <div className="text-[12px] text-ink-secondary">
                {formatDateTime(lastSignInTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Account details card */}
        <div className="card p-6">
          <div className="mb-5">
            <h3 className="text-[13px] font-semibold font-display text-ink-primary">
              Account Information
            </h3>
            <p className="text-[11px] text-ink-muted mt-0.5">
              Details retrieved from Firebase Authentication
            </p>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                <Shield size={11} />
                Full Name
              </label>
              <div className="input text-[13px] flex items-center text-ink-primary cursor-default">
                {displayName || (
                  <span className="text-ink-muted">Not provided</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                <Mail size={11} />
                Email Address
              </label>
              <div className="input text-[13px] flex items-center text-ink-primary cursor-default">
                {email || (
                  <span className="text-ink-muted">Not provided</span>
                )}
              </div>
            </div>

            {/* Auth Provider */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                <Key size={11} />
                Authentication Provider
              </label>
              <div className="input text-[13px] flex items-center text-ink-primary cursor-default">
                {getProviderLabel(providerId)}
              </div>
            </div>

            {/* User ID (read-only) */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                UID
              </label>
              <div className="input text-[12px] font-mono flex items-center text-ink-muted cursor-default select-all">
                {user?.uid || 'N/A'}
              </div>
            </div>

            {/* Created */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                <Calendar size={11} />
                Account Created
              </label>
              <div className="input text-[13px] flex items-center text-ink-primary cursor-default">
                {formatDateTime(creationTime)}
              </div>
            </div>

            {/* Last Sign-In */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                <Clock size={11} />
                Last Sign-In
              </label>
              <div className="input text-[13px] flex items-center text-ink-primary cursor-default">
                {formatDateTime(lastSignInTime)}
              </div>
            </div>
          </div>

          {/* Footer disclaimer */}
          <div className="mt-6 rounded-lg border border-line bg-bg-raised px-3.5 py-2.5">
            <p className="text-[10px] text-ink-muted font-mono leading-relaxed">
              Profile information is managed by your authentication provider.{' '}
              {providerId === 'google.com'
                ? 'Edit your name and photo in your Google account settings.'
                : 'Contact an administrator to update your account details.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
