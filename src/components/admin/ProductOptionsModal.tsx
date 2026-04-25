'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Product, ProductOptionGroup } from '@/types'
import {
  getProductOptions,
  upsertOptionGroup,
  deleteOptionGroup,
  upsertOption,
  deleteOption,
} from '@/lib/actions/admin'

type Props = {
  product: Product
  onClose: () => void
}

export function ProductOptionsModal({ product, onClose }: Props) {
  const [groups, setGroups] = useState<ProductOptionGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const [addingGroup, setAddingGroup] = useState(false)
  const [addingOption, setAddingOption] = useState<string | null>(null)

  async function loadGroups() {
    const data = await getProductOptions(product.id)
    setGroups(data as ProductOptionGroup[])
    setLoading(false)
  }

  useEffect(() => {
    loadGroups()
  }, [])

  async function handleAddGroup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('product_id', product.id)
    const result = await upsertOptionGroup(formData)
    if (!result.error) {
      setAddingGroup(false)
      loadGroups()
    }
  }

  async function handleAddOption(e: React.FormEvent<HTMLFormElement>, groupId: string) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('group_id', groupId)
    const result = await upsertOption(formData)
    if (!result.error) {
      setAddingOption(null)
      loadGroups()
    }
  }

  const inputStyle = {
    backgroundColor: 'var(--color-background)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
  }

  return (
<div
  className="fixed inset-0 z-50"
  style={{
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  }}
  onClick={e => e.target === e.currentTarget && onClose()}
>
        {/* Modal container
        codgio para aumentar:
        <div
        className="w-full max-w-lg rounded-t-3xl flex flex-col"
        style={{ backgroundColor: 'var(--color-surface)', height: '85vh' }}
        > */}
      <div
        className="w-full max-w-lg rounded-t-3xl flex flex-col"
        style={{
          backgroundColor: 'var(--color-surface)',
          maxHeight: '90vh',
        }}
      >
        <div className="flex items-center justify-between p-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div>
            <h3 className="font-bold" style={{ color: 'var(--color-text)' }}>
              Opções do produto
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {product.name}
            </p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-3">
          {loading ? (
            <p className="text-sm text-center" style={{ color: 'var(--color-text-muted)' }}>
              Carregando...
            </p>
          ) : (
            <>
              {groups.map(group => (
                <div
                  key={group.id}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: '1px solid var(--color-border)' }}
                >
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer"
                    style={{ backgroundColor: 'var(--color-background)' }}
                    onClick={() => setExpandedGroup(
                      expandedGroup === group.id ? null : group.id
                    )}
                  >
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                        {group.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {group.type === 'radio' ? 'Escolha única' : 'Múltipla escolha'}
                        {group.included > 0 && ` · ${group.included} incluso(s)`}
                        {group.extra_price > 0 && ` · +R$${group.extra_price.toFixed(2)} extra`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async e => {
                          e.stopPropagation()
                          await deleteOptionGroup(group.id)
                          loadGroups()
                        }}
                        style={{ color: '#EF4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                      {expandedGroup === group.id
                        ? <ChevronUp size={16} style={{ color: 'var(--color-text-muted)' }} />
                        : <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />
                      }
                    </div>
                  </div>

                  {expandedGroup === group.id && (
                    <div className="p-3 flex flex-col gap-2">
                      {group.product_options?.map(option => (
                        <div key={option.id} className="flex items-center justify-between">
                          <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                            {option.name}
                            {option.price > 0 && (
                              <span style={{ color: 'var(--color-text-muted)' }}>
                                {' '}+R${option.price.toFixed(2)}
                              </span>
                            )}
                          </span>
                          <button
                            onClick={async () => {
                              await deleteOption(option.id)
                              loadGroups()
                            }}
                            style={{ color: '#EF4444' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}

                      {addingOption === group.id ? (
                        <form
                          onSubmit={e => handleAddOption(e, group.id)}
                          className="flex gap-2 mt-1"
                        >
                          <input
                            name="name"
                            placeholder="Nome da opção"
                            required
                            autoFocus
                            className="flex-1 px-3 py-2 rounded-xl outline-none text-sm"
                            style={inputStyle}
                          />
                          <input
                            name="price"
                            placeholder="R$"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue="0"
                            className="w-16 px-3 py-2 rounded-xl outline-none text-sm"
                            style={inputStyle}
                          />
                          <button
                            type="submit"
                            className="px-3 py-2 rounded-xl text-white text-sm font-semibold"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            OK
                          </button>
                        </form>
                      ) : (
                        <button
                          onClick={() => setAddingOption(group.id)}
                          className="flex items-center gap-1 text-xs mt-1"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          <Plus size={14} />
                          Nova opção
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {addingGroup ? (
                <form
                  onSubmit={handleAddGroup}
                  className="rounded-2xl p-4 flex flex-col gap-3"
                  style={{ border: '1px solid var(--color-border)' }}
                >
                  <input
                    name="name"
                    placeholder="Nome do grupo (ex: Adicionais)"
                    required
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                    style={inputStyle}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      name="type"
                      className="px-3 py-2 rounded-xl outline-none text-sm"
                      style={inputStyle}
                    >
                      <option value="checkbox">Múltipla escolha</option>
                      <option value="radio">Escolha única</option>
                    </select>
                    <input
                      name="included"
                      placeholder="Inclusos"
                      type="number"
                      min="0"
                      defaultValue="0"
                      className="px-3 py-2 rounded-xl outline-none text-sm"
                      style={inputStyle}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      name="extra_price"
                      placeholder="Preço extra (R$)"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue="0"
                      className="px-3 py-2 rounded-xl outline-none text-sm"
                      style={inputStyle}
                    />
                    <input
                      name="max_select"
                      placeholder="Máx. seleções"
                      type="number"
                      min="1"
                      className="px-3 py-2 rounded-xl outline-none text-sm"
                      style={inputStyle}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl text-white text-sm font-semibold"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      Criar grupo
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddingGroup(false)}
                      className="px-4 py-2 rounded-xl text-sm"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setAddingGroup(true)}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold"
                  style={{
                    border: '2px dashed var(--color-border)',
                    color: 'var(--color-primary)',
                  }}
                >
                  <Plus size={16} />
                  Novo grupo de opções
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}