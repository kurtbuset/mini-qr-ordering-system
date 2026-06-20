# QR Ordering System - Frontend

Modern React + TypeScript frontend for QR-based food ordering with real-time updates and admin dashboard.

## Tech Stack

React 19 | TypeScript | Vite | TailwindCSS | Zustand | Socket.IO | React Router v7

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   # .env
   VITE_API_URL=http://localhost:5000
   ```

3. **Run**
   ```bash
   npm run dev      # Development at http://localhost:5173
   npm run build    # Production build
   npm run preview  # Preview production build
   ```

## Key Features

- **Authentication**: JWT-based auth with auto-refresh and role-based access control
- **Real-time Orders**: Socket.IO integration for live order notifications
- **Shopping Cart**: Context-based cart management with persistent state
- **Admin Dashboard**: Order management, product CRUD, user management
- **QR Code Generation**: Dynamic QR codes for table ordering
- **Responsive Design**: Mobile-first TailwindCSS styling

## Architecture & Best Practices

### 1. **State Management**

- **Zustand** for global state (auth, toasts)
- **React Context** for component trees (cart, theme, sidebar)
- Selectors for derived state and performance optimization

```typescript
// Example: Zustand store with devtools
const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      account: null,
      login: async (email, password) => {
        /* ... */
      },
      // Computed selectors
    }),
    { name: "AuthStore" },
  ),
);
```

### 2. **API Layer**

- Centralized `apiClient` with automatic JWT injection
- Credentials included for cookie-based refresh tokens
- Type-safe service layer per domain (auth, products, orders)

```typescript
// services/apiClient.ts - Auto-adds Bearer token
apiClient.get<Product[]>("/products");
apiClient.post<Order>("/orders", orderData);
```

### 3. **Type Safety**

- Strict TypeScript throughout
- Shared types for API contracts (`types/`)
- Role enum for access control consistency

### 4. **Component Organization**

```
src/
├── components/        # Reusable UI components by feature
│   ├── auth/         # Auth-specific (ProtectedRoute)
│   ├── cart/         # Cart UI components
│   ├── products/     # Product cards, lists
│   ├── order/        # Order management
│   └── ui/           # Generic UI (modals, toasts, buttons)
├── pages/            # Route-level components
├── layout/           # App shell (header, sidebar, layout)
├── services/         # API client and domain services
├── store/            # Zustand stores
├── context/          # React Context providers
├── hooks/            # Custom React hooks
└── types/            # TypeScript type definitions
```

### 5. **Routing**

- React Router v7 with nested routes
- Protected routes with role-based guards
- Layout composition for dashboard/auth shells

```typescript
<Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
  <Route path="/" element={<Home />} />
  <Route path="/accounts" element={
    <ProtectedRoute roles={[Role.Admin]}>
      <AccountsManagement />
    </ProtectedRoute>
  } />
</Route>
```

### 6. **Authentication Flow**

- JWT access token (short-lived) + HTTP-only refresh token
- Auto-refresh 1 minute before expiration
- Token stored in Zustand, refresh cookie managed by backend
- Auth initialization on app load via `useAuthInit` hook

### 7. **Real-time Communication**

- Socket.IO client connects after authentication
- Admin room for broadcasting order updates
- Event-driven architecture for order status changes

### 8. **Custom Hooks**

- `useAuthInit` - Initialize auth state on mount
- `useModal` - Modal state management
- `usePagination` - Table pagination logic
- `useGoBack` - Safe navigation with fallback

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Feature-based components
│   ├── pages/           # Route components
│   ├── layout/          # App shell layout
│   ├── services/        # API services
│   ├── store/           # Zustand stores
│   ├── context/         # React Context
│   ├── hooks/           # Custom hooks
│   ├── types/           # TypeScript types
│   ├── icons/           # SVG icons
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── .env                 # Environment variables
└── vite.config.ts       # Vite configuration
```

## Key Dependencies

| Package            | Purpose                       |
| ------------------ | ----------------------------- |
| `zustand`          | Lightweight state management  |
| `socket.io-client` | Real-time WebSocket client    |
| `react-router`     | Declarative routing           |
| `lucide-react`     | Icon library                  |
| `qrcode.react`     | QR code generation            |
| `tailwind-merge`   | Utility class merging         |
| `clsx`             | Conditional class composition |

## Development Guidelines

**Type Safety**: Always define types for API responses and component props
**Component Composition**: Prefer small, focused components over large ones  
**Custom Hooks**: Extract reusable logic into hooks
**Error Handling**: Use toast notifications for user feedback
**Code Splitting**: Leverage Vite's automatic code splitting
**SVG Icons**: Import via `vite-plugin-svgr` for tree-shaking

## Environment Variables

```env
VITE_API_URL=http://localhost:5000  # Backend API URL
```

All env vars must be prefixed with `VITE_` to be exposed to the client.

## Build & Deploy

```bash
npm run build   # Outputs to dist/
npm run preview # Test production build locally
```

The build output is optimized with:

- Code splitting for routes
- Tree-shaking for unused code
- Minification and compression
- TypeScript type checking

## Troubleshooting

**Port in use**: Vite defaults to 5173, change with `--port` flag  
**API connection fails**: Verify `VITE_API_URL` matches backend  
**Types not updating**: Restart TypeScript server in editor  
**Build fails**: Run `tsc -b` separately to see type errors
