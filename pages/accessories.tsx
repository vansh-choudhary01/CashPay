import { accessories } from '../data/accessories'
import { addToCart } from '../store/cart'

/**
 * Lists accessories for purchase. Users can add items to their cart.
 */
export default function AccessoriesPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Accessories</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accessories.map((item) => (
          <div
            key={item.id}
            className="glass rounded-xl p-4 hover:scale-[1.02] transition"
          >
            <div className="text-lg font-medium mb-1">{item.name}</div>
            <p className="text-sm text-neutral-300 mb-3">
              {item.description}
            </p>
            <div className="font-semibold text-emerald-400 mb-3">
              ₹ {item.price.toLocaleString('en-IN')}
            </div>
            <button
              className="h-9 px-4 rounded-md bg-emerald-500 text-black font-medium w-full"
              onClick={() => {
                addToCart({ id: item.id, name: item.name, price: item.price, quantity: 1 })
                alert('Added to cart!')
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}