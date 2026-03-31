'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProductCard from '../components/product/ProductCard';
import { api } from '../lib/api';

const collectionCards = [
  {
    title: 'Women Couture',
    subtitle: 'Lehenga and Saree',
    href: '/category/women',
    image: 'https://source.unsplash.com/1200x1600/?indian,women,lehenga,designer,fashion',
  },
  {
    title: 'Men Regal',
    subtitle: 'Sherwani and Kurta',
    href: '/category/men',
    image: 'https://source.unsplash.com/1200x1600/?indian,men,sherwani,designer,fashion',
  },
  {
    title: 'Kids Festive',
    subtitle: 'Boys and Girls',
    href: '/category/kids',
    image: 'https://source.unsplash.com/1200x1600/?kids,indian,traditional,fashion',
  },
];

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, featuredData] = await Promise.all([
          api.getProducts({ trending: true, limit: 8, sort: 'popularity' }),
          api.getProducts({ featured: true, limit: 4 }),
        ]);

        setTrending(trendingData.products || []);
        setFeatured(featuredData.products || []);
      } catch (error) {
        setTrending([]);
        setFeatured([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pb-20">
      <section className="luxe-container py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-accent-200/50 bg-gradient-to-br from-accent-100 via-white to-amber-50 p-6 shadow-glow dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:p-10"
        >
          <div className="absolute -right-20 -top-12 h-64 w-64 rounded-full bg-accent-200/40 blur-3xl" />
          <div className="absolute -bottom-20 left-8 h-52 w-52 rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-500/20" />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.15fr,0.85fr]">
            <div>
              <p className="inline-block rounded-full border border-accent-300/50 px-4 py-1 text-xs uppercase tracking-[0.25em] text-accent-600 dark:text-accent-200">
                New Spring Wedding Edit
              </p>
              <h1 className="mt-5 font-serifDisplay text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Luxury Traditional Wear, Designed for Grand Celebrations.
              </h1>
              <p className="mt-4 max-w-xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                Explore handcrafted lehengas, elegant sarees, regal sherwanis, and festive kids wear curated for modern Indian celebrations.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-accent-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-accent-400"
                >
                  Shop Collection <ArrowRight size={16} />
                </Link>
                <Link
                  href="/category/women"
                  className="inline-flex items-center rounded-full border border-accent-500/50 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-600 transition hover:bg-accent-600 hover:text-white dark:text-accent-200"
                >
                  Bridal Edit
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-8 h-24 w-24 rounded-full border border-accent-400/40 bg-accent-100/70" />
              <div className="absolute -bottom-6 -right-5 h-32 w-32 rounded-full border border-accent-400/40 bg-amber-100/70" />
              <div className="relative mx-auto max-w-sm overflow-hidden rounded-[2.2rem] border border-accent-200/60 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <Image
                  src="https://source.unsplash.com/900x1200/?bridal,lehenga,indian,couture"
                  alt="Designer lehenga"
                  width={900}
                  height={1200}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="luxe-container py-6 sm:py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent-600 dark:text-accent-200">Featured Collections</p>
            <h2 className="section-title">Choose Your Style Story</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {collectionCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="group relative h-[380px] overflow-hidden rounded-3xl"
            >
              <Image src={card.image} alt={card.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-accent-200">{card.subtitle}</p>
                <h3 className="mt-1 font-serifDisplay text-2xl">{card.title}</h3>
                <Link href={card.href} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
                  Explore <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="luxe-container py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent-600 dark:text-accent-200">Trending</p>
            <h2 className="section-title">Most Loved Looks</h2>
          </div>
          <Link href="/shop?sort=popularity" className="text-sm font-semibold text-accent-600 dark:text-accent-200">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {trending.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      </section>

      <section className="luxe-container py-8">
        <div className="luxe-panel bg-linen-pattern bg-[size:18px_18px] p-6 sm:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr,1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-accent-600 dark:text-accent-200">The Atelier Experience</p>
              <h2 className="mt-3 font-serifDisplay text-3xl sm:text-4xl">Luxury Craftsmanship for Every Occasion</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Every garment blends heritage textile techniques with contemporary silhouettes. From wedding couture to festival-ready classics, each piece is designed to move beautifully and photograph flawlessly.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex rounded-full bg-accent-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
              >
                Discover Styles
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {featured.slice(0, 4).map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product.slug}`}
                  className="rounded-2xl border border-accent-200/40 bg-white/80 p-4 transition hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900/70"
                >
                  <p className="text-xs uppercase text-accent-600 dark:text-accent-200">{product.subCategory}</p>
                  <h3 className="mt-2 font-semibold">{product.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
