import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { API_URL, adminApi } from '../api';

const initialForm = {
  name: '',
  description: '',
  shortDescription: '',
  price: '',
  stock: '',
  category: '',
  subCategory: '',
  gender: 'unisex',
  sizes: 'S,M,L',
  colors: 'Maroon:#6d102f,Gold:#c89b3c',
  images: [],
  material: '',
  featured: false,
  trending: false,
};

const parseSizes = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const parseColors = (value) =>
  value
    .split(',')
    .map((item) => {
      const [name, hex] = item.split(':').map((part) => part.trim());
      if (!name) return null;
      return { name, hex: hex || '#000000' };
    })
    .filter(Boolean);

const toAbsoluteUpload = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL.replace('/api', '')}${path}`;
};

const toUploadPath = (value) => {
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      return new URL(value).pathname;
    } catch (error) {
      return '';
    }
  }

  return value;
};

const isLocalUpload = (value) => toUploadPath(value).startsWith('/uploads/');

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    subCategories: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [pendingPreviews, setPendingPreviews] = useState([]);

  const selectedCategory = useMemo(
    () => categories.find((item) => item._id === form.category),
    [categories, form.category]
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        adminApi.products({ limit: 100, sort: 'oldest' }),
        adminApi.categories(),
      ]);

      setProducts(productsResponse.data.products || []);
      setCategories(categoriesResponse.data.categories || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData().catch(() => setStatus('Unable to load products.'));
  }, []);

  useEffect(
    () => () => {
      pendingPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    },
    [pendingPreviews]
  );

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setPendingPreviews([]);
    setUploadProgress(0);
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus('');

    if (!selectedCategory) {
      setStatus('Please choose a category.');
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      shortDescription: form.shortDescription,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      categoryName: selectedCategory.name,
      subCategory: form.subCategory,
      gender: form.gender,
      sizes: parseSizes(form.sizes),
      colors: parseColors(form.colors),
      images: form.images,
      material: form.material,
      featured: form.featured,
      trending: form.trending,
    };

    if (!payload.images.length) {
      setStatus('At least one image URL is required.');
      return;
    }

    try {
      if (editingId) {
        await adminApi.updateProduct(editingId, payload);
        setStatus('Product updated successfully.');
      } else {
        await adminApi.createProduct(payload);
        setStatus('Product added successfully.');
      }

      resetForm();
      await fetchData();
    } catch (error) {
      setStatus(error.response?.data?.message || error.message || 'Save failed');
    }
  };

  const beginEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription || '',
      price: product.price,
      stock: product.stock,
      category: product.category?._id || product.category,
      subCategory: product.subCategory,
      gender: product.gender,
      sizes: (product.sizes || []).join(','),
      colors: (product.colors || []).map((color) => `${color.name}:${color.hex}`).join(','),
      images: product.images || [],
      material: product.material || '',
      featured: Boolean(product.featured),
      trending: Boolean(product.trending),
    });
  };

  const removeProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await adminApi.deleteProduct(productId);
      setStatus('Product deleted.');
      await fetchData();
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to delete product.');
    }
  };

  const uploadImageFiles = async (fileList, { replaceExisting = false } = {}) => {
    const files = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'));
    if (!files.length) {
      setStatus('Please choose image files only.');
      return;
    }

    const nextPreviews = files.map((file) => URL.createObjectURL(file));
    setPendingPreviews(nextPreviews);

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    try {
      setUploading(true);
      setUploadProgress(0);

      const response = await adminApi.uploadImages(formData, setUploadProgress);
      const uploadedFiles = response.data.files || (response.data.file ? [response.data.file] : []);
      const imagePaths = uploadedFiles.map((item) => toAbsoluteUpload(item.path)).filter(Boolean);

      setForm((prev) => ({
        ...prev,
        images: replaceExisting ? imagePaths : [...prev.images, ...imagePaths],
      }));
      setStatus(`Uploaded ${imagePaths.length} image${imagePaths.length === 1 ? '' : 's'} successfully.`);
    } catch (error) {
      setStatus(error.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      nextPreviews.forEach((preview) => URL.revokeObjectURL(preview));
      setPendingPreviews([]);
    }
  };

  const onFileInputChange = async (event) => {
    const selectedFiles = event.target.files;
    await uploadImageFiles(selectedFiles);
    event.target.value = '';
  };

  const onDropImages = async (event) => {
    event.preventDefault();
    setDragActive(false);
    await uploadImageFiles(event.dataTransfer.files);
  };

  const removeImageAt = async (imageIndex) => {
    const imagePath = form.images[imageIndex];
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imageIndex),
    }));

    if (!isLocalUpload(imagePath)) return;

    try {
      await adminApi.deleteUploadedImage(toUploadPath(imagePath));
    } catch (error) {
      setStatus('Image removed from product, but server cleanup failed.');
    }
  };

  const clearImageList = () => {
    setForm((prev) => ({ ...prev, images: [] }));
  };

  const createCategory = async (event) => {
    event.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      setStatus('Category name and slug are required.');
      return;
    }

    try {
      await adminApi.createCategory({
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description,
        subCategories: newCategory.subCategories
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setStatus('Category added successfully.');
      setNewCategory({ name: '', slug: '', description: '', subCategories: '' });
      await fetchData();
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to create category.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-amber-200 bg-white p-5">
        <h2 className="mb-4 font-display text-3xl">Add Category</h2>
        <form onSubmit={createCategory} className="grid gap-4 lg:grid-cols-2">
          <Field label="Category Name">
            <input
              value={newCategory.name}
              onChange={(event) => setNewCategory((prev) => ({ ...prev, name: event.target.value }))}
              className="input"
              placeholder="Women"
            />
          </Field>
          <Field label="Slug">
            <input
              value={newCategory.slug}
              onChange={(event) => setNewCategory((prev) => ({ ...prev, slug: event.target.value.toLowerCase() }))}
              className="input"
              placeholder="women"
            />
          </Field>
          <Field label="Sub Categories">
            <input
              value={newCategory.subCategories}
              onChange={(event) => setNewCategory((prev) => ({ ...prev, subCategories: event.target.value }))}
              className="input"
              placeholder="Lehenga,Saree"
            />
          </Field>
          <Field label="Description">
            <input
              value={newCategory.description}
              onChange={(event) => setNewCategory((prev) => ({ ...prev, description: event.target.value }))}
              className="input"
              placeholder="Category description"
            />
          </Field>
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full border border-amber-300 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-amber-700"
            >
              <Plus size={14} /> Add Category
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-3xl">{editingId ? 'Edit Product' : 'Add Product'}</h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-full border border-amber-300 px-4 py-1 text-xs font-semibold uppercase">
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={submit} className="grid gap-4 lg:grid-cols-2">
          <Field label="Product Name">
            <input required value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} className="input" />
          </Field>

          <Field label="Category">
            <select required value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} className="input">
              <option value="">Select</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Sub Category">
            <input required value={form.subCategory} onChange={(event) => setForm((prev) => ({ ...prev, subCategory: event.target.value }))} className="input" placeholder="Lehenga / Kurta" />
          </Field>

          <Field label="Gender">
            <select value={form.gender} onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))} className="input">
              <option value="women">women</option>
              <option value="men">men</option>
              <option value="boys">boys</option>
              <option value="girls">girls</option>
              <option value="unisex">unisex</option>
            </select>
          </Field>

          <Field label="Price (INR)">
            <input type="number" required value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} className="input" />
          </Field>

          <Field label="Stock">
            <input type="number" required value={form.stock} onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))} className="input" />
          </Field>

          <Field label="Sizes (comma separated)">
            <input value={form.sizes} onChange={(event) => setForm((prev) => ({ ...prev, sizes: event.target.value }))} className="input" placeholder="S,M,L,XL" />
          </Field>

          <Field label="Colors (Name:Hex)">
            <input value={form.colors} onChange={(event) => setForm((prev) => ({ ...prev, colors: event.target.value }))} className="input" placeholder="Maroon:#6d102f,Gold:#c89b3c" />
          </Field>

          <Field label="Product Images">
            <div
              onDrop={onDropImages}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              className={`rounded-2xl border-2 border-dashed p-4 transition ${
                dragActive ? 'border-amber-500 bg-amber-50' : 'border-amber-300 bg-amber-50/40'
              }`}
            >
              <p className="text-sm text-slate-700">Drag & drop images here, or choose multiple files.</p>
              <p className="mt-1 text-xs text-slate-500">Supports JPG/PNG/WebP up to 5MB each.</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-amber-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                  <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload images'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={onFileInputChange}
                    disabled={uploading}
                  />
                </label>
                <button
                  type="button"
                  onClick={clearImageList}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  Replace Existing
                </button>
              </div>

              {uploading && (
                <div className="mt-3">
                  <div className="h-2 overflow-hidden rounded-full bg-amber-100">
                    <div
                      className="h-full bg-amber-500 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-600">Uploading... {uploadProgress}%</p>
                </div>
              )}
            </div>

            {pendingPreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {pendingPreviews.map((preview) => (
                  <div key={preview} className="overflow-hidden rounded-xl border border-amber-200">
                    <img src={preview} alt="Uploading preview" className="aspect-square w-full object-cover opacity-70" />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {form.images.map((image, index) => (
                <div key={`${image}-${index}`} className="relative overflow-hidden rounded-xl border border-amber-200">
                  <img src={image} alt={`Product image ${index + 1}`} className="aspect-square w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImageAt(index)}
                    className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white"
                    aria-label="Remove image"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </Field>

          <Field label="Material">
            <input value={form.material} onChange={(event) => setForm((prev) => ({ ...prev, material: event.target.value }))} className="input" />
          </Field>

          <Field label="Description" wide>
            <textarea required value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} className="input min-h-24" />
          </Field>

          <Field label="Short Description" wide>
            <textarea value={form.shortDescription} onChange={(event) => setForm((prev) => ({ ...prev, shortDescription: event.target.value }))} className="input min-h-16" />
          </Field>

          <div className="flex items-center gap-6 lg:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))} />
              Featured
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.trending} onChange={(event) => setForm((prev) => ({ ...prev, trending: event.target.checked }))} />
              Trending
            </label>
          </div>

          <div className="lg:col-span-2">
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-amber-700 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white">
              <Plus size={15} /> {editingId ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>

        {status && <p className="mt-4 rounded-xl bg-amber-100 px-3 py-2 text-sm text-amber-800">{status}</p>}
      </section>

      <section className="rounded-2xl border border-amber-200 bg-white p-5">
        <h2 className="mb-4 font-display text-3xl">Manage Products</h2>

        {loading ? (
          <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-amber-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Category</th>
                  <th className="px-2 py-2">Price</th>
                  <th className="px-2 py-2">Stock</th>
                  <th className="px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-amber-100">
                    <td className="px-2 py-2">{product.name}</td>
                    <td className="px-2 py-2">{product.categoryName}</td>
                    <td className="px-2 py-2">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="px-2 py-2">{product.stock}</td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => beginEdit(product)} className="rounded-full border border-amber-300 p-2 text-amber-700">
                          <Pencil size={14} />
                        </button>
                        <button type="button" onClick={() => removeProduct(product._id)} className="rounded-full border border-red-300 p-2 text-red-600">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, children, wide = false }) {
  return (
    <label className={`text-sm ${wide ? 'lg:col-span-2' : ''}`}>
      <span className="mb-1 block text-slate-600">{label}</span>
      {children}
    </label>
  );
}
