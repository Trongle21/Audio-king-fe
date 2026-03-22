"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type AppModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description?: string
    children: React.ReactNode
    footer?: React.ReactNode
}

export function AppModal({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
}: AppModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                <div>{children}</div>

                {footer && <DialogFooter>{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    )
}
