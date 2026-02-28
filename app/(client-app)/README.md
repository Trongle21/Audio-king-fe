# Client App

Ứng dụng dành cho người dùng cuối (end users).

## Cấu trúc

```
client-app/src/
├── layout.tsx          # Layout chính với Header và Footer
├── page.tsx            # Trang chủ (/)
├── not-found.tsx       # Trang 404
│
├── (auth)/             # Route group cho authentication
│   ├── layout.tsx      # Layout cho auth pages
│   ├── login/
│   │   └── page.tsx    # /login
│   └── register/
│       └── page.tsx    # /register
│
└── (main)/             # Route group cho main pages
    ├── layout.tsx      # Layout cho main pages (có thể bỏ qua)
    ├── page.tsx        # Trang chủ (nếu không có ở root)
    └── product/
        └── page.tsx    # /product
```

## URLs

- `/` - Trang chủ
- `/login` - Đăng nhập
- `/register` - Đăng ký
- `/product` - Sản phẩm
