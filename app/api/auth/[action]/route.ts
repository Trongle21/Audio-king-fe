import { proxyToBackend } from "@/app/api/_utils/proxy"

export const runtime = "edge"

type Params = {
    params: Promise<{ action: string }>
}

const ALLOWED_ACTIONS = new Set(["login", "register", "refreshToken", "logout"])

export async function POST(request: Request, { params }: Params) {
    const { action } = await params

    if (!ALLOWED_ACTIONS.has(action)) {
        return Response.json(
            { message: `Unsupported auth action: ${action}` },
            { status: 404 },
        )
    }

    return proxyToBackend(request, `/auth/${action}`)
}
