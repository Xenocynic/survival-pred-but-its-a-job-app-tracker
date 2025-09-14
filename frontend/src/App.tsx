import { Outlet } from 'react-router-dom';
import { TopNav } from './components/TopNav';


export default function AppLayout() {
return (
<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
<TopNav />
<Outlet />
</div>
);
}