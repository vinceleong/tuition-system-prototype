import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
import { StatCard } from '../../components/shared/shared';
import { Calendar, CheckCircle, XCircle, Eye } from 'lucide-react';
import { getUserById } from '../../data/users';
import { formatDate } from '../../lib/utils';

export function AdminSessions() {
  const { sessions } = useApp();
  const [activeTab, setActiveTab] = useState('upcoming');

  const today = new Date().toISOString().split('T')[0];
  const live = sessions.filter(s => s.date === today && s.status === 'upcoming');
  const upcoming = sessions.filter(s => s.status === 'upcoming');
  const completed = sessions.filter(s => s.status === 'completed');
  const cancelled = sessions.filter(s => s.status === 'cancelled');

  const displayed = activeTab === 'live' ? live : activeTab === 'upcoming' ? upcoming : activeTab === 'completed' ? completed : cancelled;

  const completionRate = sessions.length > 0 ? Math.round((completed.length / (completed.length + cancelled.length)) * 100) : 0;
  const cancellationRate = sessions.filter(s => s.status === 'cancelled' && s.date === today).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Session Monitoring</h1>
        <p className="text-gray-500 mt-1">Platform-wide session overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard label="Sessions Today" value={sessions.filter(s => s.date === today).length} icon={<Calendar size={20} />} />
        <StatCard label="Completion Rate" value={`${completionRate}%`} icon={<CheckCircle size={20} />} />
        <StatCard label="Cancellations Today" value={cancellationRate} icon={<XCircle size={20} />} />
        <StatCard label="Total Sessions" value={sessions.length} />
      </div>

      <Tabs
        tabs={[
          { id: 'live', label: 'Live Now', count: live.length },
          { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
          { id: 'completed', label: 'Completed', count: completed.length },
          { id: 'cancelled', label: 'Cancelled', count: cancelled.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Tutor</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Student</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Subject</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Time</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(s => {
                const tutor = getUserById(s.tutorId);
                const student = getUserById(s.studentId);
                return (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={tutor?.name || 'T'} size="sm" />
                        <span className="text-sm text-gray-900">{tutor?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{student?.name}</td>
                    <td className="px-4 py-3"><Badge variant="info">{s.subjectId}</Badge></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(s.date)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{s.startTime} - {s.endTime}</td>
                    <td className="px-4 py-3">
                      <Badge variant={s.status === 'completed' ? 'success' : s.status === 'upcoming' ? 'info' : s.status === 'cancelled' ? 'danger' : 'warning'}>
                        {s.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {s.status === 'live' && (
                        <button className="text-primary-600 hover:text-primary-700 text-sm">
                          <Eye size={14} className="inline mr-1" /> Monitor
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
