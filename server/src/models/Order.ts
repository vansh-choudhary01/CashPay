import mongoose, { Schema, Document } from 'mongoose'

export type OrderType = 'sell' | 'purchase'
export type OrderStatus = 'created' | 'scheduled' | 'picked_up' | 'inspected' | 'paid' | 'delivered' | 'cancelled'

export interface IOrder extends Document {
  type: OrderType
  userId?: string
  // Sell order fields
  category?: string
  brand?: string
  model?: string
  storage?: string
  condition?: string
  price?: number
  // Purchase order fields
  productId?: string
  quantity?: number
  // Shared
  status: OrderStatus
  pickupAt?: string
  address?: string
}

const OrderSchema = new Schema<IOrder>({
  type: { type: String, enum: ['sell', 'purchase'], required: true },
  userId: String,
  category: String,
  brand: String,
  model: String,
  storage: String,
  condition: String,
  price: Number,
  productId: String,
  quantity: { type: Number, default: 1 },
  status: { type: String, enum: ['created','scheduled','picked_up','inspected','paid','delivered','cancelled'], default: 'created' },
  pickupAt: String,
  address: String,
}, { timestamps: true })

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
