"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, Search } from "lucide-react";
import { Badge } from "@/app/admin/_components/kit";

function valueOf(row, key) {
  return key.split(".").reduce((o, k) => (o == null ? o : o[k]), row);
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncate(s, max) {
  const str = String(s ?? "");
  if (!max || str.length <= max) return str;
  return str.slice(0, max) + "…";
}

/**
 * Serializable column descriptors (no functions — safe to pass from a
 * server component). Supported `type`:
 *   text (default) | thumb | image | badge | bool | date | count
 */
function Cell({ col, row }) {
  const v = valueOf(row, col.key);
  switch (col.type) {
    case "image":
      return v ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={v} alt="" className="h-10 w-10 rounded object-cover" />
      ) : (
        <span className="text-zinc-300">—</span>
      );
    case "thumb":
      return (
        <div className="flex items-center gap-3">
          {row[col.image] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row[col.image]}
              alt=""
              className="h-10 w-10 shrink-0 rounded object-cover"
            />
          ) : (
            <div className="h-10 w-10 shrink-0 rounded bg-zinc-100" />
          )}
          <span className="font-medium text-heading">{v}</span>
        </div>
      );
    case "badge":
      return v ? <Badge tone={col.tone || "gray"}>{v}</Badge> : <span>—</span>;
    case "bool":
      return v ? (
        <Badge tone="green">{col.trueLabel || "Yes"}</Badge>
      ) : (
        <Badge tone="gray">{col.falseLabel || "No"}</Badge>
      );
    case "date":
      return <span className="text-body">{fmtDate(v)}</span>;
    case "count":
      return <span>{Array.isArray(v) ? v.length : Number(v || 0)}</span>;
    default:
      return <span className="text-heading">{truncate(v, col.max)}</span>;
  }
}

export default function DataTable({
  columns,
  rows,
  basePath,
  deleteAction,
  searchKeys = [],
  emptyLabel = "No records yet.",
}) {
  const [q, setQ] = useState("");
  const [, startTransition] = useTransition();
  const [busyId, setBusyId] = useState(null);

  const query = q.trim().toLowerCase();
  const filtered = query
    ? rows.filter((r) =>
        searchKeys.some((k) =>
          String(valueOf(r, k) || "").toLowerCase().includes(query)
        )
      )
    : rows;

  function handleDelete(id) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteAction(id);
      setBusyId(null);
    });
  }

  return (
    <div className="rounded-lg border border-line bg-white shadow-sm">
      {searchKeys.length > 0 && (
        <div className="border-b border-line p-3">
          <div className="relative max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-md border border-line py-2 pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-body">
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-medium">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-10 text-center text-body"
                >
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr
                  key={row._id}
                  className={`border-b border-line last:border-0 hover:bg-zinc-50 ${
                    busyId === row._id ? "opacity-50" : ""
                  }`}
                >
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 align-middle">
                      <Cell col={c} row={row} />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right align-middle">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`${basePath}/${row._id}/edit`}
                        className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-heading"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      {deleteAction && (
                        <button
                          onClick={() => handleDelete(row._id)}
                          disabled={busyId === row._id}
                          className="rounded p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
