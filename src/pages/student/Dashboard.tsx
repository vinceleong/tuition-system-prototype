import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getUserById } from '../../data/users';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { StatCard, EmptyState } from '../../components/shared/shared';
import {
  Calendar, Clock, CreditCard, TrendingUp, Video, BookOpen,
  ArrowRight,
} from 'lucide-react';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { currentUser, getSessions, getAssignments, getWalletBalance } = useApp();

  const sessions = getSessions();
  const assignments = getAssignments();

  const upcomingSessions = sessions
    .filter((s) => s.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const completedSessions = sessions.filter((s) => s.status === 'completed');

  const walletBalance = getWalletBalance();

  const gradedAssignments = assignments.filter((a) => a.status === 'graded');
  const gradeMap: Record<string, number> = { 'A+': 4.3, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0 };
  const avgGrade = gradedAssignments.length > 0
    ? (gradedAssignments.reduce((sum, a) => sum + (gradeMap[a.grade || 'F'] || 0), 0) / gradedAssignments.length).toFixed(1)
    : 'N/A';

  const recentAssignments = assignments
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
        <p className="text-gray-500 mt-1">Here&apos;s your learning overview for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Upcoming Sessions"
          value={upcomingSessions.length}
          icon={<Calendar size={20} />}
          subtext="Next session in your schedule"
        />
        <StatCard
          label="Completed Sessions"
          value={completedSessions.length}
          icon={<Clock size={20} />}
          subtext="Total sessions completed"
        />
        <StatCard
          label="Wallet Balance"
          value={formatCurrency(walletBalance)}
          icon={<CreditCard size={20} />}
          subtext={walletBalance > 0 ? 'Available to book sessions' : 'Top up to book sessions'}
        />
        <StatCard
          label="Average Grade"
          value={avgGrade === 'N/A' ? 'N/A' : avgGrade}
          icon={<TrendingUp size={20} />}
          subtext={gradedAssignments.length > 0 ? `Across ${gradedAssignments.length} assignments` : 'No grades yet'}
        />
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary-600" />
              <h2 className="font-semibold text-gray-900">Upcoming Sessions</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/student/sessions')}>
              View All <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length === 0 ? (
            <EmptyState
              icon="📅"
              title="No upcoming sessions"
              description="Book a session with a tutor to get started."
              action={
                <Button onClick={() => navigate('/student/find-tutors')}>
                  Find Tutors
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingSessions.slice(0, 3).map((session) => {
                const tutor = getUserById(session.tutorId);
                return (
                  <div
                    key={session.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-700">
                          {tutor?.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{tutor?.name}</p>
                        <p className="text-xs text-gray-500">{session.subjectId} · {session.topic}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(session.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {session.startTime} - {session.endTime}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/student/sessions/${session.id}/live`)}
                    >
                      <Video size={14} className="mr-1" />
                      Join
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Assignments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-primary-600" />
              <h2 className="font-semibold text-gray-900">Recent Assignments</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/student/assignments')}>
              View All <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentAssignments.length === 0 ? (
            <EmptyState
              icon="📝"
              title="No assignments"
              description="Your tutors will assign work here after sessions."
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {recentAssignments.map((assignment) => {
                const statusVariant =
                  assignment.status === 'graded' ? 'success' :
                  assignment.status === 'submitted' ? 'warning' :
                  'default';
                return (
                  <div key={assignment.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{assignment.title}</p>
                      <p className="text-xs text-gray-500">{assignment.subjectId} · Due {formatDate(assignment.dueDate)}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Badge variant={statusVariant}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </Badge>
                      {assignment.grade && (
                        <span className="text-sm font-semibold text-gray-900">{assignment.grade}</span>
                      )}
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
