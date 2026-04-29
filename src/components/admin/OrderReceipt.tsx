'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ReceiptProps = {
  order: any
}

type Settings = {
  store_name: string
  instagram: string
  whatsapp: string
  pix_key: string
  footer_message: string
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))

export function OrderReceipt({ order }: ReceiptProps) {
  const [settings, setSettings] = useState<Settings>({
    store_name: '',
    instagram: '',
    whatsapp: '',
    pix_key: '',
    footer_message: '',
  })

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('settings')
      .select('*')
      .then(({ data }) => {
        if (!data) return
        const get = (key: string) => data.find(s => s.key === key)?.value || ''
        setSettings({
          store_name: get('store_name'),
          instagram: get('instagram'),
          whatsapp: get('whatsapp'),
          pix_key: get('pix_key'),
          footer_message: get('footer_message'),
        })
      })
  }, [])

  return (
    <div
      id="receipt"
      style={{
        width: '302px',
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#000',
        backgroundColor: '#fff',
        padding: '8px',
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px' }}>
          {settings.store_name}
        </p>
        {settings.instagram && (
          <p>instagram: {settings.instagram}</p>
        )}
        {settings.whatsapp && (
          <p>📞 {settings.whatsapp}</p>
        )}
      </div>

      <p style={{ borderTop: '1px dashed #000', margin: '4px 0' }} />

      {/* PEDIDO */}
      <p><strong>Pedido:</strong> #{order.code}</p>
      <p><strong>Data:</strong> {formatDate(order.created_at)}</p>

      <p style={{ borderTop: '1px dashed #000', margin: '4px 0' }} />

      {/* CLIENTE */}
      <p><strong>Cliente:</strong> {order.customer_name}</p>
      <p><strong>Tel:</strong> {order.phone}</p>

      <p style={{ borderTop: '1px dashed #000', margin: '4px 0' }} />

      {/* TIPO */}
      <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
        {order.type === 'delivery' ? '🛵 ENTREGA' : '🏪 RETIRADA'}
      </p>
      {order.type === 'delivery' && order.address && (
        <p>{order.address}</p>
      )}

      <p style={{ borderTop: '1px dashed #000', margin: '4px 0' }} />

      {/* ITENS */}
      <p style={{ fontWeight: 'bold' }}>ITENS</p>
      {order.order_items?.map((item: any) => (
        <div key={item.id} style={{ marginBottom: '4px' }}>
          <p>{item.quantity}x {item.product_name} — {formatPrice(item.unit_price * item.quantity)}</p>
          {item.order_item_options?.map((opt: any) => (
            <p key={opt.id} style={{ paddingLeft: '8px' }}>
              + {opt.option_name}
            </p>
          ))}
        </div>
      ))}

      <p style={{ borderTop: '1px dashed #000', margin: '4px 0' }} />

      {/* TOTAL */}
      <p style={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'right' }}>
        TOTAL: {formatPrice(order.total)}
      </p>

      {/* PIX */}
{settings.pix_key && (
  <>
    <hr style={{ borderTop: '1px dashed #000', margin: '4px 0' }} />

    <div style={{ textAlign: 'center', margin: '8px 0' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        PAGAMENTO PIX
      </p>

      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(settings.pix_key)}`}
        width={120}
        height={120}
        alt="QR Code para pagamento via PIX"
        style={{ margin: '0 auto', display: 'block' }}
      />

      <p style={{ fontSize: '10px', marginTop: '4px' }}>
        {settings.pix_key}
      </p>
    </div>
  </>
)}


      {/* FOOTER */}
      {settings.footer_message && (
        <>
          <p style={{ borderTop: '1px dashed #000', margin: '4px 0' }} />
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
            "{settings.footer_message}"
          </p>
        </>
      )}
    </div>
  )
}