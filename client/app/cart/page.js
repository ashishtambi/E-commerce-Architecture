'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { resolveImageUrl } from '../../lib/api';
import { formatINR } from '../../lib/format';
import ProductImage from '../../components/ui/ProductImage';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, subtotal } = useCart();

  if (!cart.length) {
    return (
      <div className="luxe-container py-16">
        <div className="luxe-panel p-10 text-center">
          <h1 className="font-serifDisplay text-3xl">Your cart is empty</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Add your favorite pieces to continue.</p>
          <Link href="/shop" className="mt-6 inline-block rounded-full bg-accent-600 px-6 py-3 text-sm font-semibold text-white">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="luxe-container py-10">
      <h1 className="section-title mb-6">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr,330px]">
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.product._id}-${item.size}-${item.color}`}
              className="luxe-panel grid grid-cols-[96px,1fr] gap-4 p-4 sm:grid-cols-[110px,1fr]"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                <ProductImage
                  src={resolveImageUrl(item.product.images[0])}
                  alt={item.product.name}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{item.product.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="mt-1 font-semibold text-accent-600 dark:text-accent-200">
                    {formatINR(item.product.discountedPrice || item.product.price)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center rounded-full border border-accent-300/50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="p-2"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="p-2"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.product._id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-red-600"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="luxe-panel h-fit p-5">
          <h2 className="font-serifDisplay text-2xl">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>{formatINR(0)}</span>
            </div>
            <div className="border-t border-accent-200/40 pt-3 text-base font-semibold dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span>{formatINR(subtotal)}</span>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-accent-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white"
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
