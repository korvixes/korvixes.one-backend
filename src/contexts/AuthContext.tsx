import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type User,
} from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'

interface AuthContextValue {
  user: User | null
  loading: boolean
  authLoading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pendingRef = useRef(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    if (pendingRef.current) return
    pendingRef.current = true
    setError(null)
    setAuthLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err: any) {
      const code = err?.code
      if (code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site.')
      } else if (code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.')
      } else if (code === 'auth/cancelled-popup-request') {
        return
      } else if (code === 'auth/api-key-not-valid-please-pass-a-valid-api-key') {
        setError(
          'Firebase API key is not valid. ' +
          'Ensure the Identity Toolkit API is enabled in your Google Cloud project ' +
          'and the API key is unrestricted or allowed for this app.'
        )
      } else {
        setError(err?.message || 'Google sign-in failed. Please try again.')
      }
      throw err
    } finally {
      setAuthLoading(false)
      pendingRef.current = false
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    if (pendingRef.current) return
    pendingRef.current = true
    setError(null)
    setAuthLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      const code = err?.code
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        setError('Invalid email or password.')
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
      } else {
        setError(err?.message || 'Sign-in failed. Please try again.')
      }
      throw err
    } finally {
      setAuthLoading(false)
      pendingRef.current = false
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    if (pendingRef.current) return
    pendingRef.current = true
    setError(null)
    setAuthLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      const code = err?.code
      if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.')
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.')
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
      } else {
        setError(err?.message || 'Sign-up failed. Please try again.')
      }
      throw err
    } finally {
      setAuthLoading(false)
      pendingRef.current = false
    }
  }

  const sendPasswordReset = async (email: string) => {
    if (pendingRef.current) return
    pendingRef.current = true
    setError(null)
    setAuthLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (err: any) {
      const code = err?.code
      if (code === 'auth/user-not-found') {
        setError('No account found with this email address.')
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
      } else {
        setError(err?.message || 'Failed to send reset email. Please try again.')
      }
      throw err
    } finally {
      setAuthLoading(false)
      pendingRef.current = false
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err: any) {
      setError(err?.message || 'Sign out failed.')
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{ user, loading, authLoading, error, signInWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordReset, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
