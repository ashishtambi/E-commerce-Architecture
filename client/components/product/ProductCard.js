'use client';

import Link from 'next/link';
import { Eye, Heart, ShoppingBag, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { formatINR } from '../../lib/format';
import { resolveImageUrl } from '../../lib/api';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import ProductImage from '../ui/ProductImage';
import RatingStars from '../ui/RatingStars';

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const primaryImage = resolveImageUrl(product.images?.[0]);
  const secondaryImage = resolveImageUrl(product.images?.[1] || product.images?.[0]);
  const hasSecondaryImage = secondaryImage !== primaryImage;

  const hasDiscount =
    typeof product.discountedPrice === 'number' &&
    product.discountedPrice > 0 &&
    product.discountedPrice < product.price;

  const discountPercent = useMemo(() => {
    if (!hasDiscount) return 0;
    return Math.round(((product.price - product.discountedPrice) / product.price) * 100);
  }, [hasDiscount, product.discountedPrice, product.price]);

  const finalPrice = hasDiscount ? product.discountedPrice : product.price;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.03 }}
        viewport={{ once: true }}
        className="group overflow-hidden rounded-3xl border border-accent-200/40 bg-white/80 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-glow dark:border-slate-700 dark:bg-slate-900/80"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <ProductImage
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            className={`object-cover transition duration-500 group-hover:scale-105 ${
              hasSecondaryImage ? 'group-hover:opacity-0' : ''
            }`}
          />
          {hasSecondaryImage && (
            <ProductImage
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
              className="object-cover opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {hasDiscount && (
              <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                {discountPercent}% off
              </span>
            )}
            {product.trending && (
              <span className="rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                Trending
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => toggle(product)}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-accent-600 shadow transition hover:scale-105 dark:bg-slate-900/90 dark:text-accent-200"
            aria-label="Toggle wishlist"
          >
            <Heart size={16} fill={isWishlisted(product._id) ? 'currentColor' : 'none'} />
          </button>

          <div className="absolute inset-x-3 bottom-3 grid grid-cols-2 gap-2 transition duration-300 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <button
              type="button"
              onClick={() => addItem(product)}
              className="inline-flex items-center justify-center gap-1 rounded-full bg-accent-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white"
            >
              <ShoppingBag size={13} /> Add
            </button>
            <button
              type="button"
              onClick={() => setIsQuickViewOpen(true)}
              className="inline-flex items-center justify-center gap-1 rounded-full border border-white/70 bg-black/45 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur"
            >
              <Eye size={13} /> Quick View
            </button>
          </div>
        </div>

        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/product/${product.slug}`} className="font-semibold leading-snug transition hover:text-accent-600 dark:hover:text-accent-200">
              {product.name}
            </Link>
            <span className="text-xs uppercase tracking-wide text-accent-600 dark:text-accent-200">{product.subCategory}</span>
          </div>

          <RatingStars rating={product.rating || 4.3} reviewsCount={product.reviewsCount || 0} />

          <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{product.shortDescription || product.description}</p>

          <div className="flex items-center justify-between pt-1">
            <div className="space-x-2">
              <span className="font-semibold text-accent-600 dark:text-accent-200">{formatINR(finalPrice)}</span>
              {hasDiscount && <span className="text-xs text-slate-500 line-through">{formatINR(product.price)}</span>}
            </div>
            <button
              type="button"
              onClick={() => addItem(product)}
              className="inline-flex items-center gap-2 rounded-full border border-accent-400/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition hover:bg-accent-600 hover:text-white"
            >
              <ShoppingBag size={14} /> Add
            </button>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {isQuickViewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
            onClick={() => setIsQuickViewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 12, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl overflow-hidden rounded-3xl border border-accent-200/30 bg-white dark:border-slate-700 dark:bg-slate-900"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="grid gap-0 md:grid-cols-2">
                <div className="relative min-h-[360px]">
                  <ProductImage
                    src={secondaryImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
                <div className="relative p-6">
                  <button
                    type="button"
                    onClick={() => setIsQuickViewOpen(false)}
                    className="absolute right-4 top-4 rounded-full border border-accent-200 p-1.5 dark:border-slate-700"
                    aria-label="Close quick view"
                  >
                    <X size={16} />
                  </button>

                  <p className="text-xs uppercase tracking-[0.2em] text-accent-600 dark:text-accent-200">Quick View</p>
                  <h3 className="mt-2 font-serifDisplay text-3xl">{product.name}</h3>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{product.shortDescription || product.description}</p>
                  <RatingStars rating={product.rating || 4.3} reviewsCount={product.reviewsCount || 0} className="mt-3" />

                  <div className="mt-5 flex items-center gap-2">
                    <span className="text-xl font-semibold text-accent-600 dark:text-accent-200">{formatINR(finalPrice)}</span>
                    {hasDiscount && <span className="text-sm text-slate-500 line-through">{formatINR(product.price)}</span>}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        addItem(product);
                        setIsQuickViewOpen(false);
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-accent-600 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white"
                    >
                      <ShoppingBag size={14} /> Add to Cart
                    </button>
                    <Link
                      href={`/product/${product.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-accent-400/50 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide"
                      onClick={() => setIsQuickViewOpen(false)}
                    >
                      <Eye size={14} /> Full Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
