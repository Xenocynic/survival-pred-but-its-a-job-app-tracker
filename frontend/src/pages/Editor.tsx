import { useParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { api } from '../api/mock';


export default function EditorPage() {
const { appId } = useParams();
const { apps, resumes, refresh } = useAppStore();


const app = apps.find(a=>a.id===appId);
const resume = app ? resumes.find(r=>r.id===app.resumeId) : resumes.find(r=>r.id==='r_master');


function cloneForApp() {
if (!app || !resume) return;
const clone = api.cloneResume(resume.id, `${app.company} - ${app.role}`);
if (!clone) return;
api.attachResume(app.id, clone.id);
refresh();
}


return (
<main className="mx-auto max-w-5xl px-4 py-6">
<h1 className="text-2xl font-semibold mb-4">Resume Editor {app ? <span className="text-gray-500 text-base">(for {app.company})</span> : '(Master)'}</h1>
{!resume ? (
<div>Loading…</div>
) : (
<div className="grid md:grid-cols-3 gap-4">
<aside className="md:col-span-1 space-y-2">
<div className="rounded-2xl border p-3 bg-white">
<div className="text-sm text-gray-500">Attached Resume</div>
<div className="font-medium">{resume.name}</div>
{app && <button onClick={cloneForApp} className="mt-2 text-sm px-3 py-2 rounded-xl bg-blue-600 text-white">Clone From Master</button>}
</div>
</aside>
<section className="md:col-span-2">
<div className="rounded-2xl border p-4 bg-white min-h-[300px]">
<div className="text-sm text-gray-500 mb-2">Preview (editable form can go here)</div>
<pre className="text-xs whitespace-pre-wrap">{JSON.stringify(resume.blocks, null, 2)}</pre>
<p className="text-sm text-gray-500 mt-3">Replace with forms to edit blocks (Summary, Experience, Projects, etc.).</p>
</div>
</section>
</div>
)}
</main>
);
}