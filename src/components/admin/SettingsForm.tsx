'use client'

import { useState } from 'react'
import { updateSettings } from '@/lib/actions/admin'
import { Check } from 'lucide-react'

type SettingsFormProps = {
  storeName: string
  deliveryFee: string
  openingTime: string
  closingTime: string
  workingDays: string
  instagram: string
  whatsapp: string
  pixKey: string
  footerMessage: string
}

export function SettingsForm({
  storeName,
  deliveryFee,
  openingTime,
  closingTime,
  workingDays,
  instagram,
  whatsapp,
  pixKey,
  footerMessage
}: SettingsFormProps) {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setSaved(false)

    const formData = new FormData(e.currentTarget)
    const result = await updateSettings(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle = {
    backgroundColor: 'var(--color-background)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
  }

  return (
<form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
  <div
    className="rounded-2xl p-4 flex flex-col gap-4"
    style={{
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
    }}
  >
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
        Nome da loja
      </label>
      <input
        name="store_name"
        defaultValue={storeName}
        placeholder="Nome da sua sorveteria"
        required
        className="w-full px-4 py-3 rounded-xl outline-none text-sm"
        style={inputStyle}
      />
    </div>

    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
        Taxa de entrega (R$)
      </label>
      <input
        name="delivery_fee"
        defaultValue={deliveryFee}
        placeholder="5.00"
        type="number"
        step="0.01"
        min="0"
        required
        className="w-full px-4 py-3 rounded-xl outline-none text-sm"
        style={inputStyle}
      />
    </div>

    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
        Horário de funcionamento
      </label>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Abre às
          </label>
          <input
            name="opening_time"
            defaultValue={openingTime}
            type="time"
            required
            className="w-full px-4 py-3 rounded-xl outline-none text-sm"
            style={inputStyle}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Fecha às
          </label>
          <input
            name="closing_time"
            defaultValue={closingTime}
            type="time"
            required
            className="w-full px-4 py-3 rounded-xl outline-none text-sm"
            style={inputStyle}
          />
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
        Dias de funcionamento
      </label>
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Dom', value: '0' },
          { label: 'Seg', value: '1' },
          { label: 'Ter', value: '2' },
          { label: 'Qua', value: '3' },
          { label: 'Qui', value: '4' },
          { label: 'Sex', value: '5' },
          { label: 'Sáb', value: '6' },
        ].map(day => (
          <label key={day.value} className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              name="working_days"
              value={day.value}
              defaultChecked={workingDays.split(',').includes(day.value)}
            />
            <span className="text-sm" style={{ color: 'var(--color-text)' }}>
              {day.label}
            </span>
          </label>
        ))}
      </div>
    </div>
<div className="flex flex-col gap-2">
  <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
    Instagram
  </label>
  <input
    name="instagram"
    defaultValue={instagram}
    placeholder="@suasorveteria"
    className="w-full px-4 py-3 rounded-xl outline-none text-sm"
    style={inputStyle}
  />
</div>

<div className="flex flex-col gap-2">
  <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
    WhatsApp
  </label>
  <input
    name="whatsapp"
    defaultValue={whatsapp}
    placeholder="(82) 99999-9999"
    className="w-full px-4 py-3 rounded-xl outline-none text-sm"
    style={inputStyle}
  />
</div>

<div className="flex flex-col gap-2">
  <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
    Chave PIX
  </label>
  <input
    name="pix_key"
    defaultValue={pixKey}
    placeholder="CPF, CNPJ, email ou chave aleatória"
    className="w-full px-4 py-3 rounded-xl outline-none text-sm"
    style={inputStyle}
  />
</div>

<div className="flex flex-col gap-2">
  <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
    Rodapé da comanda
  </label>
  <input
    name="footer_message"
    defaultValue={footerMessage}
    placeholder="Ex: Deus é fiel"
    className="w-full px-4 py-3 rounded-xl outline-none text-sm"
    style={inputStyle}
  />
</div>



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
    className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm"
    style={{
      backgroundColor: saved ? '#10B981' : 'var(--color-primary)',
      opacity: loading ? 0.7 : 1,
      transition: 'background-color 0.3s',
    }}
  >
    {saved ? (
      <>
        <Check size={18} />
        Salvo com sucesso
      </>
    ) : loading ? (
      'Salvando...'
    ) : (
      'Salvar configurações'
    )}
  </button>
</form>
  )
}