"use client"

import { AppModal, Button } from "@/components/atoms"

interface ProductTrashActionsProps {
  mode: "restore" | "hardDelete"
  productName?: string
  open: boolean
  isSubmitting?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
}

export function ProductTrashActions({
  mode,
  productName,
  open,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: ProductTrashActionsProps) {
  const isHardDelete = mode === "hardDelete"

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title={isHardDelete ? "Xóa vĩnh viễn sản phẩm" : "Khôi phục sản phẩm"}
      description={
        isHardDelete
          ? "Hành động này không thể hoàn tác."
          : "Sản phẩm sẽ được đưa về danh sách sản phẩm đang hoạt động."
      }
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            variant={isHardDelete ? "destructive" : "outline"}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Đang xử lý..."
              : isHardDelete
                ? "Xóa vĩnh viễn"
                : "Khôi phục"}
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-600">
        {isHardDelete
          ? `Bạn chắc chắn muốn xóa vĩnh viễn "${productName ?? "sản phẩm này"}" khỏi cơ sở dữ liệu?`
          : `Bạn muốn khôi phục "${productName ?? "sản phẩm này"}"?`}
      </p>
    </AppModal>
  )
}
