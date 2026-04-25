'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Minus, ShoppingCart } from 'lucide-react'
import { Product, ProductOptionGroup } from '@/types'
import { SelectedOption } from '@/hooks/useCart'
import { createClient } from '@/lib/supabase/client'

type Props = {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product, options: SelectedOption[], total: number) => void
}

export function ProductModal({ product, onClose, onAddToCart }: Props) {
  const [groups, setGroups] = useState<ProductOptionGroup[]>([])
  const [selected, setSelected] = useState<Record<string, SelectedOption[]>>({})
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('product_option_groups')
        .select(`*, product_options(*)`)
        .eq('product_id', product.id)
        .order('name')

      setGroups((data as ProductOptionGroup[]) || [])
      setLoading(false)
    }
    load()
  }, [product.id])

  function handleRadio(group: ProductOptionGroup, optionId: string, optionName: string, optionPrice: number) {
    setSelected(prev => ({
      ...prev,
      [group.id]: [{
        group_id: group.id,
        group_name: group.name,
        option_id: optionId,
        option_name: optionName,
        option_price: optionPrice,
      }]
    }))
  }

function handleCheckbox(group: ProductOptionGroup, optionId: string, optionName: string, optionPrice: number) {
  setSelected(prev => {
    const current = prev[group.id] || []
    const exists = current.find(o => o.option_id === optionId)

    if (exists) {
      return { ...prev, [group.id]: current.filter(o => o.option_id !== optionId) }
    }

    return {
      ...prev,
      [group.id]: [...current, {
        group_id: group.id,
        group_name: group.name,
        option_id: optionId,
        option_name: optionName,
        option_price: optionPrice,
      }]
    }
  })
}

  function calculateTotal() {
    let total = product.price

    groups.forEach(group => {
      const groupSelected = selected[group.id] || []

      groupSelected.forEach(opt => {
        total += opt.option_price
      })

      const extras = Math.max(0, groupSelected.length - group.included)
      total += extras * group.extra_price
    })

    return total * quantity
  }

  function handleAdd() {
    const allOptions = Object.values(selected).flat()
    const itemTotal = calculateTotal() / quantity
    onAddToCart(product, allOptions, itemTotal)
    onClose()
  }

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)

return (
<div
  className="fixed inset-0 z-200 flex"
  style={{
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  }}
  onClick={e => e.target === e.currentTarget && onClose()}
>
<div
  style={{
    backgroundColor: 'var(--color-surface)',
    height: '85vh',
    width: '100%',
    maxWidth: '32rem',
    borderRadius: '1.5rem 1.5rem 0 0',
    display: 'flex',
    flexDirection: 'column',
  }}
>
      {/* Header fixo */}
  <div
    style={{
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem',
      borderBottom: '1px solid var(--color-border)',
    }}
  >
        <div>
          <h3 className="font-bold" style={{ color: 'var(--color-text)' }}>
            {product.name}
          </h3>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-primary)' }}>
            {formatPrice(product.price)}
          </p>
        </div>
        <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}>
          <X size={20} />
        </button>
      </div>

      {/* Conteúdo scrollável */}
       <div
    style={{
      flex: 1,
      overflowY: 'auto',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}
  >
        {loading ? (
          <p className="text-sm text-center" style={{ color: 'var(--color-text-muted)' }}>
            Carregando opções...
          </p>
        ) : groups.length === 0 ? (
          <p className="text-sm text-center" style={{ color: 'var(--color-text-muted)' }}>
            Sem opções para este produto
          </p>
        ) : (
          groups.map(group => (
            <div key={group.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                  {group.name}
                </p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {group.type === 'radio' ? 'Escolha 1' : `Escolha até ${group.max_select || '∞'}`}
                </span>
              </div>

              {group.included > 0 && (
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {(() => {
                    const count = (selected[group.id] || []).length
                    const extras = Math.max(0, count - group.included)
                    if (extras > 0) {
                      return `${count} selecionados · ${extras} extra(s) · +${formatPrice(extras * group.extra_price)}`
                    }
                    return `${count} de ${group.included} incluso(s) · adicional +${formatPrice(group.extra_price)} cada`
                  })()}
                </p>
              )}

              <div className="flex flex-col gap-1">
                {group.product_options?.filter(o => o.available).map(option => {
                  const groupSelected = selected[group.id] || []
                  const isSelected = groupSelected.some(o => o.option_id === option.id)

                  return (
                    <button
                      key={option.id}
                      onClick={() => group.type === 'radio'
                        ? handleRadio(group, option.id, option.name, option.price)
                        : handleCheckbox(group, option.id, option.name, option.price)
                      }
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all"
                      style={{
                        backgroundColor: isSelected
                          ? 'var(--color-primary)'
                          : 'var(--color-background)',
                        border: `1px solid ${isSelected
                          ? 'var(--color-primary)'
                          : 'var(--color-border)'}`,
                      }}
                    >
                      <span
                        className="text-sm font-medium"
                        style={{ color: isSelected ? 'white' : 'var(--color-text)' }}
                      >
                        {option.name}
                      </span>
                      {option.price > 0 && (
                        <span
                          className="text-xs"
                          style={{ color: isSelected ? 'white' : 'var(--color-text-muted)' }}
                        >
                          +{formatPrice(option.price)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer fixo */}
<div
  style={{
    flexShrink: 0,
    padding: '1rem',
    borderTop: '1px solid var(--color-border)',
    backgroundColor: '', // temporário para debug
  }}
>
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 rounded-full px-3 py-2"
            style={{ border: '1px solid var(--color-border)' }}
          >
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              style={{ color: 'var(--color-primary)' }}
            >
              <Minus size={18} />
            </button>
            <span className="font-bold w-4 text-center" style={{ color: 'var(--color-text)' }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              style={{ color: 'var(--color-primary)' }}
            >
              <Plus size={18} />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <ShoppingCart size={18} />
            Adicionar · {formatPrice(calculateTotal())}
          </button>
        </div>
      </div>
    </div>
  </div>
)
}