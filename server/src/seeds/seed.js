require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const logger = require('../config/logger');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const slugify = require('../utils/slugify');
const { categories, productSeeds } = require('./seedData');

const palette = [
  ['#3f1f2a', '#c89b3c'],
  ['#1e3a8a', '#bfdbfe'],
  ['#7f1d1d', '#f8f4e8'],
  ['#0f766e', '#fef3c7'],
  ['#14532d', '#f5e7c3'],
];

const escapeXml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const createPlaceholderSvg = (title, bg, accent) => {
  const safeTitle = escapeXml(title);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="${accent}"/>
    </linearGradient>
  </defs>
  <rect width="900" height="1200" fill="url(#bg)"/>
  <circle cx="710" cy="260" r="170" fill="rgba(255,255,255,0.16)"/>
  <circle cx="210" cy="930" r="240" fill="rgba(255,255,255,0.14)"/>
  <text x="90" y="150" font-family="serif" font-size="58" fill="#ffffff" opacity="0.95">VastraLuxe</text>
  <text x="90" y="860" font-family="sans-serif" font-size="44" fill="#ffffff" opacity="0.96">${safeTitle}</text>
  <text x="90" y="915" font-family="sans-serif" font-size="28" fill="#ffffff" opacity="0.88">Handcrafted traditional wear</text>
</svg>`;
};

const ensureSeedPlaceholders = (uploadDir, products) => {
  const seedDir = path.join(uploadDir, 'seed');
  fs.mkdirSync(seedDir, { recursive: true });

  return products.map((product, index) => {
    const slug = slugify(product.name);
    const [bg, accent] = palette[index % palette.length];
    const imageFiles = [`${slug}-1.svg`, `${slug}-2.svg`];

    imageFiles.forEach((file, variantIndex) => {
      const filePath = path.join(seedDir, file);
      if (!fs.existsSync(filePath)) {
        const svg = createPlaceholderSvg(
          `${product.name}${variantIndex === 0 ? '' : ' - Detail View'}`,
          bg,
          accent
        );
        fs.writeFileSync(filePath, svg, 'utf8');
      }
    });

    return imageFiles.map((file) => `/uploads/seed/${file}`);
  });
};

const appendQuery = (url, query) => `${url}${url.includes('?') ? '&' : '?'}${query}`;

const optimizeUnsplash = (url, extraQuery = '') =>
  appendQuery(
    url,
    `auto=format&fit=crop&w=900&h=1200&q=80${extraQuery ? `&${extraQuery}` : ''}`
  );

const optimizePexels = (url, extraQuery = '') =>
  appendQuery(
    url,
    `auto=compress&cs=tinysrgb&w=900&h=1200&dpr=1${extraQuery ? `&${extraQuery}` : ''}`
  );

const sampleImageUrlsBySubCategory = {
  Lehenga: [
    optimizeUnsplash('https://images.unsplash.com/photo-1593032465171-8c5c6c1f9b3e'),
    optimizePexels('https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg'),
  ],
  Saree: [
    optimizeUnsplash('https://images.unsplash.com/photo-1610030469983-98e550d6193c'),
    optimizePexels('https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg'),
  ],
  Kurta: [
    optimizeUnsplash('https://images.unsplash.com/photo-1603252109303-2751441dd157'),
    optimizePexels('https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg'),
  ],
  Sherwani: [
    optimizeUnsplash('https://images.unsplash.com/photo-1621285853634-713b8dd6e2c3'),
    optimizeUnsplash('https://source.unsplash.com/900x1200/?indian,sherwani,wedding,men,traditional'),
  ],
  Boys: [
    optimizePexels('https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg'),
    optimizeUnsplash('https://source.unsplash.com/900x1200/?kids,traditional,indian,ethnic,boy'),
  ],
  Girls: [
    optimizePexels('https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg', 'sat=8'),
    optimizeUnsplash('https://source.unsplash.com/900x1200/?kids,traditional,indian,ethnic,girl'),
  ],
};

const buildRealImageSets = (products) =>
  products.map((product, index) => {
    const imageSet =
      sampleImageUrlsBySubCategory[product.subCategory] || sampleImageUrlsBySubCategory.Kurta;

    const first = imageSet[index % imageSet.length];
    const second = imageSet[(index + 1) % imageSet.length] || imageSet[0];

    return [first, second];
  });

const seed = async () => {
  await connectDB();

  const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
  fs.mkdirSync(uploadDir, { recursive: true });
  const fallbackImageSets = ensureSeedPlaceholders(uploadDir, productSeeds);
  const realImageSets = buildRealImageSets(productSeeds);

  await Promise.all([Category.deleteMany({}), Product.deleteMany({}), User.deleteMany({}), Order.deleteMany({})]);

  const createdCategories = await Category.insertMany(categories);

  const categoryMap = createdCategories.reduce((acc, category) => {
    acc[category.name] = category._id;
    return acc;
  }, {});

  const productsPayload = productSeeds.map((product, index) => {
    const slug = slugify(product.name);
    const discountPercent = 10 + (index % 4) * 5;
    const discountedPrice = Math.round(product.price * ((100 - discountPercent) / 100));
    const rating = Number((4.1 + (index % 8) * 0.1).toFixed(1));
    const reviewsCount = 48 + index * 7;

    return {
      ...product,
      slug,
      category: categoryMap[product.categoryName],
      discountedPrice,
      rating,
      reviewsCount,
      images: [...realImageSets[index], fallbackImageSets[index][0]],
      seoTitle: `${product.name} | VastraLuxe`,
      seoDescription: product.shortDescription || product.description,
    };
  });

  const products = await Product.insertMany(productsPayload);

  const adminUser = await User.create({
    name: 'VastraLuxe Admin',
    email: 'admin@vastraluxe.com',
    password: 'Admin@123',
    role: 'admin',
    phone: '+91 9876543210',
  });

  const customerUser = await User.create({
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    password: 'Customer@123',
    role: 'customer',
    phone: '+91 9123456780',
    wishlist: [products[0]._id, products[4]._id, products[10]._id],
    cart: [
      {
        product: products[2]._id,
        quantity: 1,
        size: 'M',
        color: 'Coral',
      },
      {
        product: products[15]._id,
        quantity: 2,
        size: '8-9Y',
        color: 'Peach',
      },
    ],
  });

  await Order.insertMany([
    {
      user: customerUser._id,
      items: [
        {
          product: products[0]._id,
          name: products[0].name,
          image: products[0].images[0],
          price: products[0].price,
          quantity: 1,
          size: 'M',
          color: 'Maroon',
        },
      ],
      shippingAddress: {
        fullName: 'Aarav Sharma',
        phone: '+91 9123456780',
        address: '12 Designer Street',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
        country: 'India',
      },
      paymentMethod: 'dummy_gateway',
      paymentStatus: 'paid',
      totalAmount: products[0].price,
      status: 'delivered',
    },
    {
      user: customerUser._id,
      items: [
        {
          product: products[9]._id,
          name: products[9].name,
          image: products[9].images[0],
          price: products[9].price,
          quantity: 1,
          size: 'L',
          color: 'Ivory',
        },
      ],
      shippingAddress: {
        fullName: 'Aarav Sharma',
        phone: '+91 9123456780',
        address: '12 Designer Street',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
        country: 'India',
      },
      paymentMethod: 'dummy_gateway',
      paymentStatus: 'paid',
      totalAmount: products[9].price,
      status: 'processing',
    },
  ]);

  logger.info('Seed complete');
  logger.info(`Categories: ${createdCategories.length}`);
  logger.info(`Products: ${products.length}`);
  logger.info('Admin credentials: admin@vastraluxe.com / Admin@123');
  logger.info('Customer credentials: aarav@example.com / Customer@123');

  process.exit(0);
};

seed().catch((error) => {
  logger.error(`Seed failed: ${error.message}`);
  process.exit(1);
});
