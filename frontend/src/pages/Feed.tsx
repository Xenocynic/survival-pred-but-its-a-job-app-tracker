import { useAppStore } from '../store/useAppStore';


export default function FeedPage() {
const { events } = useAppStore();
return (
<main className="mx-auto max-w-3xl px-4 py-6">
<h1 className="text-2xl font-semibold mb-4">Feed</h1>
<div className="space-y-3">
{events.length === 0 && <div className="text-sm text-gray-600">No events yet.</div>}
{events.map(ev => (
<div key={ev.id} className="rounded-2xl border p-4 bg-white">
<div className="text-sm text-gray-500">{new Date(ev.at).toLocaleString()}</div>
<div className="font-medium capitalize">{ev.kind.replace('_',' ')}</div>
<div className="text-sm">{ev.snippet}</div>
</div>
))}
</div>
</main>
);
}