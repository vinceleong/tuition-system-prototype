import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Avatar } from '../../components/ui/avatar';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUserById } from '../../data/users';
import { formatDate } from '../../lib/utils';
import { useState } from 'react';
import type { Session } from '../../data';

export function TutorSchedule() {
  const { sessions, currentUser } = useApp();
  const mySessions = sessions.filter(s => s.tutorId === currentUser.id);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showAvailability, setShowAvailability] = useState(false);

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  function getSessionsForDay(date: string) {
    return mySessions.filter(s => s.date === date);
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-500 mt-1">Manage your availability and view sessions</p>
        </div>
        <Button onClick={() => setShowAvailability(true)}>Set Availability</Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((date, i) => {
          const daySessions = getSessionsForDay(date);
          const d = new Date(date + 'T00:00:00');
          const isToday = date === today.toISOString().split('T')[0];
          return (
            <div key={date} className={`rounded-xl border p-3 min-h-[140px] ${isToday ? 'border-primary-300 bg-primary-50' : 'border-gray-200'}`}>
              <div className="text-xs font-medium text-gray-500 mb-1">{dayNames[i]}</div>
              <div className={`text-lg font-bold mb-2 ${isToday ? 'text-primary-700' : 'text-gray-900'}`}>{d.getDate()}</div>
              <div className="space-y-1">
                {daySessions.slice(0, 3).map(s => {
                  const student = getUserById(s.studentId);
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSession(s)}
                      className="w-full text-left text-[10px] leading-tight p-1 rounded bg-primary-100 text-primary-800 hover:bg-primary-200 truncate"
                    >
                      {s.startTime} {student?.name.split(' ')[0]}
                    </button>
                  );
                })}
                {daySessions.length > 3 && (
                  <p className="text-[10px] text-gray-500">+{daySessions.length - 3} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader><h3 className="font-semibold text-gray-900">All Sessions</h3></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mySessions.map(s => {
              const student = getUserById(s.studentId);
              return (
                <div key={s.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => setSelectedSession(s)}>
                  <div className="flex items-center gap-3">
                    <Avatar name={student?.name || 'S'} size="sm" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{student?.name}</p>
                      <p className="text-xs text-gray-500">{s.topic}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-700">{formatDate(s.date)}</p>
                    <p className="text-xs text-gray-500">{s.startTime} - {s.endTime}</p>
                  </div>
                  <Badge variant={s.status === 'upcoming' ? 'info' : s.status === 'completed' ? 'success' : s.status === 'cancelled' ? 'danger' : 'warning'}>
                    {s.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedSession} onClose={() => setSelectedSession(null)} title="Session Details">
        {selectedSession && (() => {
          const student = getUserById(selectedSession.studentId);
          return (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar name={student?.name || 'S'} size="lg" />
                <div>
                  <p className="font-semibold text-gray-900">{student?.name}</p>
                  <p className="text-sm text-gray-500">{student?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Subject:</span> <span className="font-medium">{selectedSession.subjectId}</span></div>
                <div><span className="text-gray-500">Topic:</span> <span className="font-medium">{selectedSession.topic}</span></div>
                <div><span className="text-gray-500">Date:</span> <span className="font-medium">{formatDate(selectedSession.date)}</span></div>
                <div><span className="text-gray-500">Time:</span> <span className="font-medium">{selectedSession.startTime} - {selectedSession.endTime}</span></div>
                <div><span className="text-gray-500">Status:</span> <Badge variant={selectedSession.status === 'upcoming' ? 'info' : 'success'}>{selectedSession.status}</Badge></div>
              </div>
              {selectedSession.notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Session Notes</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedSession.notes}</p>
                </div>
              )}
            </div>
          );
        })()}
      </Dialog>

      <Dialog open={showAvailability} onClose={() => setShowAvailability(false)} title="Set Availability">
        <p className="text-sm text-gray-500 mb-4">Select your available time slots for the upcoming week.</p>
        <div className="space-y-2">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
            <div key={day} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <span className="text-sm font-medium">{day}</span>
              <div className="flex gap-2">
                {['09:00-12:00', '13:00-17:00', '18:00-21:00'].map(slot => (
                  <label key={slot} className="flex items-center gap-1 text-xs">
                    <input type="checkbox" className="rounded" defaultChecked />
                    {slot}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={() => setShowAvailability(false)}>Save Availability</Button>
        </div>
      </Dialog>
    </div>
  );
}
