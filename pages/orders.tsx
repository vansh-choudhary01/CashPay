import { useEffect, useState } from 'react'
import { loadOrders, type Order } from '../store/orders'

/**
 * Orders page: lists all created orders stored in localStorage.
 */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  useEffect(() => {
    setOrders(loadOrders())
  }, [])
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-4">
      <h1 className="text-2xl font-semibold mb-2">My Orders</h1>
      {orders.length === 0 && (
        <div className="glass rounded-xl p-6">No orders yet.</div>
      )}
      <div className="grid gap-3">
        {orders.map((o) => (
          <div
            key={o.id}
            className="glass rounded-xl p-4 flex items-center justify-between"
          >
            <div className="text-sm">
              <div className="font-medium">
                {o.brand} {o.model}
              </div>
              <div className="text-neutral-300">
                {o.condition} • {o.storage}
              </div>
            </div>
            <div className="font-semibold text-emerald-400">
              ₹ {o.price.toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}