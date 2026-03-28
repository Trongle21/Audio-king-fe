// Hooks - Re-export tất cả hooks từ client-app và admin-app

// Client App Hooks
export * from "./client-app/src/hooks"

// Admin App Hooks (namespace export to avoid naming collisions)
export * as adminHooks from "./admin-app/src/hooks"
