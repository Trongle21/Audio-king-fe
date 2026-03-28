"use client"

import { AppModal, Button } from "@/components/atoms"

interface DeleteAboutModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    isSubmitting?: boolean
    onConfirm: () => Promise<void>
}

export function DeleteAboutModal({
    open,
    onOpenChange,
    isSubmitting,
    onConfirm,
}: DeleteAboutModalProps) {
    return (
        <AppModal
            open={open}
            onOpenChange={onOpenChange}
            title="Xóa about"
            description="Bạn có chắc chắn muốn xóa about này?"
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
            <p className="text-sm text-slate-600">Hành động này sẽ xóa document about khỏi hệ thống.</p>
        </AppModal>
    )
}