# Environment Variables

File này mô tả các biến môi trường được sử dụng trong dự án FE-Audio.

## Cấu hình

1. Copy file `.env.example` thành `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Điền các giá trị cần thiết vào `.env.local`

## Các biến môi trường

### Site Configuration

- `NEXT_PUBLIC_SITE_URL`: URL của website (ví dụ: `http://localhost:3000` hoặc `https://feaudio.com`)
  - Sử dụng cho: Metadata, canonical URLs, Open Graph

### Search Engine Verification

- `NEXT_PUBLIC_GOOGLE_VERIFICATION`: Google Search Console verification code
- `NEXT_PUBLIC_YANDEX_VERIFICATION`: Yandex Webmaster verification code

### API Configuration

- `NEXT_PUBLIC_API_URL`: Base URL cho API calls (ví dụ: `https://audio-king-be.vercel.app/api`)

### Database (Optional)

- `DATABASE_URL`: Connection string cho database (nếu sử dụng)

### Authentication (Optional)

- `NEXTAUTH_URL`: URL cho NextAuth.js (nếu sử dụng)
- `NEXTAUTH_SECRET`: Secret key cho NextAuth.js

### External Services (Optional)

- `STRIPE_PUBLIC_KEY`: Stripe public key (nếu sử dụng Stripe)
- `STRIPE_SECRET_KEY`: Stripe secret key (nếu sử dụng Stripe)

## Lưu ý

- File `.env.local` đã được thêm vào `.gitignore` và sẽ không được commit vào Git
- File `.env.example` là template và sẽ được commit vào Git
- Tất cả biến bắt đầu bằng `NEXT_PUBLIC_` sẽ được expose ra client-side
- Không commit các secret keys hoặc sensitive information vào Git
