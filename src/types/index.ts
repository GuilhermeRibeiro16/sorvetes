export type Category = {
  id: string
  name: string
  deleted_at: string | null
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  category_id: string
  available: boolean
  deleted_at: string | null
  category?: Category
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
export type OrderType = 'delivery' | 'pickup'

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  order_item_options?: OrderItemOption[]
}

export type Order = {
  id: string
  code: string
  customer_name: string
  phone: string
  type: OrderType
  address: string | null
  status: OrderStatus
  total: number
  created_at: string
  order_items?: OrderItem[]
}

export type Setting = {
  id: string
  key: string
  value: string
}

//aqui ficam os adicionais para os produtos, como opções e grupos de opções
export type ProductOptionGroup = {
  id: string
  product_id: string
  name: string
  type: 'radio' | 'checkbox'
  max_select: number | null
  included: number
  extra_price: number
  product_options?: ProductOption[]
}

export type ProductOption = {
  id: string
  group_id: string
  name: string
  price: number
  available: boolean
}

export type OrderItemOption = {
  id: string
  order_item_id: string
  option_name: string
  option_price: number
}