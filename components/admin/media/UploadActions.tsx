"use client"

import { Button, Input, Label } from "@/components/atoms"

interface UploadActionsProps {
  title: string
  description?: string
  files: File[]
  isSubmitting?: boolean
  submitLabel: string
  onFilesChange: (files: File[]) => void
  onSubmit: () => Promise<void>
}

export function UploadActions({
  title,
  description,
  files,
  isSubmitting,
  submitLabel,
  onFilesChange,
  onSubmit,
}: UploadActionsProps) {
  return (
    <section className="space-y-3 rounded-lg border bg-white p-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${title}-files`}>Chọn nhiều ảnh</Label>
        <Input
          id={`${title}-files`}
          type="file"
          multiple
          accept="image/*"
          onChange={(event) => onFilesChange(Array.from(event.target.files ?? []))}
        />
        <p className="text-xs text-slate-500">Đã chọn {files.length} file</p>
      </div>

      <Button type="button" disabled={Boolean(isSubmitting) || files.length === 0} onClick={() => void onSubmit()}>
        {isSubmitting ? "Đang xử lý..." : submitLabel}
      </Button>
    </section>
  )
}
