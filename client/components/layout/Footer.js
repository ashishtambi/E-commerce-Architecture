import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-accent-200/40 bg-white/60 py-12 dark:border-slate-700 dark:bg-slate-950/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
        <div>
          <h3 className="font-serifDisplay text-2xl text-accent-600 dark:text-accent-200">VastraLuxe</h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Designer Indian wear celebrating craftsmanship, culture, and modern luxury.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-200">Shop</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/category/women">Women</Link>
            <Link href="/category/men">Men</Link>
            <Link href="/category/kids">Kids</Link>
            <Link href="/shop">All Products</Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-200">Support</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <span>Shipping & Returns</span>
            <span>Track Order</span>
            <span>Size Guide</span>
            <span>Care Instructions</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-200">Contact</h4>
          <div className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-300">
            <p>hello@vastraluxe.in</p>
            <p>+91 90000 11223</p>
            <p>Jaipur | Mumbai | Delhi</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
