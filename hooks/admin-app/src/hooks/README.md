# Admin App Hooks

Hooks dành cho admin application.

## Cấu trúc

```
hooks/admin-app/src/hooks/
├── index.ts            # Re-export tất cả hooks
│
├── admin/              # Admin hooks (TODO)
│   ├── index.ts
│   ├── useDashboard.ts
│   └── useAdminAuth.ts
│
├── users/              # User management hooks (TODO)
│   ├── index.ts
│   ├── useUsers.ts
│   └── useUser.ts
│
└── products/           # Product management hooks (TODO)
    ├── index.ts
    ├── useAdminProducts.ts
    └── useAdminProduct.ts
```

## Cách sử dụng

```tsx
// Import từ admin-app hooks
import { useDashboard, useUsers } from "@/hooks/admin-app/src/hooks"

// Hoặc import từ root hooks (re-export)
import { useDashboard, useUsers } from "@/hooks"
```
