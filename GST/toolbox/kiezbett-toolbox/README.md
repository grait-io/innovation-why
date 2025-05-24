# Order Management System

A modern order management system built with React, TypeScript, and Supabase, featuring secure deep link access for mobile-friendly order viewing.

## Features

### 🛍️ Order Management
- Complete order overview and management
- Real-time order status updates
- Customer information and order details
- Mobile-responsive interface

### 🔗 Deep Link System
- **Single Order Access**: Generate secure links for specific orders
- **Global Development Tokens**: Access all orders via a single token (development only)
- **Mobile-Optimized**: Responsive design for all screen sizes
- **Secure**: Token-based access with expiration and revocation
- **No Authentication Required**: Perfect for sharing with customers or external parties

### 📱 Mobile-First Design
- Touch-friendly interface
- Optimized for small screens
- Fast loading times
- Offline-capable design

## Quick Start

### Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd toolbox
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Configure your Supabase credentials
   ```

3. **Database Setup**
   ```bash
   # Run migrations
   supabase db push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Generate Development Token

#### Quick Method
```bash
node scripts/generate-dev-token.js
```

#### Via Admin Interface
1. Navigate to **Settings** → **Development Tools**
2. Click **Global Dev Token**
3. Set expiration (default: 30 days)
4. Click **Generate Global Token**
5. Copy the generated link

## Deep Link Usage

### Single Order Access
```
https://your-domain.com/public/order/{token}
```
- Perfect for sharing specific order details
- Customer-friendly mobile interface
- Secure token-based access

### Global Development Access
```
https://your-domain.com/public/orders/{global-token}
```
- View all orders in one place
- Development and testing purposes only
- Mobile-responsive orders overview

## API Reference

### Shopware Integration
- **Store API**: https://shopware.stoplight.io/docs/store-api/
- **Admin API**: https://shopware.stoplight.io/docs/admin-api/fdd24cc76f22d-order-management

### Deep Link API
```http
# Create Token
POST /functions/v1/order-links
{
  "orderId": "order-123",      // Optional for global tokens
  "tokenType": "single|global", // Default: "single"
  "expirationDays": 7          // Default: 7
}

# Access Order
GET /functions/v1/order-links/public-order/{token}

# Access All Orders (Global Token)
GET /functions/v1/order-links/public-orders/{global-token}

# Revoke Token
DELETE /functions/v1/order-links/{token}
```

## Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Router** for navigation

### Backend
- **Supabase** for database and authentication
- **Edge Functions** for serverless API
- **PostgreSQL** for data storage
- **Row Level Security** for data protection

### Mobile Optimization
- **Responsive Design** with mobile-first approach
- **Touch-Friendly** interface elements
- **Fast Loading** with optimized assets
- **Offline Support** for cached data

## Security

### Token Security
- Cryptographically secure random tokens
- Configurable expiration dates
- Usage tracking and audit logs
- Immediate revocation capability

### Data Protection
- Row Level Security (RLS) policies
- CORS protection
- HTTPS enforcement
- Sensitive data filtering

### Best Practices
- ✅ Short expiration times for production
- ✅ Regular token auditing
- ✅ Monitor usage patterns
- ❌ Never share global tokens in production

## Development

### Project Structure
```
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── api/                # API client functions
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript definitions
├── backend/
│   ├── supabase/
│   │   ├── functions/      # Edge Functions
│   │   └── migrations/     # Database migrations
├── docs/                   # Documentation
└── scripts/               # Utility scripts
```

### Key Components
- **GlobalTokenGenerator**: Admin interface for creating development tokens
- **PublicOrderPage**: Mobile-friendly single order view
- **PublicOrdersPage**: Mobile-friendly all orders view
- **LinkGenerator**: Single order token creation

### Testing
```bash
# Run tests
npm test

# Test token generation
node scripts/generate-dev-token.js

# Test mobile responsiveness
npm run dev
# Open http://localhost:5173/public/orders/{token} on mobile
```

## Deployment

### Supabase Setup
1. Create new Supabase project
2. Run database migrations
3. Deploy Edge Functions
4. Configure environment variables

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to your preferred hosting platform
3. Configure environment variables
4. Test deep link functionality

## Documentation

- **[Deep Link System Guide](docs/deep-link-system.md)** - Complete guide to the deep link system
- **[API Documentation](docs/api.md)** - API endpoints and usage
- **[Mobile Optimization](docs/mobile.md)** - Mobile-specific features and testing

## Support

For issues or questions:
1. Check the [Deep Link System Guide](docs/deep-link-system.md)
2. Review troubleshooting section
3. Test with a fresh token
4. Contact the development team

---

**⚠️ Security Note**: Global development tokens provide access to ALL orders. Use only for development and testing. Never share global tokens in production environments.