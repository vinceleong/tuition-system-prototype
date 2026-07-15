import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { StatCard, BarChart } from '../../components/shared/shared';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Users, GraduationCap, Calendar, DollarSign, UserPlus, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { getUserById } from '../../data/users';
import { subjects } from '../../data/subjects';

export function AdminDashboard() {
  const { users, tutors, sessions, payments } = useApp();
  const allUsers = users;
  const allTutors = tutors;
  const activeSessions = sessions.filter(s => s.status === 'upcoming' || s.status === 'live');
  const thisMonth = new Date().getMonth();
  const revenueThisMonth = payments
    .filter(p => p.type === 'session_payment' && p.status === 'completed' && new Date(p.date + 'T00:00:00').getMonth() === thisMonth)
    .reduce((s, p) => s + p.amount, 0);
  const newSignups = allUsers.filter(u => new Date(u.joinedAt + 'T00:00:00').getMonth() === thisMonth).length;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revByMonth = months.map((label, i) => ({
    label,
    value: payments
      .filter(p => p.type === 'session_payment' && p.status === 'completed' && new Date(p.date + 'T00:00:00').getMonth() === i)
      .reduce((s, p) => s + p.amount, 0),
    color: 'bg-primary-400'
  }));

  const sessionsBySubject = subjects.map(s => ({
    label: s.name,
    value: sessions.filter(ss => ss.subjectId === s.id).length,
    color: 'bg-indigo-400'
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Users" value={allUsers.length} icon={<Users size={20} />} />
        <StatCard label="Tutors" value={allTutors.length} icon={<GraduationCap size={20} />} />
        <StatCard label="Active Sessions" value={activeSessions.length} icon={<Calendar size={20} />} />
        <StatCard label="Revenue (MTD)" value={formatCurrency(revenueThisMonth)} icon={<DollarSign size={20} />} />
        <StatCard label="New Signups" value={newSignups} icon={<UserPlus size={20} />} />
        <StatCard label="Pending Approvals" value={3} icon={<Clock size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><h3 className="font-semibold text-gray-900">Revenue by Month</h3></CardHeader>
          <CardContent><BarChart data={revByMonth} /></CardContent>
        </Card>
        <Card>
          <CardHeader><h3 className="font-semibold text-gray-900">Sessions by Subject</h3></CardHeader>
          <CardContent><BarChart data={sessionsBySubject} /></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {payments.slice(0, 6).map(p => {
                const user = getUserById(p.userId);
                return (
                  <div key={p.id} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-gray-900">{p.description}</p>
                      <p className="text-xs text-gray-500">{user?.name} · {formatDate(p.date)}</p>
                    </div>
                    <span className="font-medium text-gray-900">{formatCurrency(p.amount)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h3 className="font-semibold text-gray-900">Quick Actions</h3></CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start"><GraduationCap size={16} className="mr-2" /> Approve Tutors</Button>
            <Button variant="outline" className="w-full justify-start"><DollarSign size={16} className="mr-2" /> View Financial Reports</Button>
            <Button variant="outline" className="w-full justify-start"><Calendar size={16} className="mr-2" /> Monitor Live Sessions</Button>
            <Button variant="outline" className="w-full justify-start"><Users size={16} className="mr-2" /> Manage Users</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
