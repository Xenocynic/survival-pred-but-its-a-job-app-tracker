import { useState } from "react";
import { Trash2 } from "lucide-react";

export function Trash({
  onDropApp,
  label = "Drop here to DELETE",
  confirm = true,
}: {
  onDropApp: (appId: string) => void;
  label?: string;
  confirm?: boolean;
}) {
  const [over, setOver] = useState(false);

  return (
    <div
      className="fixed inset-x-0 bottom-6 z-50 flex justify-center pointer-events-none"
      aria-label="Delete dropzone"
    >
      <div
        role="button"
        title="Drag an application here to delete it"
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          const id = e.dataTransfer.getData("text/app-id");
          if (!id) return;
          if (!confirm || window.confirm("Delete this application? This cannot be undone.")) {
            onDropApp(id);
          }
          setOver(false);
        }}
        className={[
          "pointer-events-auto select-none",
          "relative rounded-3xl shadow-xl",
          "bg-white/70 backdrop-blur-sm border border-black/10",
          "px-6 py-4",
          "transition-all duration-150 ease-out",
          over ? "ring-4 ring-rose-400/80 scale-105" : "ring-2 ring-black/10",
        ].join(" ")}
      >
        {/* “Actual” trash can icon */}
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12">
            {/* can body */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-9 w-10 rounded-b-md bg-gray-800" />
            {/* can lid */}
            <div
              className={[
                "absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-12 rounded-sm bg-gray-900 origin-right",
                over ? "rotate-[-18deg] translate-y-[-2px]" : "",
                "transition-transform duration-150",
              ].join(" ")}
            />
            {/* front glyph to sell the idea */}
            <div className="absolute inset-0 grid place-items-center">
            </div>
          </div>

          <div className="min-w-[12rem]">
            <div className="font-semibold">Trash</div>
            <div className="text-sm text-gray-600">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
