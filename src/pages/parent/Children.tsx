import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Tabs } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Select } from '../../components/ui/input';
import { EmptyState } from '../../components/shared/shared';
import { getUserById } from '../../data/users';
import { formatCurrency, formatDate } from '../../lib/utils';

export function ParentChildren() {
  const { students, sessions, payments, tutors } = useApp();
  const [activeChild, setActiveChild] = useState(students[0]?.id || '');
  const [showBookDialog, setShowBookDialog] = useState(false);

  const child = students.find(s => s.id === activeChild);
  const childSessions = sessions.filter(s => s.studentId === activeChild);
  const childTutorIds = [...new Set(childSessions.map(s => s.tutorId))];
  const childTutors = childTutorIds.map(id => getUserById(id)).filter(Boolean);
  const childPayments = payments.filter(p => p.userId === activeChild);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Children</h1>
          <p className="text-gray-500 mt-1">Manage your children's tuition</p>
        </div>
        <Button onClick={() => setShowBookDialog(true)}>Book a Session</Button>
      </div>

      {students.length > 1 && (
        <Tabs
          tabs={students.map(s => ({ id: s.id, label: s.name }))}
          activeTab={activeChild}
          onChange={setActiveChild}
        />
      )}

      {child && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader><h3 className="font-semibold text-gray-900">Profile</h3></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={child.name} size="lg" />
                <div>
                  <p className="font-semibold text-gray-900">{child.name}</p>
                  <p className="text-sm text-gray-500">{child.grade}</p>
                  <p className="text-sm text-gray-500">{child.email}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">Joined: {formatDate(child.joinedAt)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h3 className="font-semibold text-gray-900">Tutors ({childTutors.length})</h3></CardHeader>
            <CardContent>
              {childTutors.length === 0 ? (
                <p className="text-sm text-gray-500">No tutors yet</p>
              ) : (
                <div className="space-y-2">
                  {childTutors.map(t =>
                    t && (
                      <div key={t.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                        <Avatar name={t.name} size="sm" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">{t.name}</p>
                          <p className="text-xs text-gray-500">{t.subjects?.join(', ')} · {formatCurrency(t.hourlyRate || 0)}/hr</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h3 className="font-semibold text-gray-900">Payment History</h3></CardHeader>
            <CardContent>
              {childPayments.length === 0 ? (
                <p className="text-sm text-gray-500">No payments yet</p>
              ) : (
                <div className="space-y-2">
                  {childPayments.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-gray-900 truncate max-w-[150px]">{p.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(p.date)}</p>
                      </div>
                      <span className="font-medium text-gray-900">{formatCurrency(p.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader><h3 className="font-semibold text-gray-900">Recent Sessions</h3></CardHeader>
        <CardContent>
          {childSessions.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No sessions yet</p>
          ) : (
            <div className="space-y-2">
              {childSessions.slice(0, 8).map(s => {
                const tutor = getUserById(s.tutorId);
                return (
                  <div key={s.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{s.topic}</p>
                      <p className="text-xs text-gray-500">with {tutor?.name} · {formatDate(s.date)}</p>
                    </div>
                    <Badge variant={s.status === 'completed' ? 'success' : s.status === 'upcoming' ? 'info' : 'warning'}>
                      {s.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showBookDialog} onClose={() => setShowBookDialog(false)} title="Book a Session">
        <div className="space-y-3">
          <Select label="Child" options={students.map(s => ({ value: s.id, label: s.name }))} />
          <Select label="Tutor" options={tutors.map(t => ({ value: t.id, label: t.name }))} />
          <Select label="Subject" options={[
            { value: 'math', label: 'Mathematics' },
            { value: 'physics', label: 'Physics' },
            { value: 'english', label: 'English' },
            { value: 'coding', label: 'Programming' },
          ]} />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowBookDialog(false)}>Cancel</Button>
            <Button onClick={() => { setShowBookDialog(false); alert('Session request sent! (visual only)'); }}>Request Session</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
