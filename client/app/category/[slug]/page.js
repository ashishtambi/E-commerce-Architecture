'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '../../../components/product/ProductCard';
import { api } from '../../../lib/api';

const heroCopy = {
  women: {
    title: 'Women Collection',
    subtitle: 'Lehenga and Saree edits curated for celebrations.',
  },
  men: {
    title: 'Men Collection',
    subtitle: 'Regal sherwani and kurta styles with modern tailoring.',
  },
  kids: {
    title: 'Kids Collection',
    subtitle: 'Festive yet comfortable traditional wear for children.',
  },
};

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts({ category: slug, limit: 24, sort: 'popularity' });
        setProducts(data.products || []);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCategoryProducts();
  }, [slug]);

  const content = heroCopy[slug] || {
    title: 'Collection',
    subtitle: 'Explore handcrafted designs.',
  };

  return (
    <div className="luxe-container py-10">
      <div className="luxe-panel mb-8 bg-gradient-to-r from-accent-100/80 to-white p-6 dark:from-slate-800 dark:to-slate-900">
        <p className="text-xs uppercase tracking-[0.24em] text-accent-600 dark:text-accent-200">Category</p>
        <h1 className="mt-2 font-serifDisplay text-4xl">{content.title}</h1>
        <p className="mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300">{content.subtitle}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-[390px] animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
