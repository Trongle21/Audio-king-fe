import { proxyToBackend } from "@/app/api/_utils/proxy"

export const runtime = "edge"

type Params = {
    params: Promise<{ segments: string[] }>
}

function buildBackendPath(request: Request, segments: string[]): string {
    const pathname = segments.join("/")
    const { search } = new URL(request.url)
    return `/${pathname}${search}`
}

async function handle(request: Request, { params }: Params) {
    const { segments } = await params

    if (!Array.isArray(segments) || segments.length === 0) {
        return Response.json({ message: "Invalid API path" }, { status: 400 })
    }

    return proxyToBackend(request, buildBackendPath(request, segments))
}

export async function GET(request: Request, context: Params) {
    return handle(request, context)
}

export async function POST(request: Request, context: Params) {
    return handle(request, context)
}

export async function PUT(request: Request, context: Params) {
    return handle(request, context)
}

export async function PATCH(request: Request, context: Params) {
    return handle(request, context)
}

export async function DELETE(request: Request, context: Params) {
    return handle(request, context)
}

export async function OPTIONS(request: Request, context: Params) {
    return handle(request, context)
}
