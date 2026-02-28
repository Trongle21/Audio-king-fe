# Components Structure - Atomic Design

Cấu trúc components được tổ chức theo **Atomic Design Pattern** để dễ dàng quản lý và tái sử dụng.

## Cấu trúc

```text
components/
├── atoms/          # Các component nhỏ nhất, không thể tách nhỏ hơn
│   ├── button.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── badge.tsx
│   ├── avatar.tsx
│   ├── separator.tsx
│   └── skeleton.tsx
│
├── molecules/      # Kết hợp các atoms để tạo thành component phức tạp hơn
│   └── card.tsx
│
├── organisms/      # Kết hợp các molecules và atoms để tạo thành component phức tạp
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── select.tsx
│   └── textarea.tsx
│
├── templates/       # Layout patterns và page templates
│
└── ui/             # Giữ nguyên để tương thích với shadcn/ui
    └── ...
```

## Cách sử dụng

### Import từ Atomic Design structure

```tsx
// Import từ atoms
import { Button, Input, Label } from "@/components/atoms"

// Import từ molecules
import { Card, CardHeader, CardContent } from "@/components/molecules"

// Import từ organisms
import { Dialog, DialogContent, DialogTrigger } from "@/components/organisms"

// Hoặc import tất cả từ index
import { Button, Card, Dialog } from "@/components"
```

### Import từ ui (tương thích với shadcn)

```tsx
// Vẫn có thể import từ ui như cũ
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
```

## Quy tắc phân loại

### Atoms

- Component nhỏ nhất, không thể tách nhỏ hơn
- Không phụ thuộc vào component khác trong cùng level
- Ví dụ: Button, Input, Label, Badge

### Molecules

- Kết hợp nhiều atoms
- Có logic đơn giản
- Ví dụ: Card (kết hợp nhiều phần tử)

### Organisms

- Kết hợp molecules và atoms
- Có logic phức tạp hơn
- Ví dụ: Dialog, Dropdown Menu, Form

### Templates

- Layout patterns
- Page-level structures
- Sẽ được thêm sau khi cần
