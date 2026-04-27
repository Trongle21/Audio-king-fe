"use client"

import { useEffect, useMemo, useState, startTransition } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, Upload } from "lucide-react"
import Image from "next/image"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Button, Input, Label } from "@/components/atoms"
import { useCategories } from "@/hooks/admin-app/src/hooks/admin/category"
import {
  productUpdateSchema,
  type ProductUpdateFormData,
} from "@/lib/schemas/product.schema"

type ProductUpdateFormInput = z.input<typeof productUpdateSchema>
export type ProductFormSubmitPayload = ProductUpdateFormData & { files: File[] }

interface ProductFormProps {
  defaultValues?: Partial<ProductUpdateFormData>
  isSubmitting?: boolean
  submitLabel?: string
  onSubmit: (payload: ProductFormSubmitPayload) => Promise<void>
}

interface SpecificationRow {
  key: string
  value: string
}

interface ExistingImage {
  url: string
  alt?: string
}

function mapSpecRecordToRows(specifications?: Record<string, unknown>): SpecificationRow[] {
  if (!specifications) return [{ key: "", value: "" }]

  const rows: SpecificationRow[] = []

  for (const [key, value] of Object.entries(specifications)) {
    if (typeof value === "string") {
      rows.push({ key, value })
    }
  }

  return rows.length > 0 ? rows : [{ key: "", value: "" }]
}

function getInitialThumbnailUrl(defaultValues?: Partial<ProductUpdateFormData>) {
  const thumbnail = defaultValues?.thumbnail
  if (!thumbnail) return null
  if (typeof thumbnail === "string") return thumbnail
  if (typeof thumbnail === "object" && typeof thumbnail.url === "string" && thumbnail.url.trim()) {
    return thumbnail.url
  }
  return null
}

function getInitialExistingImages(defaultValues?: Partial<ProductUpdateFormData>): ExistingImage[] {
  return (defaultValues?.images ?? []).filter(
    (image): image is ExistingImage =>
      Boolean(image) && typeof image.url === "string" && image.url.trim().length > 0,
  )
}

