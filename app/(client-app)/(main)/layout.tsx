// Layout này không cần thiết nữa vì đã có layout.tsx ở client-app/src
// Giữ lại để tương thích hoặc có thể xóa
export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
