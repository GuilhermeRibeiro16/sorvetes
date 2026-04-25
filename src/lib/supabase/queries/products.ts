import { createClient } from '@/lib/supabase/server'
import { Product, Category } from '@/types'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('deleted_at', null)
    .order('name')

  if (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }

  return data
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .is('deleted_at', null)
    .eq('available', true)
    .order('name')

  if (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }

  return data
}