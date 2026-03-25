"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button, Input, Label } from "@/components/atoms"
import {
    productRestoreSchema,
    type ProductRestoreFormData,
} from "@/lib/schemas/product.schema"

interface RestoreProductFormProps {
    isSubmitting?: boolean
    onSubmit: (id: string) => Promise<void>
}

export function RestoreProductForm({
    isSubmitting,
    onSubmit,
}: RestoreProductFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductRestoreFormData>({
        resolver: zodResolver(productRestoreSchema),
        defaultValues: { id: "" },
    })

    const submitHandler = handleSubmit(async (values) => {
        await onSubmit(values.id)
        reset()
    })

    return (
        <form onSubmit={submitHandler} className="rounded-xl border bg-slate-50 p-4 space-y-2">
            <Label htmlFor="restore-product-id">Khôi phục sản phẩm theo ID</Label>
            <div className="flex gap-2">
                <Input
                    id="restore-product-id"
                    placeholder="Nhập product _id cần khôi phục"
                    {...register("id")}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Đang xử lý..." : "Khôi phục"}
                </Button>
            </div>
            {errors.id && <p className="text-sm text-destructive">{errors.id.message}</p>}
        </form>
    )
}