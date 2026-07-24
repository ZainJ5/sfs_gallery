import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-dark">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-heading">Page not found</h1>
      <p className="mt-3 text-body">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-heading px-7 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-brand-dark"
      >
        Back to home
      </Link>
    </div>
  );
}
