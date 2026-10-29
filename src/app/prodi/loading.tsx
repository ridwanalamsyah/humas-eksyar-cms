export default function ProdiLoading() {
  return (
    <div className="mx-auto max-w-[1024px] px-4 py-16 sm:px-6">
      <div className="space-y-6">
        <div className="h-5 w-44 animate-pulse rounded-full bg-mist" />
        <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-mist" />
        <div className="h-5 w-2/3 animate-pulse rounded-xl bg-mist" />
        <div className="grid gap-4 pt-6 sm:grid-cols-3">
          <div className="h-48 animate-pulse rounded-[24px] bg-mist" />
          <div className="h-48 animate-pulse rounded-[24px] bg-mist" />
          <div className="h-48 animate-pulse rounded-[24px] bg-mist" />
        </div>
      </div>
    </div>
  );
}
