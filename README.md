# HiproTech - Production-Ready Frontend Architecture

Modern, scalable Next.js application built with enterprise-grade practices for e-commerce and food delivery platforms.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (Strict Mode - Zero `any`)
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Redux Toolkit + RTK Query
- **Authentication**: JWT with automatic token refresh
- **Icons**: Lucide React
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
│   ├── layout/           # Layout components (Header, Sidebar, PageSection)
│   └── datatable/        # DataTable system with TypeScript generics
├── features/             # Feature-based modules
│   └── auth/            # Authentication (slice + API)
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication state & operations
│   └── useDataTable.ts  # Table functionality (search, sort, pagination)
├── lib/                 # Third-party integrations
│   └── providers.tsx    # Redux Provider wrapper
├── services/            # API services
│   └── baseApi.ts       # RTK Query base API with auth
├── store/               # Redux store configuration
│   ├── store.ts         # Store setup with typed hooks
│   └── hooks.ts         # Typed useAppDispatch, useAppSelector
├── types/               # TypeScript type definitions
│   ├── auth.ts          # Authentication types
│   ├── api.ts           # API response types
│   └── components.ts    # Component prop types
├── utils/               # Pure utility functions
│   ├── helpers.ts       # Common utilities (cn, formatCurrency, etc.)
│   └── auth.ts          # Token management utilities
├── constants/           # Application constants
│   ├── routes.ts        # Route definitions
│   └── app.ts           # API endpoints, storage keys, roles
└── middleware.ts        # Next.js middleware for route protection
```

## 🛠️ Development

### Getting Started
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Code Quality
- **TypeScript strict mode** with zero `any` types
- **ESLint** for code quality
- **Path aliases** with `@/` imports

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_DEMO_MODE=true  # Set to false for real API
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🎭 Demo Mode

The application includes a smart demo mode that allows seamless switching between dummy data and real API calls:

### Demo Mode (Default)
- **Environment**: `NEXT_PUBLIC_DEMO_MODE=true`
- **Login**: admin@hiprotech.com / password123
- **Features**: All authentication flows work with simulated API delays
- **Data**: Uses dummy users, tokens, and responses
- **Safe**: No real API calls made

### Production Mode
- **Environment**: `NEXT_PUBLIC_DEMO_MODE=false`
- **API**: Connects to real backend at `NEXT_PUBLIC_API_URL`
- **Features**: Full RTK Query integration with real endpoints
- **Seamless**: Same Redux state management and components

### Switching Modes
1. **Enable Demo Mode**: Set `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local`
2. **Enable Production**: Set `NEXT_PUBLIC_DEMO_MODE=false` and provide real API URL
3. **No Code Changes**: RTK Query automatically uses the correct endpoints

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

**Built by senior frontend architects with 3+ years of real-world experience in scalable web applications.**
# common-strcr
