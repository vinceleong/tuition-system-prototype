import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getUserById } from '../../data/users';
import { formatDate } from '../../lib/utils';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Avatar } from '../../components/ui/avatar';
import { Tabs } from '../../components/ui/tabs';
import { EmptyState } from '../../components/shared/shared';
import {
  Calendar, Clock, Video, Star, MessageSquare,
} from 'lucide-react';

export function StudentSessions() {
  const navigate = useNavigate();
  const { getSessions } = useApp();
  const [activeTab, setActiveTab] = useState('today');

  const sessions = getSessions();

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions
    .filter((s) => s.status === 'upcoming' && s.date === todayStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const upcomingSessions = sessions
    .filter((s) => s.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const completedSessions = sessions
    .filter((s) => s.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const cancelledSessions = sessions
    .filter((s) => s.status === 'cancelled')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const tabs = [
    { id: 'today', label: "Today", count: todaySessions.length },
    { id: 'upcoming', label: 'Upcoming', count: upcomingSessions.length },
    { id: 'completed', label: 'Completed', count: completedSessions.length },
    { id: 'cancelled', label: 'Cancelled', count: cancelledSessions.length },
  ];

  const activeSessions = activeTab === 'today' ? todaySessions :
    activeTab === 'upcoming' ? upcomingSessions :
    activeTab === 'completed' ? completedSessions : cancelledSessions;

  const isWithin15Min = (session: { date: string; startTime: string }) => {
    const sessionStart = new Date(`${session.date}T${session.startTime}`);
    const now = new Date();
    const diffMs = sessionStart.getTime() - now.getTime();
    return diffMs >= -15 * 60 * 1000 && diffMs <= 60 * 60 * 1000;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Sessions</h1>
        <p className="text-gray-500 mt-1">Manage your tutoring sessions.</p>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </CardHeader>
        <CardContent>
          {activeSessions.length === 0 ? (
            <EmptyState
              icon="📅"
              title={`No ${activeTab} sessions`}
              description={
                activeTab === 'upcoming'
                  ? 'Book a session with a tutor to get started.'
                  : `You have no ${activeTab} sessions yet.`
              }
              action={
                activeTab === 'upcoming' ? (
                  <Button onClick={() => navigate('/student/find-tutors')}>Find Tutors</Button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-3 mt-4">
              {activeSessions.map((session) => {
                const tutor = getUserById(session.tutorId);
                const statusVariant =
                  session.status === 'upcoming' ? 'info' :
                  session.status === 'completed' ? 'success' :
                  'danger';
                return (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={tutor?.name || 'Tutor'} size="md" />
                      <div>
                        <p className="font-medium text-gray-900">{tutor?.name}</p>
                        <p className="text-sm text-gray-500">
                          {session.subjectId} · {session.topic}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(session.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {session.startTime} - {session.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-shrink-0">
                      <Badge variant={statusVariant}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </Badge>
                      {session.status === 'upcoming' && isWithin15Min(session) && (
                        <Button
                          size="sm"
                          onClick={() => navigate(`/student/sessions/${session.id}/live`)}
                        >
                          <Video size={14} className="mr-1" />
                          Join
                        </Button>
                      )}
                      {session.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          {session.notes && (
                            <div className="text-xs text-gray-500 max-w-[200px] truncate hidden md:block">
                              <MessageSquare size={12} className="inline mr-1" />
                              {session.notes}
                            </div>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/student/tutors/${session.tutorId}`)}
                          >
                            <Star size={14} className="mr-1" />
                            Leave Review
                          </Button>
                        </div>
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
