# Luxe Beauty - E-Commerce Platform

![Luxe Beauty](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwind-css)

Premium cosmetics e-commerce platform with neuromarketing features, built with Next.js 14 and optimized for conversion.

## ✨ Features

### Customer-Facing
- 🎯 **Neuromarketing Optimization**: Scarcity indicators, social proof, urgency triggers
- 💎 **Luxury Design**: Rose gold color palette, smooth animations, premium aesthetics
- 📱 **Mobile-First**: Optimized for thumb-friendly interactions
- ⚡ **Performance**: Next.js 14 with image optimization and lazy loading
- 🛒 **Smart Cart**: Cross-sell recommendations and abandonment recovery

### Admin Dashboard
- 📊 **Neuro-Conversion Metrics**: Revenue, cart abandonment, customer LTV
- 👥 **Role-Based Access Control**: Admin, Logistics, Marketing roles
- ✏️ **Visual CMS**: Click-to-edit content management
- 📈 **Analytics**: Conversion funnel, most viewed products, sales trends
- 🔒 **Secure**: Route protection and permission-based UI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Navigate to project directory
cd "d:\Users\josep\OneDrive\Desktop\Pagina web maquillaje"

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                      # Next.js 14 App Router
│   ├── (customer)/          # Customer-facing pages
│   ├── admin/               # Admin dashboard
│   └── api/                 # API routes
├── components/
│   ├── customer/            # Customer components
│   └── admin/               # Admin components
├── lib/
│   ├── data/                # Product data
│   ├── auth/                # Authentication & RBAC
│   ├── neuromarketing/      # Marketing utilities
│   └── animations.ts        # Framer Motion variants
├── public/                  # Static assets
└── styles/                  # Global styles
```

## 🎨 Design System

### Color Palette
- **Rose Gold** (#E8C4B8): Primary brand color
- **Nude Cream** (#F5F1ED): Background
- **Terracotta** (#D4816F): Accent
- **Deep Charcoal** (#2C2C2C): Text

### Typography
- **Headings**: Cormorant Garamond (serif)
- **Body**: Inter (sans-serif)

## 🔐 User Roles

### Admin
- Full access to all features
- Financial metrics and analytics
- User management

### Logistics
- View and update orders
- Shipping information
- Stock levels (read-only)

### Marketing
- Edit content and banners
- Create promotions
- View analytics
- Update product descriptions

## 📝 Documentation

- [Maintenance Guide](./MAINTENANCE_GUIDE.md) - How to update images, text, and products
- [Implementation Plan](./implementation_plan.md) - Technical architecture details

## 🛠️ Built With

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Language**: TypeScript
- **State Management**: Zustand

## 📦 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms

Build the project first:
```bash
npm run build
```

Then deploy the `.next` folder to your hosting provider.

## 🎯 Neuromarketing Features

- **Scarcity Triggers**: "Only X left" badges
- **Social Proof**: Review counts, "X people viewing"
- **Urgency Indicators**: Limited time offers, trending badges
- **Benefit-Oriented CTAs**: "Transform Your Skin" vs "Buy Now"
- **Trust Signals**: Free shipping, natural ingredients, cruelty-free
- **Cross-Selling**: Smart product recommendations

## 📊 Analytics Tracked

- Total revenue and orders
- Average order value
- Cart abandonment rate
- Customer lifetime value
- Conversion funnel metrics
- Most viewed products
- Repeat purchase rate

## 🔧 Customization

### Adding Products

Edit `lib/data/products.ts` and add your product data.

### Changing Colors

Modify `tailwind.config.ts` color palette.

### Updating Content

Use the Visual CMS at `/admin/content` or edit component files directly.

## 📄 License

This project is proprietary software for Luxe Beauty.

## 🤝 Support

For questions or issues, refer to the [Maintenance Guide](./MAINTENANCE_GUIDE.md).

---

**Luxe Beauty** - Transform Your Natural Radiance ✨
