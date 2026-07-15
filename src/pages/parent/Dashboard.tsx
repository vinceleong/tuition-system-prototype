import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { StatCard, StarRating } from '../../components/shared/shared';
import { ProgressBar } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
import { Calendar, CreditCard } from 'lucide-react';
import { getUserById } from '../../data/users';
import { formatCurrency, formatDate } from '../../lib/utils';
import { subjects } from '../../data/subjects';

export function ParentDashboard() {
  const { currentUser, students, sessions, payments, assignments } = useApp();

  const totalSpending = payments
    .filter(p => p.type === 'session_payment' && p.status === 'completed' && students.some(s => s.id === p.userId))
    .reduce((s, p) => s + p.amount, 0);

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming' && students.some(st => st.id === s.studentId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser.name}</h1>
        <p className="text-gray-500 mt-1">Track your children's learning progress</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard label="Total Spending" value={formatCurrency(totalSpending)} icon={<CreditCard size={20} />} />
        <StatCard label="Upcoming Sessions" value={upcomingSessions.length} icon={<Calendar size={20} />} />
      </div>

      {students.map(student => {
        const studentSessions = sessions.filter(s => s.studentId === student.id);
        const completed = studentSessions.filter(s => s.status === 'completed');
        const studentAssignments = assignments.filter(a => a.studentId === student.id);
        const graded = studentAssignments.filter(a => a.status === 'graded');
        const avgGrade = graded.length > 0 ? (graded.filter(a => a.grade && !['F', 'D'].includes(a.grade[0])).length / graded.length * 100) : 0;
        const pendingAssignments = studentAssignments.filter(a => a.status === 'pending');

        return (
          <Card key={student.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={student.name} size="md" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.grade}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{completed.length}</p>
                  <p className="text-xs text-gray-500">Sessions</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{pendingAssignments.length}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{Math.round(avgGrade)}%</p>
                  <p className="text-xs text-gray-500">Good Grades</p>
                </div>
              </div>
              <ProgressBar value={avgGrade} />
            </CardContent>
          </Card>
        );
      })}

      <Card>
        <CardHeader><h3 className="font-semibold text-gray-900">Upcoming Sessions</h3></CardHeader>
        <CardContent>
          {upcomingSessions.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No upcoming sessions</p>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map(s => {
                const child = getUserById(s.studentId);
                const tutor = getUserById(s.tutorId);
                return (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar name={child?.name || 'S'} size="sm" />
                      <div>
                        <p className="font-medium text-sm text-gray-900">{child?.name} with {tutor?.name}</p>
                        <p className="text-xs text-gray-500">{s.topic} · {subjects.find(sub => sub.id === s.subjectId)?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatDate(s.date)}</p>
                      <p className="text-xs text-gray-500">{s.startTime} - {s.endTime}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
