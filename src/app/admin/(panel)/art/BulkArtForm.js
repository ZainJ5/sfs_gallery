"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X } from "lucide-react";
import { Card } from "@/app/admin/_components/kit";
import { Field, Input, Select, FormError } from "@/app/admin/_components/form";

let seq = 0;

// Turn an uploaded file name into a sensible default title (like WordPress does).
function titleFromName(name) {
  const base = String(name || "")
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return base.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function BulkArtForm({ artists = [], action }) {
  const router = useRouter();
  const [artist, setArtist] = useState("");
  const [rows, setRows] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef(null);

  async function uploadMany(files) {
    const list = Array.from(files || []);
    if (list.length === 0) return;
    setError("");
    setUploading(true);
    try {
      for (const file of list) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("subdir", "art");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed.");
        setRows((prev) => [
          ...prev,
          {
            id: ++seq,
            image: data.url,
            title: titleFromName(file.name),
            dimensions: "",
            medium: "",
            price: "",
            published: true,
          },
        ]);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  const update = (id, field, value) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  const remove = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  function submit() {
    setError("");
    const items = rows.filter((r) => r.image);
    if (items.length === 0) return setError("Upload at least one image first.");
    if (items.some((r) => !r.title.trim())) return setError("Every image needs a title.");
    startTransition(async () => {
      const res = await action({ artist: artist || null, items });
      if (res?.error) setError(res.error);
      else router.push("/admin/art");
    });
  }

  return (
    <div className="space-y-6">
      <FormError>{error}</FormError>

      <Card>
        <div className="max-w-sm">
          <Field label="Artist" hint="Assigned to every image below.">
            <Select value={artist} onChange={(e) => setArtist(e.target.value)}>
              <option value="">— Unassigned —</option>
              {artists.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          uploadMany(e.dataTransfer.files);
        }}
        className={`flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragOver ? "border-brand bg-brand/5" : "border-line hover:border-brand hover:bg-zinc-50"
        }`}
      >
        <UploadCloud size={40} className="text-zinc-400" />
        <div>
          <p className="text-sm font-medium text-heading">
            {uploading ? "Uploading…" : "Click to upload or drag & drop images"}
          </p>
          <p className="mt-1 text-xs text-body">
            Each image becomes its own artwork — set the details for each below.
          </p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          uploadMany(e.target.files);
          e.target.value = "";
        }}
      />

      {rows.length > 0 && (
        <div className="space-y-4">
          {rows.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.image}
                  alt=""
                  className="h-28 w-28 shrink-0 rounded-md border border-line object-cover"
                />
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <Field label="Title" required>
                    <Input value={r.title} onChange={(e) => update(r.id, "title", e.target.value)} required />
                  </Field>
                  <Field label="Size">
                    <Input
                      value={r.dimensions}
                      onChange={(e) => update(r.id, "dimensions", e.target.value)}
                      placeholder={'24" x 36"'}
                    />
                  </Field>
                  <Field label="Medium">
                    <Input
                      value={r.medium}
                      onChange={(e) => update(r.id, "medium", e.target.value)}
                      placeholder="Oil on canvas"
                    />
                  </Field>
                  <Field label="Price">
                    <Input
                      value={r.price}
                      onChange={(e) => update(r.id, "price", e.target.value)}
                      placeholder="$1,200"
                    />
                  </Field>
                </div>
                <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
                  <button
                    type="button"
                    onClick={() => remove(r.id)}
                    className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                    title="Remove"
                  >
                    <X size={18} />
                  </button>
                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-body">
                    <input
                      type="checkbox"
                      checked={r.published}
                      onChange={(e) => update(r.id, "published", e.target.checked)}
                      className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
                    />
                    Published
                  </label>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={pending || uploading || rows.length === 0}
          className="inline-flex items-center gap-2 rounded-md bg-heading px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {pending ? "Saving…" : `Save ${rows.length} artwork${rows.length === 1 ? "" : "s"}`}
        </button>
        <a href="/admin/art" className="rounded-md px-4 py-2 text-sm text-body hover:text-heading">
          Cancel
        </a>
      </div>
    </div>
  );
}
