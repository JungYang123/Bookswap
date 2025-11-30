"use client";
import { useCart } from "../contexts/CartContext";
import Link from "next/link";
import TopNavbar from "../components/top-navbar";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, getCartTotal } = useCart();

  const handleCheckout = () => {
    // Dummy checkout - just show an alert
    alert("Checkout functionality coming soon!");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-950 via-green-900 to-black text-white">
      <TopNavbar />

      <main className="mx-auto max-w-6xl p-6">
        <h1 className="text-4xl font-bold text-yellow-400 mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-yellow-400/40 bg-white/5 backdrop-blur-lg p-12 text-center">
            <p className="text-yellow-200 text-xl mb-4">Your cart is empty</p>
            <Link
              href="/listing"
              className="inline-block rounded-xl bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 text-black font-semibold px-6 py-3 shadow-[0_0_15px_rgba(255,215,0,0.4)] hover:shadow-[0_0_25px_rgba(255,215,0,0.8)] transition-all"
            >
              Browse Listings
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-yellow-400/40 bg-white/5 backdrop-blur-lg p-5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-5">
                    {/* Book Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image_url || "/strawberry.png"}
                        alt={item.title}
                        className="w-24 h-32 object-cover rounded-lg border border-yellow-500/30"
                      />
                    </div>

                    {/* Book Details */}
                    <div className="flex-grow">
                      <h2 className="text-xl font-bold text-yellow-50 mb-1">
                        {item.title}
                      </h2>
                      {item.author && (
                        <p className="text-yellow-200/80 mb-2">by {item.author}</p>
                      )}
                      {item.trade_type && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 mr-2">
                          {item.trade_type}
                        </span>
                      )}
                    </div>

                    {/* Price and Remove */}
                    <div className="flex flex-col items-end gap-3">
                      <span className="text-2xl font-bold text-yellow-400">
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="rounded-xl border border-yellow-400/40 bg-white/5 backdrop-blur-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-semibold text-yellow-200">
                  Total ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
                </span>
                <span className="text-3xl font-bold text-yellow-400">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={clearCart}
                  className="flex-1 rounded-xl border border-yellow-400/50 bg-white/10 text-yellow-50 px-4 py-3 hover:bg-yellow-400/20 hover:border-yellow-400/70 transition-all font-medium"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 text-black font-semibold px-6 py-3 shadow-[0_0_15px_rgba(255,215,0,0.4)] hover:shadow-[0_0_25px_rgba(255,215,0,0.8)] transition-all"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

