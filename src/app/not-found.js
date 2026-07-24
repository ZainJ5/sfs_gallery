import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-dark">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-heading">Page not found</h1>
      <p className="mt-3 text-body">This page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-heading px-7 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-brand-dark"
      >
        Back to home
      </Link>
    </div>
  );
}
