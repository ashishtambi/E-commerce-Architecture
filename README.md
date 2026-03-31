# VastraLuxe - Full-Stack Designer Indian Wear eCommerce

VastraLuxe is a complete eCommerce platform for premium traditional Indian fashion.
It includes:

- **Customer Frontend** (`/client`) - Next.js + Tailwind + Framer Motion + Three.js preview
- **Backend API** (`/server`) - Node.js + Express + MongoDB + JWT auth
- **Admin Panel** (`/admin`) - React + Tailwind + Chart.js dashboard

## Features

### Customer Website
- Premium responsive UI with dark/light mode
- Homepage hero, featured collections, trending products
- Category pages: Women, Men, Kids
- Product listing with filters + sorting + search
- Product cards with real Unsplash fashion imagery, ratings, discount badges, hover image swap, and quick view
- Product detail with image gallery, zoom effect, size/color selection
- **3D product preview** (interactive Three.js model)
- Cart, wishlist, checkout (dummy payment flow)
- Account page with profile + order history
- SEO essentials (`metadata`, `robots`, `sitemap`)
- Lazy-loaded images with `next/image`

### Backend API
- JWT signup/login/auth guard
- Models: Users, Products, Categories, Orders
- Product CRUD, category CRUD
- Cart + wishlist handling
- Order placement + order status updates
- Admin stats for dashboard analytics
- Image upload via `multer` (local upload storage)
- Validation + centralized error handling + logging

### Admin Dashboard
- Admin login
- Dashboard metrics: users, orders, revenue, products
- Analytics charts (Bar + Doughnut using Chart.js)
- Product management: add/edit/delete, image upload, category assignment
- Drag-and-drop multi-image uploads with preview, progress, replace, and per-image delete
- Category creation form
- Order management with status updates
- User management table

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Framer Motion, Three.js (`@react-three/fiber`, `@react-three/drei`)
- **Backend:** Node.js, Express.js, Mongoose, JWT, Multer, Winston
- **Database:** MongoDB
- **Admin:** React + Vite + Tailwind + Chart.js
- **Deployment:** Docker + docker-compose (AWS-ready container layout)

## Project Structure

```bash
/client   # Customer-facing Next.js app
/server   # Express API + MongoDB models + seed data
/admin    # Admin dashboard (React + Vite)
/docs     # Preview/screenshot descriptions
```

## Quick Start (Local)

## 1) Clone and setup env

```bash
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env.local
cp admin/.env.example admin/.env
```

Set at least:

- `MONGODB_URI`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `VITE_API_URL`
- Optional host port overrides: `CLIENT_PORT`, `ADMIN_PORT`, `SERVER_PORT`, `MONGO_PORT`

## 2) Install dependencies

```bash
cd server && npm install
cd ../client && npm install
cd ../admin && npm install
```

## 3) Run MongoDB

Use local MongoDB instance or Docker Mongo:

```bash
docker run -d --name vastraluxe-mongo -p 27017:27017 mongo:7.0
```

## 4) Seed sample data (23 products)

```bash
cd server
npm run seed
```

Seeded credentials:

- **Admin:** `admin@vastraluxe.com` / `Admin@123`
- **Customer:** `aarav@example.com` / `Customer@123`

## 5) Start all apps

Terminal 1:
```bash
cd server
npm run dev
```

Terminal 2:
```bash
cd client
npm run dev
```

Terminal 3:
```bash
cd admin
npm run dev
```

Apps:

- Customer site: `http://localhost:3000`
- API: `http://localhost:5000/api`
- Admin: `http://localhost:5173`

## Docker Deployment

Run full stack with one command:

```bash
cp .env.example .env
docker compose up --build
```

Services:

- `mongo` -> `localhost:${MONGO_PORT:-27017}`
- `server` -> `localhost:${SERVER_PORT:-5000}`
- `client` -> `localhost:${CLIENT_PORT:-3000}`
- `admin` -> `localhost:${ADMIN_PORT:-5173}`

To seed data in Docker API container:

```bash
docker compose exec server node src/seeds/seed.js
```

## Sample API Routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Catalog
- `GET /api/categories`
- `GET /api/products`
- `GET /api/products/:idOrSlug`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

### Cart / Wishlist
- `GET /api/users/cart`
- `POST /api/users/cart`
- `PUT /api/users/cart/:productId`
- `DELETE /api/users/cart/:productId`
- `GET /api/users/wishlist`
- `PATCH /api/users/wishlist/:productId`

### Orders
- `POST /api/orders`
- `GET /api/orders/mine`
- `GET /api/orders/admin/all` (admin)
- `PATCH /api/orders/admin/:id/status` (admin)

### Admin
- `GET /api/admin/stats`
- `GET /api/users/admin/all`

## Example API Query

```bash
curl "http://localhost:5000/api/products?category=women&subCategory=Lehenga&sort=popularity&minPrice=10000&maxPrice=50000"
```

## AWS Deployment Notes

- Containerize all services with provided Dockerfiles
- Use **ECR + ECS/Fargate** (or EC2 + docker-compose)
- Use **DocumentDB/Atlas** for managed MongoDB
- Put `client` and `admin` behind ALB/CloudFront
- Store secrets in AWS Secrets Manager / SSM Parameter Store

## Preview Descriptions

See `docs/PREVIEW.md` for UI preview walkthrough and screen-by-screen descriptions.
