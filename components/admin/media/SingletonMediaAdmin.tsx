"use client"

import { useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { ImageSlotList } from "./ImageSlotList"
import { UploadActions } from "./UploadActions"

import type { SingletonDoc } from "@/types/media"

import { Button, Input, Label } from "@/components/atoms"
import { deleteImagesSchema } from "@/lib/validation/deleteImagesSchema"
import { replaceImagesSchema } from "@/lib/validation/replaceImagesSchema"


type DeleteImagesForm = z.infer<typeof deleteImagesSchema>
type ReplaceImagesForm = z.infer<typeof replaceImagesSchema>

interface SingletonMediaAdminProps {
  moduleTitle: string
  doc: SingletonDoc | null
  images: SingletonDoc["images"]
  isLoading: boolean
  error: string | null
  onRefetch: () => Promise<void>
  onCreateOrAdd: (files: File[], doc: SingletonDoc | null) => Promise<void>
  onReplace: (indices: number[], files: File[], doc: SingletonDoc | null) => Promise<void>
  onDelete: (payload: { indices?: number[]; publicIds?: string[] }, doc: SingletonDoc | null) => Promise<void>
}

export function SingletonMediaAdmin({
  moduleTitle,
  doc,
  images,
  isLoading,
  error,
  onRefetch,
  onCreateOrAdd,
  onReplace,
  onDelete,
}: SingletonMediaAdminProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [addFiles, setAddFiles] = useState<File[]>([])
  const [replaceFiles, setReplaceFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const replaceForm = useForm<ReplaceImagesForm>({
    resolver: zodResolver(replaceImagesSchema),
    defaultValues: { indices: [] },
  })

  const deleteForm = useForm<DeleteImagesForm>({
    resolver: zodResolver(deleteImagesSchema),
    defaultValues: { indices: [], publicIds: [] },
  })

  const isEmptyState = !isLoading && !error && !doc

  const sortedSelectedIndices = useMemo(
    () => [...selectedIndices].sort((a, b) => a - b),
    [selectedIndices],
  )

  const updateSelectedIndices = (next: number[]) => {
    setSelectedIndices(next)
    replaceForm.setValue("indices", next, { shouldValidate: true })
    deleteForm.setValue("indices", next, { shouldValidate: true })
  }

  const toggleIndex = (index: number) => {
    const next = selectedIndices.includes(index)
      ? selectedIndices.filter((item) => item !== index)
      : [...selectedIndices, index]

    updateSelectedIndices(next)
  }

  const getErrorMessage = (err: unknown) => {
    const maybeAxiosLike = err as { response?: { data?: { message?: string } } }
    if (maybeAxiosLike?.response?.data?.message) return maybeAxiosLike.response.data.message
    if (err instanceof Error && err.message) return err.message
    return "Có lỗi xảy ra, vui lòng thử lại"
  }

  const runAction = async (action: () => Promise<void>, successMessage: string) => {
    setIsSubmitting(true)
    setStatus(null)
    try {
      await action()
      setStatus(successMessage)
      toast.success(successMessage)
    } catch (err) {
      const message = getErrorMessage(err)
      setStatus(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateOrAdd = async () => {
    if (addFiles.length === 0) {
      setStatus("Vui lòng chọn ít nhất 1 file.")
      return
    }

    await runAction(
      async () => {
        await onCreateOrAdd(addFiles, doc)
        setAddFiles([])
        await onRefetch()
      },
      doc ? "Thêm ảnh thành công" : "Tạo singleton thành công",
    )
  }

  const handleReplace = replaceForm.handleSubmit(async ({ indices }) => {
    if (replaceFiles.length !== indices.length) {
      const message = "Số lượng file phải bằng số lượng vị trí đã chọn"
      setStatus(message)
      replaceForm.setError("indices", { message })
      return
    }

    await runAction(
      async () => {
        await onReplace(indices, replaceFiles, doc)
        setReplaceFiles([])
        updateSelectedIndices([])
        await onRefetch()
      },
      "Thay thế ảnh thành công",
    )
  })

  const handleDelete = deleteForm.handleSubmit(async (values) => {
    const payload = {
      indices: values.indices?.length ? values.indices : undefined,
      publicIds: values.publicIds?.length ? values.publicIds : undefined,
    }

    await runAction(
      async () => {
        await onDelete(payload, doc)
        updateSelectedIndices([])
        deleteForm.setValue("publicIds", [])
        await onRefetch()
      },
      "Xóa ảnh thành công",
    )
  })

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{moduleTitle}</h1>
          </div>
          <Button type="button" variant="outline" disabled={isSubmitting || isLoading} onClick={() => void onRefetch()}>
            Tải lại
          </Button>
        </header>

        {status ? (
          <div className="rounded-lg border bg-slate-50 p-3 text-sm text-slate-600">{status}</div>
        ) : null}

        {isLoading ? <div className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-500">Đang tải dữ liệu...</div> : null}
        {error ? <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div> : null}

        {isEmptyState ? (
          <div className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-500">
            Chưa có singleton. Bạn có thể upload để tạo mới.
          </div>
        ) : null}

        {!isLoading && !error ? (
          <>
            <UploadActions
              title={doc ? "Thêm ảnh vào cuối danh sách" : "Tạo singleton"}
              files={addFiles}
              isSubmitting={isSubmitting}
              submitLabel={doc ? "Thêm ảnh" : "Tạo mới"}
              onFilesChange={setAddFiles}
              onSubmit={handleCreateOrAdd}
            />

            <section className="space-y-3 rounded-lg border bg-white p-4">
              <h2 className="text-lg font-semibold text-slate-900">Danh sách vị trí ảnh</h2>
              <ImageSlotList images={images} selectedIndices={sortedSelectedIndices} onToggleIndex={toggleIndex} />
            </section>

            <section className="space-y-3 rounded-lg border bg-white p-4">
              <h2 className="text-lg font-semibold text-slate-900">Thay thế ảnh theo vị trí</h2>
              <form className="space-y-3" onSubmit={(event) => void handleReplace(event)}>
                <div className="space-y-2">
                  <Label htmlFor={`${moduleTitle}-replace-files`}>Chọn file để thay thế</Label>
                  <Input
                    id={`${moduleTitle}-replace-files`}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(event) => setReplaceFiles(Array.from(event.target.files ?? []))}
                  />
                  <p className="text-xs text-slate-500">
                    Vị trí đang chọn: {sortedSelectedIndices.length ? sortedSelectedIndices.join(", ") : "(chưa chọn)"} | Số file:{" "}
                    {replaceFiles.length}
                  </p>
                  {replaceForm.formState.errors.indices?.message ? (
                    <p className="text-sm text-destructive">{replaceForm.formState.errors.indices.message}</p>
                  ) : null}
                </div>

                <Button type="submit" disabled={isSubmitting || !doc}>
                  {isSubmitting ? "Đang xử lý..." : "Thay thế"}
                </Button>
              </form>
            </section>

            <section className="space-y-3 rounded-lg border bg-white p-4">
              <h2 className="text-lg font-semibold text-slate-900">Xóa ảnh</h2>
              <form className="space-y-3" onSubmit={(event) => void handleDelete(event)}>
                <div className="space-y-2">
                  <Label htmlFor={`${moduleTitle}-public-ids`}>Public ID (phân tách bằng dấu phẩy hoặc xuống dòng)</Label>
                  <textarea
                    id={`${moduleTitle}-public-ids`}
                    className="min-h-24 w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="Chọn ít nhất 1 ảnh để xóa"
                    onChange={(event) => {
                      const publicIds = event.target.value
                        .split(/[\n,]/g)
                        .map((item) => item.trim())
                        .filter(Boolean)

                      deleteForm.setValue("publicIds", publicIds, { shouldValidate: true })
                    }}
                  />
                </div>

                {deleteForm.formState.errors.root?.message ? (
                  <p className="text-sm text-destructive">{deleteForm.formState.errors.root.message}</p>
                ) : null}

                <Button type="submit" variant="destructive" disabled={isSubmitting || !doc}>
                  {isSubmitting ? "Đang xử lý..." : "Xóa ảnh"}
                </Button>
              </form>
            </section>
          </>
        ) : null}
      </section>
    </main>
  )
}
