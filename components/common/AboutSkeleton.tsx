export function AboutSkeleton() {
  return (
    <section className="space-y-5" aria-label="Dang tai anh gioi thieu">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="aspect-4/3 animate-pulse rounded-lg border bg-muted"
          />
        ))}
      </div>
    </section>
  )
}

