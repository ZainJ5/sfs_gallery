import Link from "next/link";

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-heading">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-body">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-lg border border-line bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, href }) {
  const inner = (
    <div className="flex items-center gap-4 rounded-lg border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {Icon && (
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-zinc-100 text-brand-dark">
          <Icon size={20} />
        </div>
      )}
      <div>
        <div className="text-2xl font-semibold text-heading">{value}</div>
        <div className="text-xs uppercase tracking-wide text-body">{label}</div>
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function Badge({ children, tone = "gray" }) {
  const tones = {
    gray: "bg-zinc-100 text-zinc-700",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-sky-100 text-sky-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone] || tones.gray}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-white p-12 text-center">
      <h3 className="text-base font-medium text-heading">{title}</h3>
      {description && <p className="mt-1 text-sm text-body">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function ButtonLink({ href, children, variant = "primary" }) {
  const styles = {
    primary: "bg-heading text-white hover:bg-brand-dark",
    outline: "border border-line bg-white text-heading hover:bg-zinc-50",
  };
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${styles[variant]}`}
    >
      {children}
    </Link>
  );
}
