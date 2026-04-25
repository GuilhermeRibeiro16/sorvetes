'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { OrderStatus } from '@/types'


export async function cancelOrder(orderId: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', orderId)

  if (error) return { error: 'Erro ao cancelar pedido' }

  revalidatePath('/admin/orders')
  return { success: true }
}


export async function updateOrder(formData: FormData) {
  const supabase = createAdminClient()

  const id = formData.get('id') as string
  const customer_name = formData.get('customer_name') as string
  const phone = formData.get('phone') as string
  const type = formData.get('type') as 'delivery' | 'pickup'
  const address = formData.get('address') as string | null

  if (!id || !customer_name || !phone) {
    return { error: 'Preencha todos os campos' }
  }

  const { error } = await supabase
    .from('orders')
    .update({
      customer_name,
      phone,
      type,
      address: type === 'delivery' ? address : null,
    })
    .eq('id', id)

  if (error) return { error: 'Erro ao atualizar pedido' }

  revalidatePath('/admin/orders')
  return { success: true }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) return { error: 'Erro ao atualizar status' }

  revalidatePath('/admin/orders')
  return { success: true }
}

export async function upsertProduct(formData: FormData) {
  const supabase = createAdminClient()

  const id = formData.get('id') as string | null
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = Number(formData.get('price'))
  const category_id = formData.get('category_id') as string
  const available = formData.get('available') === 'true'
  const imageFile = formData.get('image') as File | null

  if (!name || !price || !category_id) {
    return { error: 'Preencha todos os campos obrigatórios' }
  }

  let image_url: string | undefined

  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, imageFile, { upsert: true })

    if (uploadError) return { error: 'Erro ao fazer upload da imagem' }

    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    image_url = urlData.publicUrl
  }

  if (id) {
    const { error } = await supabase
      .from('products')
      .update({
        name,
        description,
        price,
        category_id,
        available,
        ...(image_url && { image_url }),
      })
      .eq('id', id)

    if (error) return { error: 'Erro ao atualizar produto' }
  } else {
    const { error } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price,
        category_id,
        available,
        image_url: image_url || null,
      })

    if (error) return { error: 'Erro ao criar produto' }
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: 'Erro ao deletar produto' }

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { success: true }
}

export async function upsertCategory(name: string, id?: string) {
  const supabase = createAdminClient()

  if (id) {
    const { error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)

    if (error) return { error: 'Erro ao atualizar categoria' }
  } else {
    const { error } = await supabase
      .from('categories')
      .insert({ name })

    if (error) return { error: 'Erro ao criar categoria' }
  }

  revalidatePath('/admin/products')
  return { success: true }
}

export async function updateSettings(formData: FormData) {
  const supabase = createAdminClient()

  const storeName = formData.get('store_name') as string
  const deliveryFee = formData.get('delivery_fee') as string
  const openingTime = formData.get('opening_time') as string
  const closingTime = formData.get('closing_time') as string
  const workingDays = formData.getAll('working_days') as string[]

  if (!storeName || !deliveryFee || !openingTime || !closingTime) {
    return { error: 'Preencha todos os campos' }
  }

  const updates = [
    { key: 'store_name', value: storeName },
    { key: 'delivery_fee', value: deliveryFee },
    { key: 'opening_time', value: openingTime },
    { key: 'closing_time', value: closingTime },
    { key: 'working_days', value: workingDays.join(',') },
  ]

  for (const { key, value } of updates) {
    const { error } = await supabase
      .from('settings')
      .update({ value })
      .eq('key', key)

    if (error) return { error: `Erro ao atualizar ${key}` }
  }

revalidatePath('/admin/settings')
revalidatePath('/')
revalidatePath('/', 'layout')
return { success: true }
}

//logica dos adicionais
export async function getProductOptions(productId: string) {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('product_option_groups')
    .select(`*, product_options(*)`)
    .eq('product_id', productId)
    .order('name')

  return data || []
}

export async function upsertOptionGroup(formData: FormData) {
  const supabase = createAdminClient()

  const id = formData.get('id') as string | null
  const product_id = formData.get('product_id') as string
  const name = formData.get('name') as string
  const type = formData.get('type') as 'radio' | 'checkbox'
  const included = Number(formData.get('included') || 0)
  const extra_price = Number(formData.get('extra_price') || 0)
  const max_select = formData.get('max_select')
    ? Number(formData.get('max_select'))
    : null

  if (!name || !product_id) return { error: 'Preencha todos os campos' }

  if (id) {
    const { error } = await supabase
      .from('product_option_groups')
      .update({ name, type, included, extra_price, max_select })
      .eq('id', id)
    if (error) return { error: 'Erro ao atualizar grupo' }
  } else {
    const { error } = await supabase
      .from('product_option_groups')
      .insert({ product_id, name, type, included, extra_price, max_select })
    if (error) return { error: 'Erro ao criar grupo' }
  }

  revalidatePath('/admin/products')
  return { success: true }
}

export async function deleteOptionGroup(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('product_option_groups')
    .delete()
    .eq('id', id)
  if (error) return { error: 'Erro ao deletar grupo' }
  revalidatePath('/admin/products')
  return { success: true }
}

export async function upsertOption(formData: FormData) {
  const supabase = createAdminClient()

  const id = formData.get('id') as string | null
  const group_id = formData.get('group_id') as string
  const name = formData.get('name') as string
  const price = Number(formData.get('price') || 0)

  if (!name || !group_id) return { error: 'Preencha todos os campos' }

  if (id) {
    const { error } = await supabase
      .from('product_options')
      .update({ name, price })
      .eq('id', id)
    if (error) return { error: 'Erro ao atualizar opção' }
  } else {
    const { error } = await supabase
      .from('product_options')
      .insert({ group_id, name, price })
    if (error) return { error: 'Erro ao criar opção' }
  }

  revalidatePath('/admin/products')
  return { success: true }
}

export async function deleteOption(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('product_options')
    .delete()
    .eq('id', id)
  if (error) return { error: 'Erro ao deletar opção' }
  revalidatePath('/admin/products')
  return { success: true }
}