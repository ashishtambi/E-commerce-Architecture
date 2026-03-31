# UI Preview Descriptions

Since static screenshots are not bundled in this repository, below is a screen-by-screen preview description to help validate the implemented UX.

## Customer Frontend (`http://localhost:3000`)

1. **Homepage**
   - Large luxury hero with gradient glow background, couture image card, and CTA buttons.
   - Animated collection cards (Women, Men, Kids) with real fashion imagery from Unsplash.
   - Trending products grid with discount badges, ratings, hover image swap, quick view, and wishlist/cart actions.

2. **Shop Page**
   - Left filter panel for price, size, color, category, gender, and sorting.
   - Mobile filter toggle with responsive grid: 1 column (mobile), 2 (tablet), 4 (desktop).
   - Premium product cards with realistic imagery, hover transitions, and lazy-loaded media.

3. **Product Detail Page**
   - Large zoomable primary image + thumbnail gallery.
   - Size/color selectors and add-to-cart/wishlist controls.
   - Interactive **3D preview** section using Three.js canvas (drag to rotate).

4. **Cart / Checkout / Account**
   - Cart with quantity controls, remove item, and total summary.
   - Checkout form with dummy payment choices and order placement flow.
   - Account page showing profile summary and order history.

5. **Theme Support**
   - Dark/light mode toggle in header with persistent theme preference.

## Admin Panel (`http://localhost:5173`)

1. **Login**
   - Dedicated admin authentication page.

2. **Dashboard**
   - KPI cards: total orders, customers, products, revenue.
   - Chart.js graphs: revenue trend + order status distribution.

3. **Products Management**
   - Add/edit product form including category, stock, price, sizes, colors, and images.
   - Drag-and-drop multi-image upload with progress bar and preview before save.
   - Replace image set and delete individual images directly in the form.
   - Product table with edit and delete actions.

4. **Orders Management**
   - Orders table with customer info and line items.
   - Inline status update dropdown.

5. **Users Management**
   - User list with role, contact details, and join date.
