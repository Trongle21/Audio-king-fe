import { proxyToBackend } from "@/app/api/_utils/proxy"

export const runtime = "edge"

export async function GET() {
    return proxyToBackend(new Request("http://localhost"), "/trending")
}
