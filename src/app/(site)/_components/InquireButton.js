"use client";

import { useState } from "react";
import { X } from "lucide-react";
import InquiryForm from "./InquiryForm";

export default function InquireButton({ subject = "", label = "Inquire" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mt-10 text-center">
        <button
          onClick={() => setOpen(true)}
          className="border border-heading px-10 py-3.5 text-base uppercase tracking-[2px] text-heading transition-colors hover:bg-heading hover:text-white"
        >
          {label}
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-heading">
                Inquire{subject ? ` — ${subject}` : ""}
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-body hover:text-heading"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <InquiryForm artistName={subject} artworkTitle={subject} />
          </div>
        </div>
      )}
    </>
  );
}
