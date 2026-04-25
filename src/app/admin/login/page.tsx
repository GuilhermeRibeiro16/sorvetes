'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin() {
    setError(null)
    setLoading(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Email ou senha incorretos')
      setLoading(false)
      return
    }

    router.push('/admin/orders')
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
            🍦 Admin
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Acesso restrito
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@email.com"
            className="w-full px-4 py-3 rounded-xl outline-none text-sm"
            style={{
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl outline-none text-sm"
            style={{
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {error && (
          <p
            className="text-sm text-center py-2 px-4 rounded-xl"
            style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
          style={{
            backgroundColor: 'var(--color-primary)',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </button>
      </div>
    </div>
  )
}