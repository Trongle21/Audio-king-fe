"use client"

import { AppModal, Button } from "@/components/atoms"

interface CategoryTrashActionsProps {
  mode: "restore" | "hardDelete"
  categoryName?: string
  open: boolean
  isSubmitting?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
}

export function CategoryTrashActions({
  mode,
  categoryName,
  open,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: CategoryTrashActionsProps) {
  const isHardDelete = mode === "hardDelete"

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title={isHardDelete ? "Xóa vĩnh viễn danh mục" : "Khôi phục danh mục"}
      description={isHardDelete ? "Hành động này không thể hoàn tác." : "Danh mục sẽ được khôi phục về danh sách chính."}
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
            {isSubmitting ? "Đang xử lý..." : isHardDelete ? "Xóa vĩnh viễn" : "Khôi phục"}
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-600">
        {isHardDelete
          ? `Bạn chắc chắn muốn xóa vĩnh viễn "${categoryName ?? "danh mục này"}" khỏi cơ sở dữ liệu?`
          : `Bạn muốn khôi phục "${categoryName ?? "danh mục này"}"?`}
      </p>
    </AppModal>
  )
}
