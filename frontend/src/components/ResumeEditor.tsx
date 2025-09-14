import { useMemo, useState } from "react";
import type { Resume, ResumeBlock } from "../types";
import { Plus, X } from "lucide-react";

type Props = {
  resume: Resume;
  onChange: (next: Resume) => void;
};

const BLOCK_KINDS = [
  { kind: "summary" as const, label: "Summary" },
  { kind: "experience" as const, label: "Experience" },
  { kind: "projects" as const, label: "Projects" },
  { kind: "skills" as const, label: "Skills" },
  { kind: "education" as const, label: "Education" },
];

export function ResumeEditor({ resume, onChange }: Props) {
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  const blocks = resume.blocks;
  const current = blocks[selected];

  const meta = resume.meta ?? {};

  function updateBlock(idx: number, next: ResumeBlock) {
    const copy = { ...resume, blocks: resume.blocks.slice() };
    copy.blocks[idx] = next;
    onChange(copy);
  }

  function addBlock(kind: ResumeBlock["kind"]) {
    const blank: ResumeBlock =
      kind === "summary"
        ? { kind, text: "" }
        : kind === "skills"
        ? { kind, items: [] }
        : kind === "experience"
        ? { kind, entries: [] }
        : kind === "projects"
        ? { kind, entries: [] }
        : { kind: "education", entries: [] };
    const copy = { ...resume, blocks: [...resume.blocks, blank] };
    onChange(copy);
    setSelected(copy.blocks.length - 1);
    setTab("edit");
  }

  function removeBlock(idx: number) {
    if (!blocks.length) return;
    const copy = { ...resume, blocks: blocks.filter((_, i) => i !== idx) };
    onChange(copy);
    setSelected(Math.max(0, idx - 1));
  }

 function updateMeta(patch: Partial<NonNullable<Resume["meta"]>>) {
    onChange({ ...resume, meta: { ...(resume.meta ?? {}), ...patch } });
  }

  const title = useMemo(() => resume.name || "Untitled Resume", [resume.name]);

  return (
    <div className="grid lg:grid-cols-[260px,1fr] gap-4">
      {/* Left: block list & header meta */}
      <aside className="rounded-2xl border bg-white p-3">
        <div className="font-semibold mb-2">{title}</div>

        {/* Header (name/contact) editor */}
        <div className="space-y-2 mb-3">
          <div className="text-xs text-gray-500">Header</div>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            placeholder="Full name"
            value={meta.fullName ?? ""}
            onChange={(e) => updateMeta({ fullName: e.target.value })}
          />
          <input
            className="w-full border rounded-lg p-2 text-sm"
            placeholder="Title (e.g., Software Engineer)"
            value={meta.title ?? ""}
            onChange={(e) => updateMeta({ title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="border rounded-lg p-2 text-sm"
              placeholder="Email"
              value={meta.email ?? ""}
              onChange={(e) => updateMeta({ email: e.target.value })}
            />
            <input
              className="border rounded-lg p-2 text-sm"
              placeholder="Phone"
              value={meta.phone ?? ""}
              onChange={(e) => updateMeta({ phone: e.target.value })}
            />
          </div>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            placeholder="Location"
            value={meta.location ?? ""}
            onChange={(e) => updateMeta({ location: e.target.value })}
          />
        </div>

        {/* Blocks list */}
        <ul className="space-y-1">
          {blocks.map((b, i) => (
            <li key={i}>
              <button
                className={`w-full text-left px-3 py-2 rounded-xl text-sm ${
                  i === selected ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setSelected(i);
                  setTab("edit");
                }}
              >
                {i + 1}. {b.kind}
              </button>
            </li>
          ))}
        </ul>

        {/* Add block */}
        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-1">Add block</div>
          <div className="flex flex-wrap gap-2">
            {BLOCK_KINDS.map((k) => (
              <button
                key={k.kind}
                onClick={() => addBlock(k.kind)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs hover:bg-gray-50"
              >
                <Plus size={12} /> {k.label}
              </button>
            ))}
          </div>
        </div>

        {/* Switcher */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            className={`px-3 py-2 rounded-xl text-sm ${
              tab === "edit" ? "bg-gray-900 text-white" : "border"
            }`}
            onClick={() => setTab("edit")}
          >
            Edit
          </button>
          <button
            className={`px-3 py-2 rounded-xl text-sm ${
              tab === "preview" ? "bg-gray-900 text-white" : "border"
            }`}
            onClick={() => setTab("preview")}
          >
            Preview
          </button>
        </div>
      </aside>

      {/* Right: editor OR preview */}
      <section className="rounded-2xl border bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-600">
            {tab === "preview"
              ? "Print from your browser (Ctrl/Cmd + P) to get a perfectly formatted PDF."
              : "Edit the selected section."}
          </div>
        </div>

        {tab === "edit" ? (
          !current ? (
            <div className="text-sm text-gray-500">
              No blocks yet. Add one on the left.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold capitalize">{current.kind}</div>
                <button
                  onClick={() => removeBlock(selected)}
                  className="inline-flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700"
                >
                  <X size={14} /> Remove block
                </button>
              </div>

              {current.kind === "summary" && (
                <textarea
                  value={current.text}
                  onChange={(e) =>
                    updateBlock(selected, {
                      kind: "summary",
                      text: e.target.value,
                    })
                  }
                  className="w-full h-40 border rounded-xl p-3 text-sm"
                  placeholder="Short professional summary..."
                />
              )}

              {current.kind === "skills" && (
                <SkillsEditor
                  items={current.items}
                  onChange={(items) =>
                    updateBlock(selected, { kind: "skills", items })
                  }
                />
              )}

              {current.kind === "experience" && (
                <ExperienceEditor
                  entries={current.entries}
                  onChange={(entries) =>
                    updateBlock(selected, { kind: "experience", entries })
                  }
                />
              )}

              {current.kind === "projects" && (
                <ProjectsEditor
                  entries={current.entries}
                  onChange={(entries) =>
                    updateBlock(selected, { kind: "projects", entries })
                  }
                />
              )}

              {current.kind === "education" && (
                <EducationEditor
                  entries={current.entries}
                  onChange={(entries) =>
                    updateBlock(selected, { kind: "education", entries })
                  }
                />
              )}
            </div>
          )
        ) : (
          <ResumePreview resume={resume} />
        )}
      </section>
    </div>
  );
}

/* ===========================================
   ============  PREVIEW RENDERER  ============
   =========================================== */

function ResumePreview({ resume }: { resume: Resume }) {
  const meta = resume.meta ?? {};
  const blocks = resume.blocks;

  return (
    <div className="printable mx-auto w-[850px] max-w-full bg-white shadow-sm ring-1 ring-black/5 p-8 md:p-10">
      {/* Header */}
      <header className="text-center mb-5">
        <h1 className="text-3xl font-semibold tracking-tight">
          {meta.fullName || "Your Name"}
        </h1>
        {meta.title && (
          <div className="text-sm text-gray-700 mt-1">{meta.title}</div>
        )}
        <div className="mt-2 text-xs text-gray-600 flex gap-3 justify-center flex-wrap">
          {meta.email && <span>{meta.email}</span>}
          {meta.phone && <span>{meta.phone}</span>}
          {meta.location && <span>{meta.location}</span>}
          {meta.links?.map((l, i) => (
            <a
              key={i}
              href={l.url}
              className="hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {l.label}
            </a>
          ))}
        </div>
      </header>

      <div className="h-px bg-gray-200 my-4" />

      {/* Blocks */}
      <div className="space-y-5">
        {blocks.map((b, i) => (
          <section key={i}>
            {b.kind === "summary" && (
              <>
                <SectionTitle>Summary</SectionTitle>
                <p className="text-sm leading-6 text-gray-800 whitespace-pre-wrap">
                  {b.text}
                </p>
              </>
            )}

            {b.kind === "skills" && (
              <>
                <SectionTitle>Skills</SectionTitle>
                <div className="text-sm text-gray-800">
                  {b.items?.length ? b.items.join(" · ") : ""}
                </div>
              </>
            )}

            {b.kind === "experience" && (
              <>
                <SectionTitle>Experience</SectionTitle>
                <div className="space-y-3">
                  {b.entries.map((e, idx) => (
                    <div key={idx}>
                      <div className="flex items-baseline justify-between">
                        <div className="font-medium">
                          {e.role}
                          {e.company ? ` — ${e.company}` : ""}
                        </div>
                        {e.dates && (
                          <div className="text-xs text-gray-600">{e.dates}</div>
                        )}
                      </div>
                      {e.bullets?.length > 0 && (
                        <ul className="list-disc ml-5 text-sm leading-6 text-gray-800">
                          {e.bullets.map((li, j) => (
                            <li key={j}>{li}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {b.kind === "projects" && (
              <>
                <SectionTitle>Projects</SectionTitle>
                <div className="space-y-3">
                  {b.entries.map((p, idx) => (
                    <div key={idx}>
                      <div className="flex items-baseline justify-between">
                        <div className="font-medium">{p.name}</div>
                        {p.tech?.length ? (
                          <div className="text-xs text-gray-600">
                            {p.tech.join(", ")}
                          </div>
                        ) : null}
                      </div>
                      {p.desc && (
                        <p className="text-sm leading-6 text-gray-800">
                          {p.desc}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {b.kind === "education" && (
              <>
                <SectionTitle>Education</SectionTitle>
                <div className="space-y-2">
                  {b.entries.map((ed, idx) => (
                    <div key={idx} className="flex items-baseline justify-between">
                      <div className="font-medium">
                        {ed.credential}
                        {ed.school ? ` — ${ed.school}` : ""}
                      </div>
                      {ed.dates && (
                        <div className="text-xs text-gray-600">{ed.dates}</div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="uppercase tracking-wider text-xs text-gray-500 mb-2">
      {children}
    </h2>
  );
}

/* ---- Small editors for each structured block (unchanged logic) ---- */

function SkillsEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (x: string[]) => void;
}) {
  const [text, setText] = useState(items.join(", "));
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600">Comma-separated skills</label>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onChange(text.split(",").map((s) => s.trim()).filter(Boolean))}
        className="w-full border rounded-xl p-2 text-sm"
        placeholder="React, TypeScript, SQL"
      />
    </div>
  );
}

function ExperienceEditor({
  entries,
  onChange,
}: {
  entries: { company: string; role: string; bullets: string[]; dates?: string }[];
  onChange: (x: { company: string; role: string; bullets: string[]; dates?: string }[]) => void;
}) {
  const add = () =>
    onChange([...entries, { company: "", role: "", bullets: [] }]);
  const upd = (i: number, patch: Partial<(typeof entries)[number]>) => {
    const copy = entries.slice();
    copy[i] = { ...copy[i], ...patch };
    onChange(copy);
  };
  const del = (i: number) => onChange(entries.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <button
        onClick={add}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs hover:bg-gray-50"
      >
        <Plus size={12} /> Add experience
      </button>
      {entries.map((e, i) => (
        <div key={i} className="border rounded-xl p-3 space-y-2">
          <div className="grid md:grid-cols-2 gap-2">
            <input
              className="border rounded-lg p-2 text-sm"
              value={e.company}
              placeholder="Company"
              onChange={(ev) => upd(i, { company: ev.target.value })}
            />
            <input
              className="border rounded-lg p-2 text-sm"
              value={e.role}
              placeholder="Role"
              onChange={(ev) => upd(i, { role: ev.target.value })}
            />
          </div>
          <input
            className="border rounded-lg p-2 text-sm"
            value={e.dates ?? ""}
            placeholder="Dates (e.g., 2023–2024)"
            onChange={(ev) => upd(i, { dates: ev.target.value })}
          />
          <BulletsEditor
            value={e.bullets}
            onChange={(bullets) => upd(i, { bullets })}
          />
          <button
            onClick={() => del(i)}
            className="text-xs text-rose-600 hover:underline"
          >
            Remove entry
          </button>
        </div>
      ))}
    </div>
  );
}

function ProjectsEditor({
  entries,
  onChange,
}: {
  entries: { name: string; desc: string; tech: string[] }[];
  onChange: (x: { name: string; desc: string; tech: string[] }[]) => void;
}) {
  const add = () => onChange([...entries, { name: "", desc: "", tech: [] }]);
  const upd = (i: number, patch: Partial<(typeof entries)[number]>) => {
    const copy = entries.slice();
    copy[i] = { ...copy[i], ...patch };
    onChange(copy);
  };
  const del = (i: number) => onChange(entries.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <button
        onClick={add}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs hover:bg-gray-50"
      >
        <Plus size={12} /> Add project
      </button>
      {entries.map((e, i) => (
        <div key={i} className="border rounded-xl p-3 space-y-2">
          <input
            className="border rounded-lg p-2 text-sm"
            value={e.name}
            placeholder="Project name"
            onChange={(ev) => upd(i, { name: ev.target.value })}
          />
          <textarea
            className="border rounded-lg p-2 text-sm h-24"
            value={e.desc}
            placeholder="Short description"
            onChange={(ev) => upd(i, { desc: ev.target.value })}
          />
          <TagsEditor
            value={e.tech}
            onChange={(tech) => upd(i, { tech })}
            placeholder="Add tech and press Enter"
          />
          <button
            onClick={() => del(i)}
            className="text-xs text-rose-600 hover:underline"
          >
            Remove project
          </button>
        </div>
      ))}
    </div>
  );
}

function EducationEditor({
  entries,
  onChange,
}: {
  entries: { school: string; credential: string; dates?: string }[];
  onChange: (x: { school: string; credential: string; dates?: string }[]) => void;
}) {
  const add = () => onChange([...entries, { school: "", credential: "" }]);
  const upd = (i: number, patch: Partial<(typeof entries)[number]>) => {
    const copy = entries.slice();
    copy[i] = { ...copy[i], ...patch };
    onChange(copy);
  };
  const del = (i: number) => onChange(entries.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <button
        onClick={add}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs hover:bg-gray-50"
      >
        <Plus size={12} /> Add school
      </button>
      {entries.map((e, i) => (
        <div key={i} className="border rounded-xl p-3 space-y-2">
          <input
            className="border rounded-lg p-2 text-sm"
            value={e.school}
            placeholder="School"
            onChange={(ev) => upd(i, { school: ev.target.value })}
          />
          <input
            className="border rounded-lg p-2 text-sm"
            value={e.credential}
            placeholder="Credential"
            onChange={(ev) => upd(i, { credential: ev.target.value })}
          />
          <input
            className="border rounded-lg p-2 text-sm"
            value={e.dates ?? ""}
            placeholder="Dates"
            onChange={(ev) => upd(i, { dates: ev.target.value })}
          />
          <button
            onClick={() => del(i)}
            className="text-xs text-rose-600 hover:underline"
          >
            Remove entry
          </button>
        </div>
      ))}
    </div>
  );
}

function BulletsEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (x: string[]) => void;
}) {
  const [text, setText] = useState(value.join("\n"));
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600">Bullets (one per line)</label>
      <textarea
        className="w-full border rounded-lg p-2 text-sm h-28"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() =>
          onChange(text.split("\n").map((s) => s.trim()).filter(Boolean))
        }
        placeholder="- Achieved X..."
      />
    </div>
  );
}

function TagsEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (x: string[]) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const add = () => {
    const t = text.trim();
    if (!t) return;
    onChange([...value, t]);
    setText("");
  };
  const del = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600">Tech</label>
      <div className="flex gap-2">
        <input
          className="border rounded-lg p-2 text-sm flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <button
          onClick={add}
          className="px-2 py-1 rounded-lg border text-xs hover:bg-gray-50"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs"
          >
            {t}
            <button
              onClick={() => del(i)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
