import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Tabs } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { StatCard } from '../../components/shared/shared';
import { Search, Users, UserPlus } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import type { Role, User } from '../../data';

export function AdminUsers() {
  const { users } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filtered = users
    .filter(u => activeTab === 'all' || u.role === activeTab)
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const thisMonth = new Date().getMonth();
  const activeThisMonth = users.filter(u => new Date(u.joinedAt + 'T00:00:00').getMonth() === thisMonth).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">{users.length} total users</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Users" value={users.length} icon={<Users size={20} />} />
        <StatCard label="Active This Month" value={activeThisMonth} icon={<UserPlus size={20} />} trend="up" />
      </div>

      <Tabs
        tabs={[
          { id: 'all', label: 'All', count: users.length },
          { id: 'student', label: 'Students', count: users.filter(u => u.role === 'student').length },
          { id: 'parent', label: 'Parents', count: users.filter(u => u.role === 'parent').length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Role</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Joined</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={u.name} size="sm" />
                      <span className="text-sm font-medium text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                  <td className="px-4 py-3"><Badge variant={u.role === 'admin' ? 'danger' : u.role === 'tutor' ? 'info' : 'default'}>{u.role}</Badge></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(u.joinedAt)}</td>
                  <td className="px-4 py-3"><Badge variant="success">Active</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedUser(u)}>View</Button>
                      <Button variant="ghost" size="sm" className="text-red-600">Suspend</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Details">
        {selectedUser && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar name={selectedUser.name} size="lg" />
              <div>
                <p className="font-semibold text-gray-900">{selectedUser.name}</p>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-500">Role:</span> <Badge>{selectedUser.role}</Badge></div>
              <div><span className="text-gray-500">Joined:</span> {formatDate(selectedUser.joinedAt)}</div>
              <div><span className="text-gray-500">Status:</span> <Badge variant="success">Active</Badge></div>
              {selectedUser.grade && <div><span className="text-gray-500">Grade:</span> {selectedUser.grade}</div>}
            </div>
            {selectedUser.bio && <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedUser.bio}</p>}
          </div>
        )}
      </Dialog>
    </div>
  );
}
