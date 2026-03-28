"use client"

import { AppModal, Button } from "@/components/atoms"

interface DeleteBannerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isSubmitting?: boolean
  onConfirm: () => Promise<void>
}

export function DeleteBannerModal({
  open,
  onOpenChange,
  isSubmitting,
  onConfirm,
}: DeleteBannerModalProps) {
  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="Xóa banner"
      description="Bạn có chắc chắn muốn xóa banner này?"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Xóa"}
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-600">Hành động này sẽ xóa banner khỏi hệ thống.</p>
    </AppModal>
  )
}
