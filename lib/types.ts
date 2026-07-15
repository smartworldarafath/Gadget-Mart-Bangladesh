export interface Category {
  id: string
  name: string
  slug: string
  icon_url: string | null
  image_url: string | null
  parent_id: string | null
  display_order: number
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  category_id: string | null
  price: number
  original_price: number | null
  discount_amount: number
  discount_percent: number
  stock_quantity: number
  sku: string | null
  brand: string | null
  model: string | null
  color: string | null
  storage: string | null
  ram: string | null
  specifications: Record<string, string>
  images: string[]
  thumbnail_url: string | null
  is_featured: boolean
  is_exclusive_deal: boolean
  is_best_deal: boolean
  is_top_selling: boolean
  is_new_arrival: boolean
  is_active: boolean
  meta_title: string | null
  meta_description: string | null
  views_count: number
  sales_count: number
  created_at: string
  updated_at: string
}

export interface Banner {
  id: string
  title: string | null
  image_url: string
  mobile_image_url: string | null
  link_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export interface PromoBadge {
  id: string
  icon: string
  text: string
  display_order: number
  is_active: boolean
}

export interface Customer {
  id: string
  full_name: string | null
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  district: string | null
  avatar_url: string | null
  is_admin: boolean
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_id: string | null
  customer_name: string
  customer_phone: string
  customer_email: string | null
  shipping_address: string
  shipping_city: string
  shipping_district: string
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  subtotal: number
  shipping_charge: number
  discount: number
  total_amount: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_image: string | null
  quantity: number
  unit_price: number
  total_price: number
}

export interface CartItem {
  id: string
  session_id: string | null
  customer_id: string | null
  product_id: string
  quantity: number
  created_at: string
  // Hydrated field
  product?: Product
}

export interface WishlistItem {
  id: string
  customer_id: string
  product_id: string
  created_at: string
  // Hydrated field
  product?: Product
}

export interface Review {
  id: string
  product_id: string
  customer_id: string | null
  customer_name: string | null
  rating: number
  comment: string | null
  is_approved: boolean
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  discount_type: 'percent' | 'flat'
  discount_value: number
  min_order_amount: number
  max_uses: number | null
  used_count: number
  expires_at: string | null
  is_active: boolean
  created_at: string
}
