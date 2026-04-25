import { getProducts, getCategories } from '@/lib/supabase/queries/products'
import { ProductGrid } from '@/components/store/ProductGrid'
import { LastOrderBanner } from '@/components/store/LastOrderBanner'

export default async function StorePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  return (
    <div className="py-6 flex flex-col gap-6">
      <LastOrderBanner />

      <div>
        <h2
          className="text-2xl font-bold"
          style={{ color: 'var(--color-text)' }}
        >
          Cardápio
        </h2>
        <p
          className="text-sm mt-1"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {products.length} produtos disponíveis
        </p>
      </div>

      <ProductGrid
        products={products}
        categories={categories}
      />
    </div>
  )
}