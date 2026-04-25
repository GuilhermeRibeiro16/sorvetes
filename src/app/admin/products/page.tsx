import { createAdminClient } from '@/lib/supabase/admin'
import { ProductForm } from '@/components/admin/ProductForm'
import { ProductList } from '@/components/admin/ProductList'

async function getData() {
  const supabase = createAdminClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:categories(*)')
      .is('deleted_at', null)
      .order('name'),
    supabase
      .from('categories')
      .select('*')
      .is('deleted_at', null)
      .order('name'),
  ])

  return { products: products || [], categories: categories || [] }
}

export default async function AdminProductsPage() {
  const { products, categories } = await getData()

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
        Produtos
      </h2>

      <ProductForm categories={categories} />

      <ProductList products={products} categories={categories} />
    </div>
  )
}