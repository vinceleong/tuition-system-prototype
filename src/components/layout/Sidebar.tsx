import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard, Search, Calendar, BookOpen, CreditCard,
  MessageSquare, TrendingUp, Star, Users, DollarSign,
  ClipboardList, Settings, User, GraduationCap, Bell,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const studentNav: NavItem[] = [
  { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/student/find-tutors', label: 'Find Tutors', icon: <Search size={20} /> },
  { to: '/student/sessions', label: 'My Sessions', icon: <Calendar size={20} />, badge: 3 },
  { to: '/student/assignments', label: 'Assignments', icon: <ClipboardList size={20} />, badge: 2 },
  { to: '/student/payments', label: 'Payments', icon: <CreditCard size={20} /> },
  { to: '/student/messages', label: 'Messages', icon: <MessageSquare size={20} />, badge: 2 },
  { to: '/student/progress', label: 'Progress', icon: <TrendingUp size={20} /> },
  { to: '/student/reviews', label: 'Reviews', icon: <Star size={20} /> },
];

const tutorNav: NavItem[] = [
  { to: '/tutor/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/tutor/schedule', label: 'Schedule', icon: <Calendar size={20} />, badge: 3 },
  { to: '/tutor/students', label: 'Students', icon: <Users size={20} /> },
  { to: '/tutor/assignments', label: 'Assignments', icon: <ClipboardList size={20} />, badge: 2 },
  { to: '/tutor/earnings', label: 'Earnings', icon: <DollarSign size={20} /> },
  { to: '/tutor/messages', label: 'Messages', icon: <MessageSquare size={20} />, badge: 1 },
  { to: '/tutor/profile', label: 'Profile', icon: <User size={20} /> },
];

const parentNav: NavItem[] = [
  { to: '/parent/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/parent/children', label: 'My Children', icon: <Users size={20} /> },
  { to: '/parent/progress', label: 'Progress', icon: <TrendingUp size={20} /> },
];

const adminNav: NavItem[] = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/admin/users', label: 'Users', icon: <Users size={20} /> },
  { to: '/admin/tutors', label: 'Tutors', icon: <GraduationCap size={20} /> },
  { to: '/admin/sessions', label: 'Sessions', icon: <Calendar size={20} /> },
  { to: '/admin/payments', label: 'Payments', icon: <DollarSign size={20} /> },
  { to: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
];

const navMap: Record<string, NavItem[]> = {
  student: studentNav,
  tutor: tutorNav,
  parent: parentNav,
  admin: adminNav,
};

export function Sidebar() {
  const { currentRole } = useApp();
  const location = useLocation();
  const navItems = navMap[currentRole] || [];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col flex-shrink-0 sticky top-0">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900">TuitionHub</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive || (item.to !== `/${currentRole}/dashboard` && location.pathname.startsWith(item.to))
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <Bell size={18} className="text-gray-400" />
          <span className="text-sm text-gray-500">3 notifications</span>
        </div>
      </div>
    </aside>
  );
}
