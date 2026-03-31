import Link from 'next/link';

const cards = [
  { name: 'Women', desc: 'Lehenga and saree couture', href: '/category/women' },
  { name: 'Men', desc: 'Sherwani and kurta classics', href: '/category/men' },
  { name: 'Kids', desc: 'Festive kids silhouettes', href: '/category/kids' },
];

export default function CollectionsPage() {
  return (
    <div className="luxe-container py-10">
      <h1 className="section-title">Collections</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Curated wardrobes for weddings, festivities, and celebrations.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.name} href={card.href} className="luxe-panel p-6 transition hover:-translate-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-600 dark:text-accent-200">Collection</p>
            <h2 className="mt-2 font-serifDisplay text-3xl">{card.name}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
