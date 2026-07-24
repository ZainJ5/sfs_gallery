"use client";

import { useActionState, useState, useTransition } from "react";
import { Trash2, Download } from "lucide-react";
import { Card, Badge } from "@/app/admin/_components/kit";
import { Field, Input, Select, SubmitButton, FormError } from "@/app/admin/_components/form";

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-heading text-heading"
          : "border-transparent text-body hover:text-heading"
      }`}
    >
      {children}
    </button>
  );
}

export default function UsersClient({
  users,
  subscribers,
  saveUser,
  deleteUser,
  deleteSubscriber,
}) {
  const [tab, setTab] = useState("admins");
  const [state, formAction] = useActionState(saveUser, {});
  const [, startTransition] = useTransition();

  function removeUser(id) {
    if (!confirm("Delete this user?")) return;
    startTransition(() => deleteUser(id));
  }
  function removeSub(id) {
    if (!confirm("Remove this subscriber?")) return;
    startTransition(() => deleteSubscriber(id));
  }

  function exportCsv() {
    const rows = [["Email", "Name", "Subscribed"]].concat(
      subscribers.map((s) => [s.email, s.name || "", fmtDate(s.createdAt)])
    );
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-6 flex gap-2 border-b border-line">
        <Tab active={tab === "admins"} onClick={() => setTab("admins")}>
          Admin Users ({users.length})
        </Tab>
        <Tab active={tab === "subscribers"} onClick={() => setTab("subscribers")}>
          Subscribers ({subscribers.length})
        </Tab>
      </div>

      {tab === "admins" ? (
        <div className="grid gap-6 lg:grid-cols-[1fr,340px]">
          <Card className="p-0">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-body">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-medium text-heading">{u.name}</td>
                    <td className="px-4 py-3 text-body">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge tone={u.role === "admin" ? "blue" : "gray"}>{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => removeUser(u._id)}
                        className="rounded p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-body">
              Add / update user
            </h3>
            <form action={formAction} className="space-y-4">
              <FormError>{state?.error}</FormError>
              {state?.ok && (
                <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  {state.message}
                </div>
              )}
              <Field label="Name" required>
                <Input name="name" required />
              </Field>
              <Field label="Email" required hint="Existing email updates that user.">
                <Input type="email" name="email" required />
              </Field>
              <Field label="Password" hint="Leave blank to keep an existing user's password.">
                <Input type="password" name="password" autoComplete="new-password" />
              </Field>
              <Field label="Role">
                <Select name="role" defaultValue="admin">
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </Select>
              </Field>
              <SubmitButton>Save user</SubmitButton>
            </form>
          </Card>
        </div>
      ) : (
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="text-sm text-body">{subscribers.length} subscribers</span>
            <button
              onClick={exportCsv}
              disabled={subscribers.length === 0}
              className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-1.5 text-sm text-heading hover:bg-zinc-50 disabled:opacity-50"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-body">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Subscribed</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-body">
                    No subscribers yet.
                  </td>
                </tr>
              ) : (
                subscribers.map((s) => (
                  <tr key={s._id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 text-heading">{s.email}</td>
                    <td className="px-4 py-3 text-body">{s.name || "—"}</td>
                    <td className="px-4 py-3 text-body">{fmtDate(s.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => removeSub(s._id)}
                        className="rounded p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
