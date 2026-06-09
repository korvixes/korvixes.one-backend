import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Two-way sync a tab state with the last URL segment under `base`.
 * - On mount / route change, if the last segment matches a valid tab, activate it.
 * - When the consumer calls setTab(), the URL is updated to match (no history spam).
 */
export function useRouteTab<T extends string>(base: string, tabs: readonly T[], fallback: T) {
  const location = useLocation()
  const navigate = useNavigate()

  const fromUrl = (): T => {
    const tail = location.pathname.replace(/\/+$/, '').slice(base.length).replace(/^\/+/, '').split('/')[0]
    return (tabs as readonly string[]).includes(tail) ? (tail as T) : fallback
  }

  const [tab, setTabState] = useState<T>(fromUrl)

  useEffect(() => {
    const next = fromUrl()
    if (next !== tab) setTabState(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const setTab = (next: T) => {
    setTabState(next)
    const target = next === fallback && !location.pathname.includes('/' + next) ? base : `${base}/${next}`
    if (location.pathname !== target) navigate(target, { replace: true })
  }

  return [tab, setTab] as const
}
