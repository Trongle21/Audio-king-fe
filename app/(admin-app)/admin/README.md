# Admin App

Ứng dụng dành cho quản trị viên.

## Cấu trúc

```
admin-app/src/
├── layout.tsx          # Layout admin với header riêng
├── page.tsx            # Dashboard (/admin)
│
└── (admin)/            # Route group cho admin pages (tùy chọn)
    ├── users/
    │   └── page.tsx    # /admin/users
    └── products/
        └── page.tsx    # /admin/products
```

## URLs

- `/admin` - Dashboard
- `/admin/users` - Quản lý người dùng
- `/admin/products` - Quản lý sản phẩm
