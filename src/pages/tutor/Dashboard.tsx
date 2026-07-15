import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { StatCard, StarRating } from '../../components/shared/shared';
import { Calendar, Clock, Users, TrendingUp, Video, ArrowRight } from 'lucide-react';
import { getUserById } from '../../data/users';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Link } from 'react-router-dom';
import type { Session } from '../../data';

function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
}

export function TutorDashboard() {
  const { currentUser, sessions, reviews } = useApp();
  const mySessions = sessions.filter(s => s.tutorId === currentUser.id);
  const upcoming = mySessions.filter(s => s.status === 'upcoming');
  const completed = mySessions.filter(s => s.status === 'completed');
  const todaySessions = upcoming.filter(s => isToday(s.date));
  const uniqueStudents = [...new Set(mySessions.map(s => s.studentId))];
  const thisMonth = new Date().getMonth();
  const earningsThisMonth = completed
    .filter(s => new Date(s.date + 'T00:00:00').getMonth() === thisMonth)
    .reduce((sum, s) => {
      const tutor = getUserById(s.tutorId);
      return sum + (tutor?.hourlyRate || 0);
    }, 0);
  const myReviews = reviews.filter(r => r.tutorId === currentUser.id);
  const avgRating = myReviews.length ? myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser.name}</h1>
        <p className="text-gray-500 mt-1">Here's your teaching overview for today</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Upcoming Sessions" value={upcoming.length} icon={<Calendar size={20} />} />
        <StatCard label="Total Students" value={uniqueStudents.length} icon={<Users size={20} />} />
        <StatCard label="Earnings This Month" value={formatCurrency(earningsThisMonth)} icon={<TrendingUp size={20} />} trend="up" />
        <StatCard label="Rating" value={avgRating.toFixed(1)} icon={<StarRating rating={avgRating} size="sm" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
            </CardHeader>
            <CardContent>
              {todaySessions.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">No sessions scheduled for today</p>
              ) : (
                <div className="space-y-3">
                  {todaySessions.map(s => {
                    const student = getUserById(s.studentId);
                    return (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{student?.name}</p>
                          <p className="text-sm text-gray-500">{s.topic} · {s.startTime} - {s.endTime}</p>
                        </div>
                        <Link to={`/tutor/sessions/${s.id}/live`}>
                          <Badge variant="info">Join</Badge>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Upcoming This Week</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcoming.slice(0, 5).map(s => {
                  const student = getUserById(s.studentId);
                  return (
                    <div key={s.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                      <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{student?.name} — {s.topic}</p>
                        <p className="text-xs text-gray-500">{formatDate(s.date)} · {s.startTime} - {s.endTime}</p>
                      </div>
                      <Badge variant="info">{s.subjectId}</Badge>
                    </div>
                  );
                })}
                {upcoming.length === 0 && <p className="text-sm text-gray-500 py-4 text-center">No upcoming sessions</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Recent Reviews</h3>
          </CardHeader>
          <CardContent>
            {myReviews.slice(0, 3).map(r => {
              const student = getUserById(r.studentId);
              return (
                <div key={r.id} className="py-3 border-b border-gray-50 last:border-0">
                  <StarRating rating={r.rating} size="sm" />
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">{r.text}</p>
                  <p className="text-xs text-gray-400 mt-1">— {student?.name}</p>
                </div>
              );
            })}
            {myReviews.length === 0 && <p className="text-sm text-gray-500 py-4 text-center">No reviews yet</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
