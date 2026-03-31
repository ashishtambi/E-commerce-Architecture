'use client';

import Link from 'next/link';
import ProductCard from '../../components/product/ProductCard';
import { useWishlist } from '../../contexts/WishlistContext';

export default function WishlistPage() {
  const { wishlist, loading } = useWishlist();

  return (
    <div className="luxe-container py-10">
      <h1 className="section-title mb-6">Wishlist</h1>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[390px] animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800" />
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="luxe-panel p-10 text-center">
          <p className="text-sm">No items in wishlist.</p>
          <Link href="/shop" className="mt-4 inline-block text-sm font-semibold text-accent-600 dark:text-accent-200">
            Explore products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {wishlist.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
