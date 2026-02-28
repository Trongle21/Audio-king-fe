# Hệ thống màu sắc

## Tổng quan

Dự án sử dụng hệ thống màu sắc phong phú với naming convention: `{color}-{variant}-{shade}`

Ví dụ: `text-nature-light-800`, `bg-ocean-dark-500`

## Cấu trúc màu sắc

Mỗi màu có:

- **3 variants**: `light`, `DEFAULT`, `dark`
- **10 shades**: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`

## Danh sách màu sắc

### 1. Nature (Màu thiên nhiên - Xanh lá)

- `nature-light-{shade}`
- `nature-{shade}` (default)
- `nature-dark-{shade}`

### 2. Ocean (Màu đại dương - Xanh dương)

- `ocean-light-{shade}`
- `ocean-{shade}` (default)
- `ocean-dark-{shade}`

### 3. Sunset (Màu hoàng hôn - Cam/vàng)

- `sunset-light-{shade}`
- `sunset-{shade}` (default)
- `sunset-dark-{shade}`

### 4. Forest (Màu rừng - Xanh rừng)

- `forest-light-{shade}`
- `forest-{shade}` (default)
- `forest-dark-{shade}`

### 5. Sky (Màu bầu trời - Xanh nhạt)

- `sky-light-{shade}`
- `sky-{shade}` (default)
- `sky-dark-{shade}`

### 6. Rose (Màu hồng)

- `rose-light-{shade}`
- `rose-{shade}` (default)
- `rose-dark-{shade}`

### 7. Violet (Màu tím)

- `violet-light-{shade}`
- `violet-{shade}` (default)
- `violet-dark-{shade}`

### 8. Emerald (Màu ngọc lục bảo)

- `emerald-light-{shade}`
- `emerald-{shade}` (default)
- `emerald-dark-{shade}`

### 9. Amber (Màu hổ phách)

- `amber-light-{shade}`
- `amber-{shade}` (default)
- `amber-dark-{shade}`

### 10. Turquoise (Màu ngọc lam)

- `turquoise-light-{shade}`
- `turquoise-{shade}` (default)
- `turquoise-dark-{shade}`

### 11. Coral (Màu san hô)

- `coral-light-{shade}`
- `coral-{shade}` (default)
- `coral-dark-{shade}`

### 12. Mint (Màu bạc hà)

- `mint-light-{shade}`
- `mint-{shade}` (default)
- `mint-dark-{shade}`

### 13. Lavender (Màu oải hương)

- `lavender-light-{shade}`
- `lavender-{shade}` (default)
- `lavender-dark-{shade}`

### 14. Indigo (Màu chàm)

- `indigo-light-{shade}`
- `indigo-{shade}` (default)
- `indigo-dark-{shade}`

### 15. Teal (Màu xanh lục lam)

- `teal-light-{shade}`
- `teal-{shade}` (default)
- `teal-dark-{shade}`

### 16. Cyan (Màu lục lam)

- `cyan-light-{shade}`
- `cyan-{shade}` (default)
- `cyan-dark-{shade}`

### 17. Magenta (Màu đỏ tươi)

- `magenta-light-{shade}`
- `magenta-{shade}` (default)
- `magenta-dark-{shade}`

### 18. Lime (Màu chanh)

- `lime-light-{shade}`
- `lime-{shade}` (default)
- `lime-dark-{shade}`

## Cách sử dụng

### Text colors

```tsx
<p className="text-nature-light-800">Text màu nature light 800</p>
<p className="text-ocean-500">Text màu ocean default 500</p>
<p className="text-sunset-dark-600">Text màu sunset dark 600</p>
```

### Background colors

```tsx
<div className="bg-forest-light-100">Background màu forest light 100</div>
<div className="bg-rose-500">Background màu rose default 500</div>
<div className="bg-violet-dark-700">Background màu violet dark 700</div>
```

### Border colors

```tsx
<div className="border-2 border-emerald-light-300">Border màu emerald light 300</div>
<div className="border border-amber-500">Border màu amber default 500</div>
```

### Combined usage

```tsx
<div className="bg-nature-light-50 text-nature-dark-900 border border-nature-500">
  Combined colors
</div>
```

## Shades

- **50-100**: Rất sáng, dùng cho background nhẹ
- **200-300**: Sáng, dùng cho hover states
- **400-500**: Trung bình, dùng cho base colors
- **600-700**: Tối vừa, dùng cho text trên background sáng
- **800-900**: Rất tối, dùng cho text chính

## Variants

- **light**: Màu nhạt hơn, phù hợp cho background sáng
- **default**: Màu chuẩn, cân bằng
- **dark**: Màu đậm hơn, phù hợp cho background tối

## Ví dụ thực tế

### Card với màu nature

```tsx
<div className="bg-nature-light-50 border border-nature-200 rounded-lg p-4">
  <h3 className="text-nature-dark-900 font-bold">Nature Card</h3>
  <p className="text-nature-700">Content với màu nature</p>
</div>
```

### Button với màu ocean

```tsx
<button className="bg-ocean-500 hover:bg-ocean-600 text-white px-4 py-2 rounded">
  Ocean Button
</button>
```

### Gradient với màu sunset

```tsx
<div className="bg-gradient-to-r from-sunset-light-200 to-sunset-dark-800">
  Sunset Gradient
</div>
```
