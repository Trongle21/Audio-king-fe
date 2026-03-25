"use client"

import { AppModal, Button } from "@/components/atoms"

interface DeleteProductModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    isSubmitting?: boolean
    onConfirm: () => Promise<void>
}

export function DeleteProductModal({
    open,
    onOpenChange,
    isSubmitting,
    onConfirm,
}: DeleteProductModalProps) {
    return (
        <AppModal
            open={open}
            onOpenChange={onOpenChange}
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa mềm sản phẩm này?"
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
            <p className="text-sm text-slate-600">Hành động này sẽ gọi API xóa mềm sản phẩm.</p>
        </AppModal>
    )
}