export function ProductForm({
  defaultValues,
  isSubmitting,
  submitLabel = "Lưu sản phẩm",
  onSubmit,
}: ProductFormProps) {
  const [files, setFiles] = useState<File[]>([])
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailError, setThumbnailError] = useState<string | null>(null)
  const [selectedThumbnailUrl, setSelectedThumbnailUrl] = useState<string | null>(
    getInitialThumbnailUrl(defaultValues),
  )
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    getInitialExistingImages(defaultValues),
  )
  const [highlightsText, setHighlightsText] = useState((defaultValues?.highlights ?? []).join("\n"))
  const [specRows, setSpecRows] = useState<SpecificationRow[]>(
    mapSpecRecordToRows(defaultValues?.specifications),
  )

  useEffect(() => {
    startTransition(() => {
      setExistingImages(getInitialExistingImages(defaultValues))
      setSelectedThumbnailUrl(getInitialThumbnailUrl(defaultValues))
      setHighlightsText((defaultValues?.highlights ?? []).join("\n"))
      setSpecRows(mapSpecRecordToRows(defaultValues?.specifications))
      setFiles([])
      setThumbnailFile(null)
      setThumbnailError(null)
    })
  }, [defaultValues])

  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories({
    q: "",
    page: 1,
    limit: 100,
  })

  const categoryOptions: Array<{ _id: string; name: string }> = Array.isArray(categoriesData?.items)
    ? categoriesData.items
    : []

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductUpdateFormInput, unknown, ProductUpdateFormData>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      sku: defaultValues?.sku ?? "",
      price: defaultValues?.price ?? 0,
      sale: defaultValues?.sale,
      stock: defaultValues?.stock ?? 0,
      status: defaultValues?.status,
      description: defaultValues?.description ?? "",
      rating: defaultValues?.rating,
      categories: defaultValues?.categories ?? [],
      thumbnail: defaultValues?.thumbnail,
      highlights: defaultValues?.highlights ?? [],
      specifications: defaultValues?.specifications ?? {},
    },
  })

  const selectedCategories = useWatch({ control, name: "categories" }) ?? []

  const filePreviews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files])

  const onCategorySelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setValue("categories", value ? [value] : [], { shouldValidate: true })
  }

  const setSpecificationAt = (index: number, field: keyof SpecificationRow, value: string) => {
    setSpecRows((prev) =>
      prev.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)),
    )
  }

  const addSpecRow = () => {
    setSpecRows((prev) => [...prev, { key: "", value: "" }])
  }

  const removeSpecRow = (index: number) => {
    setSpecRows((prev) => {
      const next = prev.filter((_, i) => i !== index)
      return next.length > 0 ? next : [{ key: "", value: "" }]
    })
  }

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => {
      const target = prev[index]
      const next = prev.filter((_, i) => i !== index)

      if (target && selectedThumbnailUrl === target.url) {
        setSelectedThumbnailUrl(null)
      }

      return next
    })
  }

  const removeNewFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const clearThumbnail = () => {
    setThumbnailFile(null)
    setSelectedThumbnailUrl(null)
    setValue("thumbnail", undefined as unknown as ProductUpdateFormInput["thumbnail"], {
      shouldValidate: false,
    })
  }

  const onFormSubmit = handleSubmit(async (values) => {
    if (!thumbnailFile && !selectedThumbnailUrl) {
      setThumbnailError("Vui lòng chọn ảnh thumbnail")
      return
    }

    const reorderedFiles = thumbnailFile ? [thumbnailFile, ...files] : files

    const specifications = specRows.reduce<Record<string, string>>((acc, row) => {
      const key = row.key.trim()
      const value = row.value.trim()

      if (key && value) {
        acc[key] = value
      }

      return acc
    }, {})

    const highlights = (values.highlights ?? [])
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    await onSubmit({
      ...values,
      specifications,
      highlights,
      files: reorderedFiles,
      images: existingImages,
      thumbnail: selectedThumbnailUrl ? { url: selectedThumbnailUrl } : undefined,
    })
  })

  return (
    <form className="space-y-4" onSubmit={onFormSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="name">
            Tên sản phẩm <span className="text-destructive">*</span>
          </Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="price">
            Giá <span className="text-destructive">*</span>
          </Label>
          <Input id="price" type="number" min={0} {...register("price")} />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="stock">
            Tồn kho <span className="text-destructive">*</span>
          </Label>
          <Input id="stock" type="number" min={0} {...register("stock")} />
          {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="rating">Rating</Label>
          <Input id="rating" type="number" min={0} max={5} step={0.1} {...register("rating")} />
          {errors.rating && <p className="text-sm text-destructive">{errors.rating.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Mô tả</Label>
        <textarea id="description" className="w-full rounded-md border p-2 text-sm" rows={4} {...register("description")} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="highlights">Highlights (mỗi dòng là 1 ý)</Label>
        <textarea
          id="highlights"
          className="w-full rounded-md border p-2 text-sm"
          rows={4}
          value={highlightsText}
          onChange={(e) => {
            const nextText = e.target.value
            setHighlightsText(nextText)

            const values = nextText
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line.length > 0)

            setValue("highlights", values, { shouldValidate: true })
          }}
        />
      </div>

      <div className="space-y-2 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <Label>Thuộc tính</Label>
          <Button type="button" variant="outline" size="sm" onClick={addSpecRow}>
            <Plus className="mr-1 h-4 w-4" />
            Thêm dòng
          </Button>
        </div>

        <div className="space-y-2">
          {specRows.map((row, index) => (
            <div key={`spec-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <Input
                placeholder="Tên thuộc tính"
                value={row.key}
                onChange={(e) => setSpecificationAt(index, "key", e.target.value)}
              />
              <Input
                placeholder="Giá trị"
                value={row.value}
                onChange={(e) => setSpecificationAt(index, "value", e.target.value)}
              />
              <Button type="button" variant="ghost" onClick={() => removeSpecRow(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 rounded-lg border p-3">
        <Label htmlFor="categories">
          Danh mục <span className="text-destructive">*</span>
        </Label>
        {isLoadingCategories ? (
          <p className="text-sm text-slate-500">Đang tải danh mục...</p>
        ) : (
          <select
            id="categories"
            className="h-10 w-full rounded-md border px-2 text-sm"
            value={selectedCategories[0] ?? ""}
            onChange={onCategorySelectChange}
          >
            <option value="">-- Chọn danh mục --</option>
            {categoryOptions.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
        {errors.categories && <p className="text-sm text-destructive">{errors.categories.message as string}</p>}
      </div>

      <div className="space-y-2 rounded-lg border p-3">
        <Label htmlFor="thumbnail">
          Thumbnail <span className="text-destructive">*</span>
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              setThumbnailFile(file)
              if (file) {
                setThumbnailError(null)
                setSelectedThumbnailUrl(null)
              }
            }}
          />
          <Upload className="h-4 w-4 text-muted-foreground" />
          <Button type="button" variant="outline" onClick={clearThumbnail}>
            Xóa thumbnail
          </Button>
        </div>
        {thumbnailError && <p className="text-sm text-destructive">{thumbnailError}</p>}

        {(thumbnailFile || selectedThumbnailUrl) && (
          <div className="mt-2 space-y-2">
            <p className="text-xs text-slate-500">Thumbnail hiện tại</p>
            <Image
              src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : (selectedThumbnailUrl as string)}
              alt="thumbnail-preview"
              width={120}
              height={120}
              unoptimized
              className="h-24 w-24 rounded border object-cover"
            />
          </div>
        )}
      </div>

      <div className="space-y-2 rounded-lg border p-3">
        <Label htmlFor="files">Upload ảnh mới</Label>
        <div className="flex items-center gap-2">
          <Input
            id="files"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const nextFiles = Array.from(e.target.files ?? [])
              setFiles(nextFiles)
            }}
          />
          <Upload className="h-4 w-4 text-muted-foreground" />
        </div>

        {(existingImages.length > 0 || filePreviews.length > 0) && (
          <div className="space-y-2">
            <Label>Ảnh sản phẩm</Label>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
              {existingImages.map((image, index) => (
                <div key={`existing-${image.url}-${index}`} className="space-y-1 rounded border p-1 text-xs">
                  <Image
                    src={image.url}
                    alt={`existing-image-${index}`}
                    width={80}
                    height={80}
                    unoptimized
                    className="h-20 w-full rounded border object-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedThumbnailUrl(image.url)
                        setThumbnailFile(null)
                        setThumbnailError(null)
                        setValue(
                          "thumbnail",
                          { url: image.url } as ProductUpdateFormInput["thumbnail"],
                          { shouldValidate: true },
                        )
                      }}
                    >
                      Chọn làm thumbnail
                    </Button>
                    <Button type="button" size="sm" variant="destructive" onClick={() => removeExistingImage(index)}>
                      Xóa ảnh
                    </Button>
                  </div>
                </div>
              ))}

              {filePreviews.map((preview, index) => (
                <div key={`${preview}-${index}`} className="space-y-1 rounded border p-1 text-xs">
                  <Image
                    src={preview}
                    alt={`preview-${index}`}
                    width={80}
                    height={80}
                    unoptimized
                    className="h-20 w-full rounded border object-cover"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={() => removeNewFile(index)}>
                    Bỏ chọn
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Đang xử lý..." : submitLabel}
      </Button>
    </form>
  )
}
