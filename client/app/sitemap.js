const baseUrl = 'http://localhost:3000';

export default function sitemap() {
  const routes = ['/', '/shop', '/category/women', '/category/men', '/category/kids', '/cart', '/checkout', '/account', '/wishlist'];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
