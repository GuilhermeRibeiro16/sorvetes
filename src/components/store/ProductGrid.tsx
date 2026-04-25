'use client'

import { useState } from 'react'
import { Product, Category } from '@/types'
import { ProductCard } from './ProductCard'
import { CategoryFilter } from './CategoryFilter'
import { useCartContext } from './CartProvider'
import { ProductModal } from './ProductModal'
import { SelectedOption } from '@/hooks/useCart'

type ProductGridProps = {
  products: Product[]
  categories: Category[]
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { addItem } = useCartContext()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filtered = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products

  return (
    <div className="flex flex-col gap-4">
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {filtered.length === 0 ? (
        <div
          className="text-center py-16"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <p className="text-4xl mb-3">🍦</p>
          <p className="font-medium">Nenhum produto encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => setSelectedProduct(product)}
            />
          ))}
          {selectedProduct && (
  <ProductModal
    product={selectedProduct}
    onClose={() => setSelectedProduct(null)}
    onAddToCart={(product, options, itemTotal) => {
      addItem(product, options, itemTotal)
      setSelectedProduct(null)
    }}
  />
)}
        </div>
      )}
      
      
    </div>
    
  )
}