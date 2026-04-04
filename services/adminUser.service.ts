import { apiDelete, apiGet, apiPut } from "@/api"

export type AdminUserRole = "user" | "admin"
export type AdminUserSortBy =
  | "username"
  | "email"
  | "phone"
  | "role"
  | "createdAt"
  | "updatedAt"
export type SortOrder = "asc" | "desc"

export interface AdminUserItem {
  _id: string
  username: string
  email: string
  phone?: string
  role: AdminUserRole
  isDelete: boolean
  createdAt?: string
  updatedAt?: string
}

export interface AdminUsersQueryParams {
  page?: number
  limit?: number
  q?: string
  role?: AdminUserRole
  isDelete?: boolean
  sortBy?: AdminUserSortBy
  order?: SortOrder
}

export interface AdminUsersPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AdminUsersListData {
  items: AdminUserItem[]
  pagination: AdminUsersPagination
  filter: Record<string, unknown>
}

export interface UpdateAdminUserPayload {
  username?: string
  email?: string
  phone?: string
  role?: AdminUserRole
}

interface ApiSuccessResponse<T> {
  message: string
  data: T
}

function normalizeUsersQuery(params: AdminUsersQueryParams = {}): AdminUsersQueryParams {
  const normalized: AdminUsersQueryParams = {
    page: params.page ?? 1,
    limit: params.limit ?? 12,
  }

  const trimmedQ = params.q?.trim()
  if (trimmedQ) normalized.q = trimmedQ
  if (params.role) normalized.role = params.role
  if (params.isDelete !== undefined) normalized.isDelete = params.isDelete
  if (params.sortBy) normalized.sortBy = params.sortBy
  if (params.order) normalized.order = params.order

  return normalized
}

function buildUsersQueryString(params: AdminUsersQueryParams = {}) {
  const normalized = normalizeUsersQuery(params)
  const searchParams = new URLSearchParams()

  if (normalized.page) searchParams.set("page", String(normalized.page))
  if (normalized.limit) searchParams.set("limit", String(normalized.limit))
  if (normalized.q) searchParams.set("q", normalized.q)
  if (normalized.role) searchParams.set("role", normalized.role)
  if (normalized.isDelete !== undefined) {
    searchParams.set("isDelete", String(normalized.isDelete))
  }
  if (normalized.sortBy) searchParams.set("sortBy", normalized.sortBy)
  if (normalized.order) searchParams.set("order", normalized.order)

  const query = searchParams.toString()
  return query ? `?${query}` : ""
}

export async function getAdminUsers(params: AdminUsersQueryParams = {}) {
  const queryString = buildUsersQueryString(params)
  return apiGet<ApiSuccessResponse<AdminUsersListData>>(`/users${queryString}`)
}

export async function updateAdminUser(id: string, payload: UpdateAdminUserPayload) {
  return apiPut<ApiSuccessResponse<AdminUserItem>, UpdateAdminUserPayload>(`/users/${id}`, {
    body: payload,
  })
}

export async function softDeleteAdminUser(id: string) {
  return apiDelete<ApiSuccessResponse<AdminUserItem>>(`/users/${id}`)
}

export async function restoreAdminUser(id: string) {
  return apiPut<ApiSuccessResponse<AdminUserItem>, undefined>(`/users/restore/${id}`)
}

export { normalizeUsersQuery }
