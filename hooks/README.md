# Hooks Structure

Cấu trúc hooks được tổ chức theo chức năng, tương tự như cấu trúc `app` folder.

## Cấu trúc

```
hooks/
├── index.ts              # Re-export tất cả hooks
├── useAuth.ts            # Hook authentication chính
│
├── auth/                 # Hooks liên quan đến authentication
│   ├── index.ts          # Re-export auth hooks
│   ├── useLogin.ts       # Hook đăng nhập
│   └── useLogout.ts     # Hook đăng xuất
│
├── product/              # Hooks liên quan đến sản phẩm
│   ├── index.ts          # Re-export product hooks
│   ├── useProducts.ts    # Hook lấy danh sách sản phẩm
│   └── useProduct.ts     # Hook lấy chi tiết sản phẩm
│
└── ui/                   # Hooks liên quan đến UI
    ├── index.ts          # Re-export UI hooks
    ├── useToggle.ts      # Hook toggle boolean state
    └── useDebounce.ts    # Hook debounce value
```

## Cách sử dụng

### Import từ root index

```tsx
// Import tất cả hooks từ một nơi
import { useAuth, useLogin, useProducts, useToggle } from "@/hooks"
```

### Import từ module cụ thể

```tsx
// Import từ auth module
import { useAuth, useLogin, useLogout } from "@/hooks/auth"

// Import từ product module
import { useProducts, useProduct } from "@/hooks/product"

// Import từ UI module
import { useToggle, useDebounce } from "@/hooks/ui"
```

### Import hook cụ thể

```tsx
// Import hook cụ thể
import { useAuth } from "@/hooks/useAuth"
import { useLogin } from "@/hooks/auth/useLogin"
```

## Ví dụ sử dụng

### useAuth

```tsx
import { useAuth } from "@/hooks"

function MyComponent() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Đăng xuất</button>
      ) : (
        <button onClick={() => login("email@example.com", "password")}>
          Đăng nhập
        </button>
      )}
    </div>
  )
}
```

### useProducts

```tsx
import { useProducts } from "@/hooks"

function ProductList() {
  const { products, isLoading, error } = useProducts()

  if (isLoading) return <div>Đang tải...</div>
  if (error) return <div>Lỗi: {error}</div>

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

### useToggle

```tsx
import { useToggle } from "@/hooks"

function ToggleExample() {
  const { value, toggle, setTrue, setFalse } = useToggle()

  return (
    <div>
      <p>Value: {value ? "ON" : "OFF"}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={setTrue}>Set True</button>
      <button onClick={setFalse}>Set False</button>
    </div>
  )
}
```

## Quy tắc

- Tất cả hooks phải có `"use client"` directive nếu sử dụng React hooks
- Mỗi module có file `index.ts` để re-export
- File `hooks/index.ts` re-export tất cả hooks từ các module con
- Đặt tên hook bắt đầu bằng `use` (theo React convention)
