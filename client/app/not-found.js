import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="luxe-container py-24 text-center">
      <h1 className="font-serifDisplay text-5xl">404</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">This page was draped away from our runway.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-accent-600 px-6 py-3 text-sm font-semibold text-white">
        Back to Home
      </Link>
    </div>
  );
}
