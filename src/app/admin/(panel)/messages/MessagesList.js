"use client";

import { useState, useTransition } from "react";
import { Mail, Trash2, MailOpen, Phone } from "lucide-react";
import { Badge } from "@/app/admin/_components/kit";

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessagesList({ messages, setRead, deleteMessage }) {
  const [selectedId, setSelectedId] = useState(messages[0]?._id || null);
  const [, startTransition] = useTransition();

  const selected = messages.find((m) => m._id === selectedId) || null;

  function open(m) {
    setSelectedId(m._id);
    if (!m.read) startTransition(() => setRead(m._id, true));
  }

  function remove(id) {
    if (!confirm("Delete this message?")) return;
    startTransition(async () => {
      await deleteMessage(id);
      if (selectedId === id) setSelectedId(null);
    });
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-white p-12 text-center text-body">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[340px,1fr]">
      <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-line bg-white shadow-sm">
        {messages.map((m) => (
          <button
            key={m._id}
            onClick={() => open(m)}
            className={`flex w-full items-start gap-3 border-b border-line px-4 py-3 text-left last:border-0 hover:bg-zinc-50 ${
              selectedId === m._id ? "bg-zinc-50" : ""
            }`}
          >
            <div className={`mt-1 ${m.read ? "text-zinc-300" : "text-brand-dark"}`}>
              {m.read ? <MailOpen size={16} /> : <Mail size={16} />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className={`truncate text-sm ${m.read ? "text-heading" : "font-semibold text-heading"}`}>
                  {m.name}
                </span>
                {!m.read && <Badge tone="amber">New</Badge>}
              </div>
              <p className="truncate text-xs text-body">{m.subject || m.body}</p>
              <p className="mt-0.5 text-[11px] text-zinc-400">{fmtDate(m.createdAt)}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
        {selected ? (
          <div>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-heading">
                  {selected.subject || "(no subject)"}
                </h2>
                <p className="mt-1 text-sm text-body">
                  From <span className="font-medium text-heading">{selected.name}</span> ·{" "}
                  <a href={`mailto:${selected.email}`} className="text-brand-dark hover:underline">
                    {selected.email}
                  </a>
                </p>
                {selected.phone && (
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-body">
                    <Phone size={13} /> {selected.phone}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <Badge tone="blue">{selected.source}</Badge>
                  {selected.artistName && <Badge tone="gray">{selected.artistName}</Badge>}
                  <span className="text-xs text-zinc-400">{fmtDate(selected.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={() => remove(selected._id)}
                className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
            <div className="whitespace-pre-wrap border-t border-line pt-4 text-sm leading-relaxed text-heading">
              {selected.body}
            </div>
          </div>
        ) : (
          <p className="text-sm text-body">Select a message to read it.</p>
        )}
      </div>
    </div>
  );
}
