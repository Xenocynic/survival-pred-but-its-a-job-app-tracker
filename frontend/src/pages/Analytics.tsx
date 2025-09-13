import { useAppStore } from '../store/useAppStore';


export default function AnalyticsPage() {
const { apps } = useAppStore();
const counts = {
total: apps.length,
applied: apps.filter(a=>a.stage==='applied').length,
interview: apps.filter(a=>a.stage==='interview').length,
offer: apps.filter(a=>a.stage==='offer').length,
rejected: apps.filter(a=>a.stage==='rejected').length,
};
return (
<main className="mx-auto max-w-7xl px-4 py-6 space-y-4">
<h1 className="text-2xl font-semibold">Analytics</h1>
<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
{Object.entries(counts).map(([k,v]) => (
<div key={k} className="rounded-2xl border p-4 bg-white"><div className="text-sm text-gray-500">{k}</div><div className="text-2xl font-semibold">{v}</div></div>
))}
</div>
<p className="text-sm text-gray-600">Hook up charts later with Recharts.</p>
</main>
);
}