import { useState, useEffect } from 'react'
import { Product, ProductOptionGroup } from '@/types'

export type SelectedOption = {
  group_id: string
  group_name: string
  option_id: string
  option_name: string
  option_price: number
}

export type CartItem = {
  product: Product
  quantity: number
  selectedOptions: SelectedOption[]
  itemTotal: number
}

const CART_KEY = 'sorvetes_cart'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch {
      localStorage.removeItem(CART_KEY)
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items, loaded])

function addItem(product: Product, selectedOptions: SelectedOption[], itemTotal: number) {
  setItems(current => {
    const existing = current.find(item =>
      item.product.id === product.id &&
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    )

    if (existing) {
      return current.map(item =>
        item.product.id === product.id &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    }

    return [...current, { product, quantity: 1, selectedOptions, itemTotal }]
  })
}

  function removeItem(productId: string) {
    setItems(current =>
      current.filter(item => item.product.id !== productId)
    )
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems(current =>
      current.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  function clearCart() {
    setItems([])
  }

const total = items.reduce(
  (sum, item) => sum + item.itemTotal * item.quantity,
  0
)

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return {
    items,
    total,
    itemCount,
    loaded,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}