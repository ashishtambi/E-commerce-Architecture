'use client';

const categories = ['', 'women', 'men', 'kids'];
const subCategories = ['', 'Lehenga', 'Saree', 'Sherwani', 'Kurta', 'Boys', 'Girls'];
const genders = ['', 'women', 'men', 'boys', 'girls', 'unisex'];
const sortOptions = [
  { value: '', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popularity', label: 'Popularity' },
];

export default function ProductFilters({ filters, onChange, onReset }) {
  return (
    <div className="rounded-3xl border border-accent-200/40 bg-white/80 p-5 dark:border-slate-700 dark:bg-slate-900/70">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-200">Filters</h3>

      <div className="space-y-4 text-sm">
        <div>
          <label className="mb-1 block">Category</label>
          <select
            value={filters.category || ''}
            onChange={(event) => onChange('category', event.target.value)}
            className="w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
          >
            {categories.map((item) => (
              <option key={item || 'all'} value={item}>
                {item ? item.charAt(0).toUpperCase() + item.slice(1) : 'All'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block">Sub-category</label>
          <select
            value={filters.subCategory || ''}
            onChange={(event) => onChange('subCategory', event.target.value)}
            className="w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
          >
            {subCategories.map((item) => (
              <option key={item || 'all'} value={item}>
                {item || 'All'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block">Gender</label>
          <select
            value={filters.gender || ''}
            onChange={(event) => onChange('gender', event.target.value)}
            className="w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
          >
            {genders.map((item) => (
              <option key={item || 'all'} value={item}>
                {item || 'All'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block">Color</label>
          <input
            value={filters.color || ''}
            onChange={(event) => onChange('color', event.target.value)}
            className="w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
            placeholder="e.g. Maroon"
          />
        </div>

        <div>
          <label className="mb-1 block">Size</label>
          <input
            value={filters.size || ''}
            onChange={(event) => onChange('size', event.target.value)}
            className="w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
            placeholder="e.g. M, 8-9Y"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block">Min Price</label>
            <input
              value={filters.minPrice || ''}
              onChange={(event) => onChange('minPrice', event.target.value)}
              type="number"
              className="w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-1 block">Max Price</label>
            <input
              value={filters.maxPrice || ''}
              onChange={(event) => onChange('maxPrice', event.target.value)}
              type="number"
              className="w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
              placeholder="50000"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block">Sort</label>
          <select
            value={filters.sort || ''}
            onChange={(event) => onChange('sort', event.target.value)}
            className="w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
          >
            {sortOptions.map((item) => (
              <option key={item.value || 'default'} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-5 w-full rounded-xl border border-accent-500 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent-600 transition hover:bg-accent-600 hover:text-white"
      >
        Reset Filters
      </button>
    </div>
  );
}
