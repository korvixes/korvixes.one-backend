import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Calendar, Clock, Key, Shield, Phone, MapPin, Save, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { updateProfile } from 'firebase/auth'
import { auth } from '../lib/firebase'

interface ProfileData {
  displayName: string
  phone: string
  address: string
}

const PROFILE_STORAGE_KEY = 'korvixes_profile'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function loadProfile(): ProfileData {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        displayName: typeof parsed.displayName === 'string' ? parsed.displayName : '',
        phone: typeof parsed.phone === 'string' ? parsed.phone : '',
        address: typeof parsed.address === 'string' ? parsed.address : '',
      }
    }
  } catch { /* ignore */ }
  return { displayName: '', phone: '', address: '' }
}

function saveProfile(data: ProfileData) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data))
}

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

type SaveStatus = 'idle' | 'saving' | 'success' | 'error'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [profile, setProfile] = useState<ProfileData>({ displayName: '', phone: '', address: '' })
  const [dirty, setDirty] = useState(false)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ProfileData, string>>>({})

  useEffect(() => {
    const stored = loadProfile()
    const fbName = user?.displayName ?? ''
    setProfile({
      displayName: stored.displayName || fbName,
      phone: stored.phone,
      address: stored.address,
    })
  }, [user])

  const photoURL = user?.photoURL
  const displayName = user?.displayName
  const email = user?.email
  const providerId = user?.providerData?.[0]?.providerId
  const creationTime = user?.metadata?.creationTime
  const lastSignInTime = user?.metadata?.lastSignInTime

  const handleFieldChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    setDirty(true)
    setStatus('idle')
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = (): boolean => {
    const errors: Partial<Record<keyof ProfileData, string>> = {}

    const name = profile.displayName.trim()
    if (!name) {
      errors.displayName = 'Display name is required'
    } else if (name.length < 2) {
      errors.displayName = 'Name must be at least 2 characters'
    } else if (name.length > 100) {
      errors.displayName = 'Name must be under 100 characters'
    }

    if (profile.phone && !/^[\d\s\-+()]{7,20}$/.test(profile.phone.trim())) {
      errors.phone = 'Enter a valid phone number (7-20 digits)'
    }

    if (profile.address && profile.address.trim().length > 200) {
      errors.address = 'Address must be under 200 characters'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    setStatus('saving')
    setErrorMsg('')

    try {
      const trimmed: ProfileData = {
        displayName: profile.displayName.trim(),
        phone: profile.phone.trim(),
        address: profile.address.trim(),
      }

      // Try to update Firebase displayName
      if (auth?.currentUser) {
        try {
          await updateProfile(auth.currentUser, { displayName: trimmed.displayName })
        } catch { /* Firebase may fail; localStorage is our primary store */ }
      }

      saveProfile(trimmed)
      setDirty(false)
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err?.message || 'Failed to save profile')
    }
  }

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

      {/* Status alerts */}
      {status === 'success' && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-ok/30 bg-ok/10 px-4 py-3 text-[13px] text-ok">
          <CheckCircle2 size={16} />
          Profile updated successfully
        </div>
      )}
      {status === 'error' && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-bad/30 bg-bad/10 px-4 py-3 text-[13px] text-bad">
          <XCircle size={16} />
          {errorMsg || 'Failed to save profile. Please try again.'}
        </div>
      )}

      <div className="rg-profile-layout">
        {/* Avatar & summary card */}
        <div className="card p-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-cyan text-[26px] font-bold text-white shadow-[0_0_24px_rgba(42,107,219,0.3)] overflow-hidden">
            {photoURL ? (
              <img src={photoURL} alt="" className="h-full w-full object-cover" />
            ) : (
              getInitials(profile.displayName || displayName, email)
            )}
          </div>

          <div className="text-[16px] font-semibold font-display text-ink-primary truncate">
            {profile.displayName || displayName || 'User'}
          </div>
          <div className="mt-0.5 text-[12px] text-brand-cyan font-mono truncate">
            {email ?? 'No email'}
          </div>

          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 rounded border border-line-mid bg-bg-raised px-2.5 py-1 text-[10px] font-mono text-ink-secondary">
              <Key size={11} />
              {getProviderLabel(providerId)}
            </span>
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded border border-ok/25 bg-ok/10 px-3 py-1 text-[10px] font-mono text-ok">
            <span className="h-1.5 w-1.5 rounded-full bg-ok shadow-[0_0_6px_rgba(76,195,138,0.7)]" />
            ACTIVE
          </div>

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

        {/* Editable profile form */}
        <div className="card p-6">
          <div className="mb-5">
            <h3 className="text-[13px] font-semibold font-display text-ink-primary">
              Account Information
            </h3>
            <p className="text-[11px] text-ink-muted mt-0.5">
              Edit your profile details below
            </p>
          </div>

          <div className="space-y-4">
            {/* Display Name */}
            <div>
              <label htmlFor="profile-name" className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                <Shield size={11} />
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                className={`input text-[13px] ${fieldErrors.displayName ? 'border-bad/50' : ''}`}
                value={profile.displayName}
                onChange={e => handleFieldChange('displayName', e.target.value)}
                placeholder="Enter your full name"
                maxLength={100}
              />
              {fieldErrors.displayName && (
                <p className="mt-1 text-[11px] text-bad">{fieldErrors.displayName}</p>
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                <Mail size={11} />
                Email Address
              </label>
              <div className="input text-[13px] flex items-center text-ink-muted cursor-default">
                {email || 'Not provided'}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="profile-phone" className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                <Phone size={11} />
                Phone Number
              </label>
              <input
                id="profile-phone"
                type="tel"
                className={`input text-[13px] ${fieldErrors.phone ? 'border-bad/50' : ''}`}
                value={profile.phone}
                onChange={e => handleFieldChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-[11px] text-bad">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="profile-address" className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                <MapPin size={11} />
                Address
              </label>
              <textarea
                id="profile-address"
                className={`input text-[13px] resize-none ${fieldErrors.address ? 'border-bad/50' : ''}`}
                value={profile.address}
                onChange={e => handleFieldChange('address', e.target.value)}
                placeholder="Enter your address"
                rows={2}
                maxLength={200}
              />
              {fieldErrors.address && (
                <p className="mt-1 text-[11px] text-bad">{fieldErrors.address}</p>
              )}
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

            {/* UID */}
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

          {/* Update button */}
          <div className="mt-6 flex items-center gap-3">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={status === 'saving'}
            >
              {status === 'saving' ? (
                <><Loader2 size={13} className="animate-spin" /> Saving…</>
              ) : (
                <><Save size={13} /> Update Profile</>
              )}
            </button>
            {dirty && status === 'idle' && (
              <span className="text-[11px] text-ink-muted font-mono">Unsaved changes</span>
            )}
            {status === 'success' && (
              <span className="text-[11px] text-ok font-mono flex items-center gap-1">
                <CheckCircle2 size={12} /> Saved
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
