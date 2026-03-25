"use client"

import { useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Upload } from "lucide-react"
import Image from "next/image"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Button, Input, Label } from "@/components/atoms"
import { useCategories } from "@/hooks/admin-app/src/hooks/admin/category"
import { productCreateSchema, type ProductCreateFormData } from "@/lib/schemas/product.schema"

type ProductCreateFormInput = z.input<typeof productCreateSchema>
type ProductFormSubmitPayload = ProductCreateFormData & { files: File[] }

interface ProductFormProps {
  defaultValues?: Partial<ProductCreateFormData>
  isSubmitting?: boolean
  submitLabel?: string
  onSubmit: (payload: ProductFormSubmitPayload) => Promise<void>
}

export function ProductForm({
  defaultValues,
  isSubmitting,
  submitLabel = "Lưu sản phẩm",
  onSubmit,
}: ProductFormProps) {
  const [files, setFiles] = useState<File[]>([])
  const [thumbnailIndex, setThumbnailIndex] = useState(0)

  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories({ q: "" })

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductCreateFormInput, unknown, ProductCreateFormData>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      sku: defaultValues?.sku ?? "",
      price: defaultValues?.price ?? 0,
      sale: defaultValues?.sale,
      stock: defaultValues?.stock ?? 0,
      description: defaultValues?.description ?? "",
      rating: defaultValues?.rating,
      categories: defaultValues?.categories ?? [],
    },
  })

  const selectedCategories = useWatch({ control, name: "categories" }) ?? []

  const filePreviews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files])

  const toggleCategory = (categoryId: string, checked: boolean) => {
    const next = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId)

    setValue("categories", next, { shouldValidate: true })
  }

  const onFormSubmit = handleSubmit(async (values) => {
    const safeIndex = Math.min(Math.max(thumbnailIndex, 0), Math.max(files.length - 1, 0))
    const reorderedFiles = files.length
      ? [files[safeIndex], ...files.filter((_, idx) => idx !== safeIndex)]
      : []

    await onSubmit({
      ...values,
      files: reorderedFiles,
      images: undefined,
      thumbnail: undefined,
      status: undefined,
    })
  })

  return (
    <form className="space-y-4" onSubmit={onFormSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="name">Tên sản phẩm</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...register("sku")} />
          {errors.sku && <p className="text-sm text-destructive">{errors.sku.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="price">Giá</Label>
          <Input id="price" type="number" min={0} {...register("price")} />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="stock">Tồn kho</Label>
          <Input id="stock" type="number" min={0} {...register("stock")} />
          {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="sale">Sale</Label>
          <Input id="sale" type="number" min={0} {...register("sale")} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="rating">Rating</Label>
          <Input id="rating" type="number" min={0} max={5} step={0.1} {...register("rating")} />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Mô tả</Label>
        <textarea
          id="description"
          className="w-full rounded-md border p-2 text-sm"
          rows={4}
          {...register("description")}
        />
      </div>

      <div className="space-y-2 rounded-lg border p-3">
        <Label>Danh mục</Label>
        {isLoadingCategories ? (
          <p className="text-sm text-slate-500">Đang tải danh mục...</p>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {(categoriesData ?? []).map((category) => {
              const checked = selectedCategories.includes(category._id)

              return (
                <label key={category._id} className="flex items-center gap-2 rounded border p-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => toggleCategory(category._id, e.target.checked)}
                  />
                  <span>{category.name}</span>
                </label>
              )
            })}
          </div>
        )}
        {errors.categories && (
          <p className="text-sm text-destructive">{errors.categories.message as string}</p>
        )}
      </div>

      <div className="space-y-2 rounded-lg border p-3">
        <Label htmlFor="files">Upload file (nhiều ảnh)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="files"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const nextFiles = Array.from(e.target.files ?? [])
              setFiles(nextFiles)
              setThumbnailIndex(0)
            }}
          />
          <Upload className="h-4 w-4 text-muted-foreground" />
        </div>

        {filePreviews.length > 0 && (
          <div className="space-y-2">
            <Label>Chọn ảnh đại diện (thumbnail)</Label>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
              {filePreviews.map((preview, index) => (
                <label key={`${preview}-${index}`} className="space-y-1 text-xs">
                  <Image
                    src={preview}
                    alt={`preview-${index}`}
                    width={80}
                    height={80}
                    unoptimized
                    className={`h-20 w-full rounded border object-cover ${thumbnailIndex === index ? "ring-2 ring-destructive" : ""}`}
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="thumbnail-file"
                      checked={thumbnailIndex === index}
                      onChange={() => setThumbnailIndex(index)}
                    />
                    <span>Ảnh đại diện</span>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Ảnh đại diện sẽ được ưu tiên đưa lên đầu danh sách upload.
            </p>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Đang xử lý..." : submitLabel}
      </Button>
    </form>
  )
}
