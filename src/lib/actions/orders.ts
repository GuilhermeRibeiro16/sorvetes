'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

type OrderItemInput = {
  product_id: string
  quantity: number
  options: {
    option_name: string
    option_price: number
  }[]
}

type CreateOrderInput = {
  customer_name: string
  phone: string
  type: 'delivery' | 'pickup'
  address: string | null
  items: OrderItemInput[]
}

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function createOrder(input: CreateOrderInput) {
  
  

  const supabase = createAdminClient()

  if (!input.customer_name || !input.phone || !input.type) {
    return { error: 'Preencha todos os campos obrigatórios' }
  }

  if (input.type === 'delivery' && !input.address) {
    return { error: 'Informe o endereço de entrega' }
  }

  if (!input.items || input.items.length === 0) {
    return { error: 'Carrinho vazio' }
  }

  const productIds = input.items.map(item => item.product_id)
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, price, name')
    .in('id', productIds)
    .is('deleted_at', null)
    .eq('available', true)

  if (productsError || !products) {
    return { error: 'Erro ao buscar produtos' }
  }

  let total = 0
  const orderItems = input.items.map(item => {
    const product = products.find(p => p.id === item.product_id)
    if (!product) throw new Error(`Produto não encontrado: ${item.product_id}`)
    total += product.price * item.quantity
    return {
      product_id: item.product_id,
      product_name: product.name,
      quantity: item.quantity,
      unit_price: product.price,
    }
  })

  if (input.type === 'delivery') {
    const { data: setting } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'delivery_fee')
      .single()

    if (setting) total += Number(setting.value)
  }

  let code = generateCode()
  let attempts = 0

  while (attempts < 10) {
    const { data: existing } = await supabase
      .from('orders')
      .select('id')
      .eq('code', code)
      .single()

    if (!existing) break
    code = generateCode()
    attempts++
  }

  const { data: order, error: orderError } = await supabase
  
    .from('orders')
    .insert({
      code,
      customer_name: input.customer_name,
      phone: input.phone,
      type: input.type,
      address: input.address,
      total,
      status: 'received',
    })
    .select('id, code')
    .single()

  if (orderError || !order) {
    return { error: 'Erro ao criar pedido' }
  }

const { data: insertedItems, error: itemsError } = await supabase
  .from('order_items')
  .insert(orderItems.map(item => ({ ...item, order_id: order.id })))
  .select('id, product_id')

if (itemsError || !insertedItems) {
  return { error: 'Erro ao salvar itens do pedido' }
}

// Salva as opções de cada item
for (const insertedItem of insertedItems) {
  const originalItem = input.items.find(i => i.product_id === insertedItem.product_id)
  if (!originalItem?.options?.length) continue

  const { error: optionsError } = await supabase
    .from('order_item_options')
    .insert(
      originalItem.options.map(opt => ({
        order_item_id: insertedItem.id,
        option_name: opt.option_name,
        option_price: opt.option_price,
      }))
    )

  if (optionsError) {
    return { error: 'Erro ao salvar opções do pedido' }
  }
}

return { code: order.code }

}


export async function getOrdersByPhone(phone: string) {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('orders')
    .select('id, code, status, total, created_at, type')
    .eq('phone', phone)
    .order('created_at', { ascending: false })
    .limit(10)

  return data || []
}