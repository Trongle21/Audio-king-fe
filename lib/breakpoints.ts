/**
 * Breakpoints cho responsive design
 *
 * 3 breakpoints chính:
 * - MOBILE: 0-767px (mobile devices)
 * - TABLET: 768-1023px (tablet devices)
 * - DESKTOP: 1024px+ (desktop/laptop)
 *
 * Tổng cộng 8 breakpoints để cover các kích cỡ màn hình khác nhau
 */

export const breakpoints = {
  // Mobile nhỏ (iPhone SE, etc.)
  xs: "480px",

  // Mobile lớn (iPhone, Android phones) - CHÍNH
  sm: "640px",

  // Tablet nhỏ (iPad Mini, etc.)
  md: "768px",

  // Tablet lớn / Desktop nhỏ (iPad, small laptops) - CHÍNH
  lg: "1024px",

  // Desktop (laptops, monitors) - CHÍNH
  xl: "1280px",

  // Desktop lớn (large monitors)
  "2xl": "1536px",

  // Desktop rất lớn (ultra-wide monitors)
  "3xl": "1920px",

  // Ultra-wide (4K monitors)
  "4xl": "2560px",
} as const

/**
 * Breakpoints chính cho 3 loại màn hình
 */
export const mainBreakpoints = {
  /** Mobile: 0-767px */
  mobile: breakpoints.xs,

  /** Tablet: 768-1023px */
  tablet: breakpoints.md,

  /** Desktop: 1024px+ */
  desktop: breakpoints.lg,
} as const

/**
 * Media queries helpers
 */
export const mediaQueries = {
  /** Mobile: từ 480px trở lên */
  mobile: `(min-width: ${breakpoints.xs})`,

  /** Mobile lớn: từ 640px trở lên */
  mobileLarge: `(min-width: ${breakpoints.sm})`,

  /** Tablet: từ 768px trở lên */
  tablet: `(min-width: ${breakpoints.md})`,

  /** Desktop: từ 1024px trở lên */
  desktop: `(min-width: ${breakpoints.lg})`,

  /** Desktop lớn: từ 1280px trở lên */
  desktopLarge: `(min-width: ${breakpoints.xl})`,

  /** Desktop rất lớn: từ 1536px trở lên */
  desktopXLarge: `(min-width: ${breakpoints["2xl"]})`,

  /** Ultra-wide: từ 1920px trở lên */
  ultraWide: `(min-width: ${breakpoints["3xl"]})`,

  /** 4K: từ 2560px trở lên */
  "4k": `(min-width: ${breakpoints["4xl"]})`,

  // Max-width queries
  /** Chỉ mobile: dưới 768px */
  mobileOnly: `(max-width: ${parseInt(breakpoints.md) - 1}px)`,

  /** Chỉ tablet: từ 768px đến 1023px */
  tabletOnly: `(min-width: ${breakpoints.md}) and (max-width: ${parseInt(breakpoints.lg) - 1}px)`,

  /** Chỉ desktop: từ 1024px trở lên */
  desktopOnly: `(min-width: ${breakpoints.lg})`,
} as const

/**
 * Tailwind CSS breakpoint values (để sử dụng với Tailwind)
 */
export const tailwindBreakpoints = {
  xs: breakpoints.xs,
  sm: breakpoints.sm,
  md: breakpoints.md,
  lg: breakpoints.lg,
  xl: breakpoints.xl,
  "2xl": breakpoints["2xl"],
  "3xl": breakpoints["3xl"],
  "4xl": breakpoints["4xl"],
} as const

/**
 * Type definitions
 */
export type Breakpoint = keyof typeof breakpoints
export type MainBreakpoint = keyof typeof mainBreakpoints

/**
 * Utility functions
 */
export const isMobile = (width: number): boolean =>
  width < parseInt(breakpoints.md)
export const isTablet = (width: number): boolean =>
  width >= parseInt(breakpoints.md) && width < parseInt(breakpoints.lg)
export const isDesktop = (width: number): boolean =>
  width >= parseInt(breakpoints.lg)

/**
 * Get device type based on width
 */
export const getDeviceType = (
  width: number
): "mobile" | "tablet" | "desktop" => {
  if (isMobile(width)) return "mobile"
  if (isTablet(width)) return "tablet"
  return "desktop"
}
