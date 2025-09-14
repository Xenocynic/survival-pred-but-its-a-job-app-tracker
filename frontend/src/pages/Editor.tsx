import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Resume } from "../types";
import { useAppStore } from "../store/useAppStore";
import { ResumeEditor } from "../components/ResumeEditor";

export default function EditorPage() {
  const { appId } = useParams();
  const { apps, getApp, getResumeById, getMasterResume, saveResume, cloneAndAttachToApp } = useAppStore();

  // Determine which resume we are editing
  const initial: Resume = useMemo(() => {
    if (appId) {
      const app = getApp(appId);
      if (app) {
        const r = getResumeById(app.resumeId);
        if (r) return r;
      }
    }
    return getMasterResume();
  }, [appId, apps]); // apps in deps: if attachment changes, refetch

  const [draft, setDraft] = useState<Resume>(initial);

  useEffect(() => { setDraft(initial); }, [initial.id]);

  const isMaster = !appId || draft.id === "r_master";

  function doSave() {
    saveResume(draft);
    // no redirect; show a quick toast? (left minimal for hackathon)
    alert("Saved!");
  }

  function doSaveAsNewAttach() {
    if (!appId) return;
    const renamed: Resume = { ...draft, id: draft.id, name: `${draft.name} (custom)` };
    // clone from current draft's id to preserve lineage
    const clone = cloneAndAttachToApp(appId, draft.id, renamed.name);
    if (clone) {
      // copy blocks into the newly cloned resume and save it
      const updated = { ...clone, blocks: draft.blocks };
      saveResume(updated);
      alert("Saved as new and attached to this application.");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Resume Editor</h1>
          <p className="text-sm text-gray-600">
            {isMaster ? "Editing Master Resume" : `Editing resume for application ${appId}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={doSave}
            className="px-3 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
          >
            Save
          </button>
          {appId && (
            <button
              onClick={doSaveAsNewAttach}
              className="relative inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white text-sm font-medium animated-gradient hover:opacity-90"
              title="Create a new copy of this resume and attach it only to this application"
            >
              Save as new & attach
            </button>
          )}
        </div>
      </div>

      <ResumeEditor resume={draft} onChange={setDraft} />
    </main>
  );
}
