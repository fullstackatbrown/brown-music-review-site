export default function ReviewLoading() {
  return (
    // Mirrors the article layout in page.tsx so the skeleton doesn't flash a
    // different shape (or background colour) than the page it resolves into.
    <section className="bg-white px-6 sm:px-10 lg:px-12 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 h-3 w-24 animate-pulse rounded-full bg-stone-200" />
        <div className="mb-2 h-9 w-full animate-pulse rounded-lg bg-stone-200" />
        <div className="mb-4 h-9 w-3/4 animate-pulse rounded-lg bg-stone-200" />

        <div className="mb-6 h-px w-full bg-gray-200" />

        <div className="mb-3 aspect-[3/2] w-full animate-pulse rounded-md bg-stone-200" />
        <div className="mb-6 h-3 w-44 animate-pulse rounded-full bg-stone-200" />

        <div className="mb-6 h-px w-full bg-gray-200" />

        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded-full bg-stone-200" />
          <div className="h-4 w-full animate-pulse rounded-full bg-stone-200" />
          <div className="h-4 w-11/12 animate-pulse rounded-full bg-stone-200" />
          <div className="h-4 w-full animate-pulse rounded-full bg-stone-200" />
          <div className="h-4 w-4/5 animate-pulse rounded-full bg-stone-200" />
        </div>
      </div>
    </section>
  )
}
