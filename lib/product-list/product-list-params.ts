import type {
  GetProductsParams,
  ProductOrder,
  ProductSortBy,
} from "@/api/product/product.types"
import type { ReadonlyURLSearchParams } from "next/navigation"

import {
  DEFAULT_PRODUCT_LIST_LIMIT,
  DEFAULT_PRODUCT_LIST_PAGE,
  sanitizeGetProductsParams,
} from "@/api/product/product.api"

const SORT_BY_VALUES: readonly ProductSortBy[] = ["name", "price", "createdAt"]
const ORDER_VALUES: readonly ProductOrder[] = ["asc", "desc"]

function isSortBy(v: string): v is ProductSortBy {
  return (SORT_BY_VALUES as readonly string[]).includes(v)
}

function isOrder(v: string): v is ProductOrder {
  return (ORDER_VALUES as readonly string[]).includes(v)
}

function parseFiniteNumber(raw: string | null): number | undefined {
  if (raw === null || raw === "") return undefined
  const n = Number(raw)
  return Number.isFinite(n) ? n : undefined
}

function parseIntParam(raw: string | null): number | undefined {
  if (raw === null || raw === "") return undefined
  const n = parseInt(raw, 10)
  return Number.isFinite(n) ? n : undefined
}

/** Đọc query string → params (có page/limit mặc định). */
export function parseProductListSearchParams(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
): GetProductsParams {
  const q = searchParams.get("q")?.trim() ?? ""
  const status = parseIntParam(searchParams.get("status"))
  const categoryId = searchParams.get("categoryId")?.trim() ?? ""
  const minPrice = parseFiniteNumber(searchParams.get("minPrice"))
  const maxPrice = parseFiniteNumber(searchParams.get("maxPrice"))
  const sortByRaw = searchParams.get("sortBy")
  const orderRaw = searchParams.get("order")
  const sortBy =
    sortByRaw && isSortBy(sortByRaw) ? sortByRaw : undefined
  const order = orderRaw && isOrder(orderRaw) ? orderRaw : undefined
  const page = parseIntParam(searchParams.get("page")) ?? DEFAULT_PRODUCT_LIST_PAGE
  const limit = parseIntParam(searchParams.get("limit")) ?? DEFAULT_PRODUCT_LIST_LIMIT

  const out: GetProductsParams = {
    page,
    limit,
  }
  if (q) out.q = q
  if (status !== undefined) out.status = status
  if (categoryId) out.categoryId = categoryId
  if (minPrice !== undefined) out.minPrice = minPrice
  if (maxPrice !== undefined) out.maxPrice = maxPrice
  if (sortBy) out.sortBy = sortBy
  if (order) out.order = order

  return out
}

/** Ghi params ra query string (bỏ giá trị rỗng / mặc định để URL gọn). */
export function stringifyProductListParams(params: GetProductsParams): string {
  const sp = new URLSearchParams()
  const p = sanitizeGetProductsParams(params)
  const page = p.page ?? DEFAULT_PRODUCT_LIST_PAGE
  const limit = p.limit ?? DEFAULT_PRODUCT_LIST_LIMIT

  if (p.q) sp.set("q", p.q)
  if (p.status !== undefined) sp.set("status", String(p.status))
  if (p.categoryId) sp.set("categoryId", p.categoryId)
  if (p.minPrice !== undefined) sp.set("minPrice", String(p.minPrice))
  if (p.maxPrice !== undefined) sp.set("maxPrice", String(p.maxPrice))
  if (p.sortBy) sp.set("sortBy", p.sortBy)
  if (p.order) sp.set("order", p.order)
  if (page !== DEFAULT_PRODUCT_LIST_PAGE) sp.set("page", String(page))
  if (limit !== DEFAULT_PRODUCT_LIST_LIMIT) sp.set("limit", String(limit))

  return sp.toString()
}

export function buildProductListHref(
  pathname: string,
  params: GetProductsParams,
): string {
  const qs = stringifyProductListParams(params)
  return qs ? `${pathname}?${qs}` : pathname
}

/** Chuẩn hoá min/max: nếu cả hai có và min > max thì đổi chỗ. */
export function normalizeMinMaxPrice(
  minPrice: number | undefined,
  maxPrice: number | undefined,
): { minPrice?: number; maxPrice?: number } {
  if (
    minPrice === undefined ||
    maxPrice === undefined ||
    minPrice <= maxPrice
  ) {
    return { minPrice, maxPrice }
  }
  return { minPrice: maxPrice, maxPrice: minPrice }
}
