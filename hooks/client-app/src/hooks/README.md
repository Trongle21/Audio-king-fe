# Client App Hooks

Hooks dành cho client application.

## Cấu trúc

```
hooks/client-app/src/hooks/
├── index.ts            # Re-export tất cả hooks
├── useAuth.ts          # Hook authentication chính
│
├── auth/               # Authentication hooks
│   ├── index.ts
│   ├── useLogin.ts
│   ├── useLoginQuery.ts
│   └── useLogout.ts
│
├── product/            # Product hooks
│   ├── index.ts
│   ├── useProducts.ts
│   └── useProduct.ts
│
└── ui/                 # UI hooks
    ├── index.ts
    ├── useToggle.ts
    └── useDebounce.ts
```

## Cách sử dụng

```tsx
// Import từ client-app hooks
import { useLogin, useProducts } from "@/hooks/client-app/src/hooks"

// Hoặc import từ root hooks (re-export)
import { useLogin, useProducts } from "@/hooks"
```
