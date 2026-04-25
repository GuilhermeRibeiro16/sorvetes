'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Category, Product } from '@/types'
import { upsertProduct } from '@/lib/actions/admin'

type ProductFormProps = {
  categories: Category[]
  product?: Product
  onClose?: () => void
}

export function ProductForm({ categories, product, onClose }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(!!product)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    if (product) formData.set('id', product.id)

    const result = await upsertProduct(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setLoading(false)
    if (onClose) {
      onClose()
    } else {
      setOpen(false)
      ;(e.target as HTMLFormElement).reset()
    }
  }

  if (!open && !product) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-white text-sm"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <Plus size={18} />
        Novo produto
      </button>
    )
  }

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-4"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
          {product ? 'Editar produto' : 'Novo produto'}
        </h3>
        <button
          onClick={() => onClose ? onClose() : setOpen(false)}
          style={{ color: 'var(--color-text-muted)' }}
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="name"
          defaultValue={product?.name}
          placeholder="Nome do produto"
          required
          className="w-full px-4 py-3 rounded-xl outline-none text-sm"
          style={{
            backgroundColor: 'var(--color-background)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        />

        <textarea
          name="description"
          defaultValue={product?.description}
          placeholder="Descrição (opcional)"
          rows={2}
          className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none"
          style={{
            backgroundColor: 'var(--color-background)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            name="price"
            defaultValue={product?.price}
            placeholder="Preço (ex: 12.50)"
            type="number"
            step="0.01"
            min="0"
            required
            className="w-full px-4 py-3 rounded-xl outline-none text-sm"
            style={{
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />

          <select
            name="category_id"
            defaultValue={product?.category_id}
            required
            className="w-full px-4 py-3 rounded-xl outline-none text-sm"
            style={{
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="">Categoria</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <select
            name="available"
            defaultValue={product?.available !== false ? 'true' : 'false'}
            className="flex-1 px-4 py-3 rounded-xl outline-none text-sm"
            style={{
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="true">Disponível</option>
            <option value="false">Indisponível</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Foto do produto (opcional)
          </label>
          <input
            name="image"
            type="file"
            accept="image/*"
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
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
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white text-sm"
          style={{
            backgroundColor: 'var(--color-primary)',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Salvando...' : product ? 'Salvar alterações' : 'Criar produto'}
        </button>
      </form>
    </div>
  )
}