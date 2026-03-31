'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/category/women', label: 'Women' },
  { href: '/category/men', label: 'Men' },
  { href: '/category/kids', label: 'Kids' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();

  const handleSearch = (event) => {
    event.preventDefault();
    router.push(`/shop?search=${encodeURIComponent(search)}`);
    setSearch('');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-accent-200/40 bg-canvas-light/95 backdrop-blur dark:border-slate-700 dark:bg-canvas-dark/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          className="rounded-md border border-accent-400/40 p-2 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link href="/" className="font-serifDisplay text-2xl tracking-wide text-accent-600 dark:text-accent-200">
          VastraLuxe
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition hover:text-accent-600 dark:hover:text-accent-200 ${
                pathname === item.href ? 'text-accent-600 dark:text-accent-200' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <form onSubmit={handleSearch} className="hidden items-center rounded-full border border-accent-400/30 px-3 py-1.5 sm:flex">
            <Search size={16} className="text-accent-600 dark:text-accent-200" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="ml-2 w-36 bg-transparent text-sm outline-none"
              placeholder="Search lehenga..."
            />
          </form>

          <ThemeToggle />

          <Link href="/wishlist" className="relative rounded-full border border-accent-400/40 p-2">
            <Heart size={18} />
            <span className="absolute -right-1 -top-1 rounded-full bg-accent-600 px-1.5 text-[10px] text-white">
              {wishlist.length}
            </span>
          </Link>

          <Link href="/cart" className="relative rounded-full border border-accent-400/40 p-2">
            <ShoppingBag size={18} />
            <span className="absolute -right-1 -top-1 rounded-full bg-accent-600 px-1.5 text-[10px] text-white">
              {itemCount}
            </span>
          </Link>

          <Link href={user ? '/account' : '/login'} className="rounded-full border border-accent-400/40 p-2">
            <User size={18} />
          </Link>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-accent-200/30 px-4 py-4 md:hidden dark:border-slate-700">
          <form onSubmit={handleSearch} className="mb-4 flex items-center rounded-full border border-accent-400/30 px-3 py-2">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="ml-2 w-full bg-transparent text-sm outline-none"
              placeholder="Search products"
            />
          </form>

          <div className="flex flex-col gap-3 text-sm">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}
            {user ? (
              <button
                type="button"
                className="rounded-md border border-accent-400/40 px-3 py-2 text-left"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
              >
                Logout
              </button>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
