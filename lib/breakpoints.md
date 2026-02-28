# Breakpoints Documentation

## Tổng quan

File breakpoints định nghĩa 8 kích cỡ màn hình với **3 kích cỡ chính**:

### 3 Breakpoints chính

1. **Mobile** (0-767px)
   - Điện thoại di động
   - Breakpoint: `xs` (0px)

2. **Tablet** (768-1023px)
   - Máy tính bảng
   - Breakpoint: `md` (768px)

3. **Desktop** (1024px+)
   - Máy tính để bàn, laptop
   - Breakpoint: `lg` (1024px)

### 8 Breakpoints đầy đủ

| Tên   | Kích cỡ | Mô tả                                                      |
| ----- | ------- | ---------------------------------------------------------- |
| `xs`  | 0px     | Mobile nhỏ (iPhone SE, etc.)                               |
| `sm`  | 640px   | Mobile lớn (iPhone, Android) - **CHÍNH**                   |
| `md`  | 768px   | Tablet nhỏ (iPad Mini)                                     |
| `lg`  | 1024px  | Tablet lớn / Desktop nhỏ (iPad, small laptops) - **CHÍNH** |
| `xl`  | 1280px  | Desktop (laptops, monitors) - **CHÍNH**                    |
| `2xl` | 1536px  | Desktop lớn (large monitors)                               |
| `3xl` | 1920px  | Desktop rất lớn (ultra-wide monitors)                      |
| `4xl` | 2560px  | Ultra-wide (4K monitors)                                   |

## Cách sử dụng

### 1. Với Tailwind CSS

```tsx
// Mobile first approach
<div className="text-sm md:text-base lg:text-lg xl:text-xl">
  Responsive text
</div>

// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* Content */}
</div>
```

### 2. Với React Hook

```tsx
import { useBreakpoint } from "@/lib/hooks/useBreakpoint"

function MyComponent() {
  const { isMobile, isTablet, isDesktop, breakpoint } = useBreakpoint()

  if (isMobile) {
    return <MobileView />
  }

  if (isTablet) {
    return <TabletView />
  }

  return <DesktopView />
}
```

### 3. Với Media Queries

```tsx
import { mediaQueries } from "@/lib/breakpoints"

// Trong CSS
@media ${mediaQueries.tablet} {
  /* Styles for tablet and up */
}

@media ${mediaQueries.desktop} {
  /* Styles for desktop and up */
}
```

### 4. Với useMediaQuery Hook

```tsx
import { useMediaQuery } from "@/lib/hooks/useBreakpoint"
import { mediaQueries } from "@/lib/breakpoints"

function MyComponent() {
  const isMobile = useMediaQuery(mediaQueries.mobileOnly)
  const isTablet = useMediaQuery(mediaQueries.tabletOnly)
  const isDesktop = useMediaQuery(mediaQueries.desktopOnly)

  return (
    <div>
      {isMobile && <MobileComponent />}
      {isTablet && <TabletComponent />}
      {isDesktop && <DesktopComponent />}
    </div>
  )
}
```

## Best Practices

1. **Mobile First**: Luôn thiết kế từ mobile trước, sau đó scale up
2. **Sử dụng 3 breakpoints chính**: Ưu tiên sử dụng `sm`, `lg`, `xl` cho các trường hợp phổ biến
3. **Test trên nhiều thiết bị**: Đảm bảo UI hoạt động tốt trên các kích cỡ khác nhau
4. **Sử dụng container**: Sử dụng `container` class của Tailwind để giới hạn width

## Ví dụ thực tế

### Responsive Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map((item) => (
    <Card key={item.id}>{item.content}</Card>
  ))}
</div>
```

### Responsive Navigation

```tsx
import { useBreakpoint } from "@/lib/hooks/useBreakpoint"

function Navigation() {
  const { isMobile } = useBreakpoint()

  return <nav>{isMobile ? <MobileMenu /> : <DesktopMenu />}</nav>
}
```

### Responsive Typography

```tsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
  Responsive Heading
</h1>
```
