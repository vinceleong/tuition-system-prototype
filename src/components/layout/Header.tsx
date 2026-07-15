import { useApp } from '../../context/AppContext';
import { Avatar } from '../ui/avatar';
import { Bell, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  const { currentUser, currentRole } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-gray-500">
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-sm font-medium text-gray-900 capitalize">{currentRole} Portal</h2>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative text-gray-500 hover:text-gray-700"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
          </button>
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              <div className="p-3 border-b border-gray-100 font-medium text-sm">Notifications</div>
              <div className="max-h-64 overflow-y-auto">
                {[
                  { text: 'Session with Dr. Sarah Chen tomorrow at 2 PM', time: '1h ago' },
                  { text: 'Assignment "Quadratic Equations" due in 2 days', time: '3h ago' },
                  { text: 'New message from Alex Thompson', time: '5h ago' },
                ].map((n, i) => (
                  <div key={i} className="px-3 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                    <p className="text-sm text-gray-700">{n.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Link to={`/${currentRole}/profile`} className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1">
          <Avatar name={currentUser?.name || 'User'} size="sm" />
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">{currentUser?.name}</span>
        </Link>
      </div>
    </header>
  );
}
