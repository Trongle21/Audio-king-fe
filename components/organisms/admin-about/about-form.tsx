"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"

import { Button, Input, Label } from "@/components/atoms"
import { aboutSchema, type AboutFormData } from "@/lib/schemas/about.schema"

interface AboutFormProps {
    defaultValues?: AboutFormData
    isSubmitting?: boolean
    submitLabel?: string
    onSubmit: (payload: AboutFormData) => Promise<void>
}

export function AboutForm({
    defaultValues,
    isSubmitting,
    submitLabel = "Lưu about",
    onSubmit,
}: AboutFormProps) {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AboutFormData>({
        resolver: zodResolver(aboutSchema),
        defaultValues: defaultValues ?? { images: [{ url: "", alt: "" }] },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "images",
    })

    const submitHandler = handleSubmit(async (values) => {
        await onSubmit({
            images: values.images.map((img) => ({
                url: img.url.trim(),
                alt: img.alt?.trim() || undefined,
            })),
        })
    })

    return (
        <form className="space-y-4" onSubmit={submitHandler}>
            <div className="flex items-center justify-between">
                <Label>Danh sách ảnh about</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ url: "", alt: "" })}>
                    <Plus className="mr-1 h-4 w-4" />
                    Thêm dòng ảnh
                </Button>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="space-y-2 rounded-md border p-3">
                    <div className="space-y-1">
                        <Label htmlFor={`images.${index}.url`}>
                            URL ảnh <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id={`images.${index}.url`}
                            placeholder="https://example.com/about.jpg"
                            {...register(`images.${index}.url`)}
                        />
                        {errors.images?.[index]?.url && (
                            <p className="text-sm text-destructive">{errors.images[index]?.url?.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor={`images.${index}.alt`}>Alt text</Label>
                        <Input id={`images.${index}.alt`} placeholder="Ảnh about 1" {...register(`images.${index}.alt`)} />
                    </div>

                    <div className="flex justify-end">
                        <Button type="button" variant="ghost" disabled={fields.length === 1} onClick={() => remove(index)}>
                            <Trash2 className="mr-1 h-4 w-4" />
                            Xóa dòng
                        </Button>
                    </div>
                </div>
            ))}

            {errors.images?.message && <p className="text-sm text-destructive">{errors.images.message}</p>}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : submitLabel}
            </Button>
        </form>
    )
}