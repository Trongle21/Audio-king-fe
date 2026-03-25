"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button, Input, Label } from "@/components/atoms"
import {
    restoreCategorySchema,
    type RestoreCategoryFormData,
} from "@/lib/schemas/category.schema"

interface RestoreCategoryFormProps {
    isSubmitting?: boolean
    onSubmit: (id: string) => Promise<void>
}

export function RestoreCategoryForm({
    isSubmitting,
    onSubmit,
}: RestoreCategoryFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RestoreCategoryFormData>({
        resolver: zodResolver(restoreCategorySchema),
        defaultValues: { id: "" },
    })

    const submitHandler = handleSubmit(async (values) => {
        await onSubmit(values.id)
        reset()
    })

    return (
        <form
            onSubmit={submitHandler}
            className="rounded-xl border bg-slate-50 p-4 space-y-2"
        >
            <Label htmlFor="restore-category-id">Restore category theo ID</Label>
            <div className="flex gap-2">
                <Input
                    id="restore-category-id"
                    placeholder="Nhập category _id cần restore"
                    {...register("id")}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Đang xử lý..." : "Restore"}
                </Button>
            </div>
            {errors.id && <p className="text-sm text-destructive">{errors.id.message}</p>}
        </form>
    )
}