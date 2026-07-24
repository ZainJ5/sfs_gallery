"use client";

import { useFormStatus } from "react-dom";

export function Field({ label, hint, required, children }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-sm font-medium text-heading">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
      )}
      {children}
      {hint && <span className="mt-1 block text-xs text-body">{hint}</span>}
    </label>
  );
}

const baseInput =
  "w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-heading outline-none transition focus:border-brand focus:ring-1 focus:ring-brand";

export function Input(props) {
  return <input {...props} className={`${baseInput} ${props.className || ""}`} />;
}

export function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`${baseInput} min-h-[96px] ${props.className || ""}`}
    />
  );
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${baseInput} ${props.className || ""}`}>
      {children}
    </select>
  );
}

export function Toggle({ name, defaultChecked = false, label }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3">
      <span className="relative inline-block h-6 w-11">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          value="true"
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-zinc-300 transition-colors peer-checked:bg-accent" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
      </span>
      {label && <span className="text-sm text-heading">{label}</span>}
    </label>
  );
}

export function SubmitButton({ children = "Save", className = "" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center gap-2 rounded-md bg-heading px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60 ${className}`}
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

export function FormError({ children }) {
  if (!children) return null;
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {children}
    </div>
  );
}
