"use client"

import {
  breakpoints,
  getDeviceType,
  type MainBreakpoint,
} from "@/lib/breakpoints"
import { useEffect, useState } from "react"

/**
 * Hook để detect breakpoint hiện tại
 *
 * @example
 * ```tsx
 * const { breakpoint, isMobile, isTablet, isDesktop, width } = useBreakpoint()
 *
 * if (isMobile) {
 *   return <MobileComponent />
 * }
 * ```
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<MainBreakpoint>("mobile")
  const [width, setWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Set initial values
    const updateBreakpoint = () => {
      const w = window.innerWidth
      setWidth(w)

      const deviceType = getDeviceType(w)
      setBreakpoint(deviceType)
      setIsMobile(deviceType === "mobile")
      setIsTablet(deviceType === "tablet")
      setIsDesktop(deviceType === "desktop")
    }

    // Initial call
    updateBreakpoint()

    // Add event listener
    window.addEventListener("resize", updateBreakpoint)

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateBreakpoint)
    }
  }, [])

  return {
    breakpoint,
    width,
    isMobile,
    isTablet,
    isDesktop,
    // Specific breakpoint checks
    isXs: width < parseInt(breakpoints.sm),
    isSm: width >= parseInt(breakpoints.sm) && width < parseInt(breakpoints.md),
    isMd: width >= parseInt(breakpoints.md) && width < parseInt(breakpoints.lg),
    isLg: width >= parseInt(breakpoints.lg) && width < parseInt(breakpoints.xl),
    isXl:
      width >= parseInt(breakpoints.xl) && width < parseInt(breakpoints["2xl"]),
    is2Xl: width >= parseInt(breakpoints["2xl"]),
  }
}

/**
 * Hook để check một breakpoint cụ thể
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 767px)')
 * ```
 */
export function useMediaQuery(query: string): boolean {
  // Khởi tạo giá trị ban đầu ngay trong useState (thay vì gọi setState trong effect)
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const media = window.matchMedia(query)

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    if (media.addEventListener) {
      media.addEventListener("change", listener)
    } else {
      media.addListener(listener)
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener)
      } else {
        media.removeListener(listener)
      }
    }
  }, [query])

  return matches
}
