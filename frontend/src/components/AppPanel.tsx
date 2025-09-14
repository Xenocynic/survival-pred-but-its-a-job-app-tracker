// src/components/AppPanel.tsx
import { useEffect, useMemo, useState } from "react";
import { X, Pencil, Save } from "lucide-react";
import type { Application } from "../types";
import { Link } from "react-router-dom";

type Props = {
  app: Application;
  onSave: (patch: Partial<Pick<Application, "role" | "company">>) => void;
  onClose: () => void;
};

export default function AppPanel({ app, onSave, onClose }: Props) {
  const [editing, setEditing] = useState(false);
  const [role, setRole] = useState(app.role);
  const [company, setCompany] = useState(app.company);

  useEffect(() => {
    // if app changes under us (moving selection), reset
    setRole(app.role);
    setCompany(app.company);
    setEditing(false);
  }, [app.id]);

  const timeline = useMemo(() => {
    // sorted ascending by date
    return [...(app.timeline ?? [])].sort(
      (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime()
    );
  }, [app.timeline]);

  const canSave = role.trim() && company.trim() && (role !== app.role || company !== app.company);

  function handleSave() {
    if (!canSave) return;
    onSave({ role: role.trim(), company: company.trim() });
    setEditing(false);
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-end"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/30"
        aria-label="Close"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative w-full max-w-lg h-full bg-white shadow-xl flex flex-col">
        <header className="px-4 py-3 border-b flex items-center gap-2">
          <div className="font-semibold truncate">{app.role} @ {app.company}</div>
          <button
            className="ml-auto p-2 rounded-lg hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <div className="p-4 overflow-y-auto space-y-6">
          {/* identity block */}
          <section>
            <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Application</h2>

            <div className="grid gap-3">
              <label className="block">
                <div className="text-xs text-gray-500 mb-1">Role</div>
                <input
                  className="w-full border rounded-xl px-3 py-2 text-sm disabled:bg-gray-50"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={!editing}
                />
              </label>

              <label className="block">
                <div className="text-xs text-gray-500 mb-1">Company</div>
                <input
                  className="w-full border rounded-xl px-3 py-2 text-sm disabled:bg-gray-50"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={!editing}
                />
              </label>

              <div className="text-xs text-gray-500">
                Created: <span className="text-gray-700">{new Date(app.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500">
                Stage: <span className="text-gray-700">{app.stage}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              {!editing ? (
                <button
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm hover:bg-gray-50"
                  onClick={() => setEditing(true)}
                >
                  <Pencil size={14} /> Edit
                </button>
              ) : (
                <button
                  disabled={!canSave}
                  onClick={handleSave}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white ${canSave ? "bg-gray-900 hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"}`}
                >
                  <Save size={14} /> Save
                </button>
              )}
            </div>
          </section>

          {/* timeline */}
          <section>
            <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Timeline</h2>
            <ol className="space-y-2">
              {timeline.map((t, i) => (
                <li key={i} className="text-sm flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-gray-400" />
                  <span className="font-medium">{t.stage}</span>
                  <span className="text-gray-500">{new Date(t.at).toLocaleString()}</span>
                </li>
              ))}
              {!timeline.length && <div className="text-sm text-gray-500">No timeline yet.</div>}
            </ol>
          </section>

          {/* resume actions */}
          <section>
            <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Resume</h2>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/editor"
                className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50"
                title="Open the master resume"
              >
                Resume
              </Link>
              <Link
                to={`/editor/${app.id}`}
                className="px-3 py-2 rounded-xl text-white text-sm animated-gradient hover:opacity-90"
                title="Open/edit the draft attached to this application"
              >
                Resume Draft
              </Link>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              “Resume” opens your Master. “Resume Draft” opens the copy attached only to this application.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
