"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ action, id, redirectAfter, label = "Delete" }) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    startTransition(async () => {
      await action(id);
      if (redirectAfter) window.location.href = redirectAfter;
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
    >
      <Trash2 size={16} />
      {pending ? "Deleting…" : label}
    </button>
  );
}
