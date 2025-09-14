import { Bell, ClipboardList, BarChart2, Newspaper, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import type { ReactNode } from "react";


// add notification number here based on what is scraped from the backend
export function TopNav({ notifications = 3 }: { notifications?: number }) {
  const link = (to: string, label: string, icon: ReactNode) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2 
         ${isActive ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'}`
      }
    >
      {icon} {label}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-40 text-white">
      <div className="relative animated-gradient pulse-overlay">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <div className="font-marker text-xl tracking-wide drop-shadow-[0_1px_0_rgba(0,0,0,0.3)]">
            so you applied for a job. damn
          </div>

          <nav className="ml-6 hidden md:flex items-center gap-1">
            {link('/board', 'Board', <ClipboardList size={16} />)}
            {link('/analytics', 'Analytics', <BarChart2 size={16} />)}
            {link('/feed', 'Feed', <Newspaper size={16} />)}
            {link('/editor', 'Editor', <FileText size={16} />)}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative p-2 rounded-xl hover:bg-white/10" aria-label="Notifications">
              <Bell size={18} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] px-1 rounded-full bg-rose-500 text-white text-[10px] grid place-items-center">
                  {notifications}
                </span>
              )}
            </button>
            <button className="px-3 py-2 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-white/90">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}



