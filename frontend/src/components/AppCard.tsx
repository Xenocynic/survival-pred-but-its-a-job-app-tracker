import type { Application } from '../types';
import { ChevronRight } from 'lucide-react';


export function AppCard({ app, onOpen }: { app: Application; onOpen: (id: string) => void }) {
return (
<div
draggable
onDragStart={(e) => e.dataTransfer.setData('text/app-id', app.id)}
className="group rounded-2xl border shadow-sm p-4 bg-white hover:shadow-md cursor-grab active:cursor-grabbing transition"
>
<div className="flex items-center gap-3">
<div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-semibold">
{app.company.slice(0, 2).toUpperCase()}
</div>
<div className="min-w-0">
<div className="font-semibold truncate">{app.role}</div>
<div className="text-sm text-gray-500 truncate">{app.company}</div>
</div>
<button onClick={() => onOpen(app.id)} className="ml-auto inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
Open <ChevronRight size={16} />
</button>
</div>
<div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
<span>Created {new Date(app.createdAt).toLocaleDateString()}</span>
</div>
</div>
);
}