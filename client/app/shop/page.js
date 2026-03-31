'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import ProductFilters from '../../components/product/ProductFilters';
import { api } from '../../lib/api';

const baseFilters = {
  search: '',
  category: '',
  subCategory: '',
  gender: '',
  size: '',
  color: '',
  minPrice: '',
  maxPrice: '',
  sort: '',
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="luxe-container py-10">
          <div className="h-[390px] animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(baseFilters);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const paramsObject = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      ...baseFilters,
      ...paramsObject,
    }));
  }, [paramsObject]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const data = await api.getProducts({ ...filters, limit: 12 });
        setProducts(data.products || []);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const updateFilter = (key, value) => {
    const next = {
      ...filters,
      [key]: value,
    };

    setFilters(next);

    const params = new URLSearchParams();
    Object.entries(next).forEach(([paramKey, paramValue]) => {
      if (paramValue) params.set(paramKey, paramValue);
    });

    router.replace(`/shop?${params.toString()}`);
  };

  const resetFilters = () => {
    setFilters(baseFilters);
    router.replace('/shop');
  };

  return (
    <div className="luxe-container py-10">
      <div className="mb-7">
        <p className="text-xs uppercase tracking-[0.2em] text-accent-600 dark:text-accent-200">Designer Edit</p>
        <h1 className="section-title">All Products</h1>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-accent-400/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide lg:hidden"
        >
          <SlidersHorizontal size={14} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className={`${showFilters ? 'block' : 'hidden'} mb-6 lg:block`}>
        <ProductFilters filters={filters} onChange={updateFilter} onReset={resetFilters} />
      </div>

      <div>
        <div>
          <div className="mb-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
            <span>
              {pagination.total} product{pagination.total === 1 ? '' : 's'} found
            </span>
            {filters.search && (
              <span>
                Search: <strong>{filters.search}</strong>
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[390px] animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="luxe-panel p-10 text-center">
              <h2 className="font-serifDisplay text-2xl">No products matched these filters.</h2>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 rounded-full border border-accent-500 px-5 py-2 text-sm font-semibold text-accent-600"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
