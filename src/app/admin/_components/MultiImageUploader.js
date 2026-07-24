"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function MultiImageUploader({ name, defaultValue = [], subdir = "" }) {
  const [urls, setUrls] = useState(Array.isArray(defaultValue) ? defaultValue : []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function uploadMany(files) {
    if (!files || files.length === 0) return;
    setError("");
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        if (subdir) fd.append("subdir", subdir);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed.");
        setUrls((prev) => [...prev, data.url]);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  function remove(i) {
    setUrls((prev) => prev.filter((_, idx) => idx !== i));
  }

  function move(i, dir) {
    setUrls((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div>
      {urls.map((u) => (
        <input key={u} type="hidden" name={name} value={u} />
      ))}

      <div className="flex flex-wrap gap-3">
        {urls.map((u, i) => (
          <div key={u + i} className="group relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={u}
              alt=""
              className="h-28 w-28 rounded-md border border-line object-cover"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute -right-2 -top-2 rounded-full bg-heading p-1 text-white shadow hover:bg-red-600"
              title="Remove"
            >
              <X size={12} />
            </button>
            <div className="absolute inset-x-0 bottom-0 flex justify-between rounded-b-md bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => move(i, -1)}
                className="p-1 text-white hover:text-brand"
                title="Move left"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                className="p-1 text-white hover:text-brand"
                title="Move right"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}

        <div
          onClick={() => inputRef.current?.click()}
          className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-line text-center text-xs text-body transition-colors hover:border-brand"
        >
          <UploadCloud size={20} className="text-zinc-400" />
          {uploading ? "Uploading…" : "Add images"}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => uploadMany(e.target.files)}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
