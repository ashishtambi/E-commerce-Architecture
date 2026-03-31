'use client';

import { Heart, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Product3DPreview from '../../../components/product/Product3DPreview';
import { api, resolveImageUrl } from '../../../lib/api';
import { formatINR } from '../../../lib/format';
import { useCart } from '../../../contexts/CartContext';
import { useWishlist } from '../../../contexts/WishlistContext';
import ProductImage from '../../../components/ui/ProductImage';
import RatingStars from '../../../components/ui/RatingStars';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProduct(slug);
        const item = data.product;
        setProduct(item);
        setSelectedImage(item.images?.[0] || '');
        setSelectedSize(item.sizes?.[0] || 'M');
        setSelectedColor(item.colors?.[0]?.name || 'Default');
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const activeHex = useMemo(() => {
    return product?.colors?.find((color) => color.name === selectedColor)?.hex || '#c89b3c';
  }, [product, selectedColor]);

  const hasDiscount = Boolean(
    product?.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price
  );
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  if (loading) {
    return (
      <div className="luxe-container py-10">
        <div className="h-[520px] animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="luxe-container py-16">
        <div className="luxe-panel p-10 text-center">
          <h1 className="font-serifDisplay text-3xl">Product not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="luxe-container py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr,1fr]">
        <div>
          <div className="relative h-[520px] overflow-hidden rounded-3xl border border-accent-200/50 bg-white dark:border-slate-700 dark:bg-slate-900">
            <ProductImage
              src={resolveImageUrl(selectedImage || product.images[0])}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition duration-700 hover:scale-110"
            />
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`relative aspect-[3/4] overflow-hidden rounded-xl border ${
                  selectedImage === image ? 'border-accent-600' : 'border-accent-200/40 dark:border-slate-700'
                }`}
              >
                <ProductImage
                  src={resolveImageUrl(image)}
                  alt={product.name}
                  fill
                  sizes="25vw"
                  className="object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent-600 dark:text-accent-200">{product.subCategory}</p>
            <h1 className="mt-2 font-serifDisplay text-4xl">{product.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <RatingStars rating={product.rating || 4.4} reviewsCount={product.reviewsCount || 0} />
              {hasDiscount && (
                <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {discountPercent}% off
                </span>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{product.description}</p>
          </div>

          <div className="flex items-center gap-3 text-2xl font-semibold text-accent-600 dark:text-accent-200">
            <span>{formatINR(hasDiscount ? product.discountedPrice : product.price)}</span>
            {hasDiscount && <span className="text-sm text-slate-500 line-through">{formatINR(product.price)}</span>}
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-4 py-1.5 text-sm ${
                    selectedSize === size
                      ? 'border-accent-600 bg-accent-600 text-white'
                      : 'border-accent-300/50 dark:border-slate-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Select Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm ${
                    selectedColor === color.name
                      ? 'border-accent-600 bg-accent-100 text-accent-700 dark:bg-slate-800 dark:text-accent-200'
                      : 'border-accent-300/50 dark:border-slate-600'
                  }`}
                >
                  <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: color.hex }} />
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addItem(product, { size: selectedSize, color: selectedColor })}
              className="inline-flex items-center gap-2 rounded-full bg-accent-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-accent-400"
            >
              <ShoppingBag size={16} /> Add to Cart
            </button>
            <button
              type="button"
              onClick={() => toggle(product)}
              className="inline-flex items-center gap-2 rounded-full border border-accent-500/60 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-600 transition hover:bg-accent-600 hover:text-white dark:text-accent-200"
            >
              <Heart size={16} fill={isWishlisted(product._id) ? 'currentColor' : 'none'} />
              Wishlist
            </button>
          </div>

          <div className="luxe-panel p-4 text-sm text-slate-600 dark:text-slate-300">
            <p>
              <strong>Material:</strong> {product.material}
            </p>
            <p className="mt-1">
              <strong>Care:</strong> {product.care}
            </p>
            <p className="mt-1">
              <strong>Stock:</strong> {product.stock} pieces left
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-serifDisplay text-3xl">3D Preview</h2>
        <Product3DPreview color={activeHex} />
      </div>
    </div>
  );
}
