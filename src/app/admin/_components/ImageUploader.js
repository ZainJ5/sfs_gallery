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
            className="h-40 w-40 rounded-md border border-line object-cover"
          />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute -right-2 -top-2 rounded-full bg-heading p-1 text-white shadow hover:bg-red-600"
            title="Remove"
          >
            <X size={14} />
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
          className={`flex h-40 w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed text-center text-xs transition-colors ${
            dragOver ? "border-brand bg-brand/5" : "border-line hover:border-brand"
          }`}
        >
          <UploadCloud size={22} className="text-zinc-400" />
          <span className="text-body">
            {uploading ? "Uploading…" : "Click or drop image"}
          </span>
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
