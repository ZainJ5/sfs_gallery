"use client";

import { useState, useRef } from "react";
import { UploadCloud, X } from "lucide-react";

export default function ImageUploader({ name, defaultValue = "", subdir = "" }) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  async function upload(file) {
    if (!file) return;
    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    if (subdir) fd.append("subdir", subdir);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setUrl(data.url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Preview"
            className="max-h-72 w-auto max-w-full rounded-md border border-line object-contain"
          />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute right-2 top-2 rounded-full bg-heading p-1.5 text-white shadow hover:bg-red-600"
            title="Remove"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
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
            upload(e.dataTransfer.files?.[0]);
          }}
          className={`flex min-h-[220px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            dragOver ? "border-brand bg-brand/5" : "border-line hover:border-brand hover:bg-zinc-50"
          }`}
        >
          <UploadCloud size={44} className="text-zinc-400" />
          <div>
            <p className="text-sm font-medium text-heading">
              {uploading ? "Uploading…" : "Click to upload or drag & drop"}
            </p>
            <p className="mt-1 text-xs text-body">
              JPG, PNG, WEBP, AVIF, GIF or SVG · automatically optimized
            </p>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => upload(e.target.files?.[0])}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
