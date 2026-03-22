"use client"

import * as React from "react"

import type { AdminTab } from "./types"

export function useAdminTabs(defaultTab: AdminTab = "dashboard") {
  const [activeTab, setActiveTab] = React.useState<AdminTab>(defaultTab)

  return {
    activeTab,
    setActiveTab,
  }
}
