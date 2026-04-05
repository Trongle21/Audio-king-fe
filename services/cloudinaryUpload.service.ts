export interface CloudinarySignedUploadConfig {
    timestamp: number
    folder: string
    signature: string
    cloudName: string
    apiKey: string
}

interface UploadFileToCloudinaryParams {
    file: File
    config: CloudinarySignedUploadConfig
    onProgress?: (progress: number) => void
}

function createUploadError(message: string, fileName: string) {
    return new Error(`Upload thất bại (${fileName}): ${message}`)
}

export async function uploadFileToCloudinary({
    file,
    config,
    onProgress,
}: UploadFileToCloudinaryParams): Promise<string> {
    const endpoint = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`

    return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        const formData = new FormData()

        formData.append("file", file)
        formData.append("api_key", config.apiKey)
        formData.append("timestamp", String(config.timestamp))
        formData.append("signature", config.signature)
        formData.append("folder", config.folder)

        xhr.open("POST", endpoint)

        xhr.upload.onprogress = (event) => {
            if (!event.lengthComputable || !onProgress) return

            const progress = Math.round((event.loaded / event.total) * 100)
            onProgress(Math.max(0, Math.min(100, progress)))
        }

        xhr.onload = () => {
            try {
                if (xhr.status < 200 || xhr.status >= 300) {
                    reject(createUploadError(`HTTP ${xhr.status}`, file.name))
                    return
                }

                const payload = JSON.parse(xhr.responseText) as { secure_url?: unknown; error?: { message?: string } }

                if (typeof payload.secure_url !== "string" || payload.secure_url.trim().length === 0) {
                    const apiMessage = payload.error?.message?.trim()
                    reject(createUploadError(apiMessage || "Thiếu secure_url từ Cloudinary", file.name))
                    return
                }

                onProgress?.(100)
                resolve(payload.secure_url)
            } catch {
                reject(createUploadError("Không đọc được response từ Cloudinary", file.name))
            }
        }

        xhr.onerror = () => {
            reject(createUploadError("Lỗi mạng khi upload", file.name))
        }

        xhr.send(formData)
    })
}
