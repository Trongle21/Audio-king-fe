"use client"

import { AppModal, Button } from "@/components/atoms"

interface DeleteCategoryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    isSubmitting?: boolean
    onConfirm: () => Promise<void>
}

export function DeleteCategoryModal({
    open,
    onOpenChange,
    isSubmitting,
    onConfirm,
}: DeleteCategoryModalProps) {
    return (
        <AppModal
            open={open}
            onOpenChange={onOpenChange}
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa mềm danh mục này?"
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
            <p className="text-sm text-slate-600">
                Hành động này sẽ gọi API xóa mềm.
            </p>
        </AppModal>
    )
}