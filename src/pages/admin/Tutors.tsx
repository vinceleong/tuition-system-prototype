import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Tabs } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { StarRating, EmptyState } from '../../components/shared/shared';
import { Check, X, GraduationCap } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';

export function AdminTutors() {
  const { tutors, sessions, payments, getReviewsForTutor } = useApp();
  const [activeTab, setActiveTab] = useState('active');
  const [selectedTutor, setSelectedTutor] = useState<string | null>(null);

  // Mock pending tutors
  const pendingTutors = [
    { id: 'pending-1', name: 'John Smith', email: 'john.smith@example.com', subjects: ['physics'], bio: 'Physics teacher with 5 years experience', date: '2026-07-10' },
    { id: 'pending-2', name: 'Lisa Wang', email: 'lisa.wang@example.com', subjects: ['math'], bio: 'Math olympiad coach', date: '2026-07-08' },
    { id: 'pending-3', name: 'Carlos Mendez', email: 'carlos.m@example.com', subjects: ['coding'], bio: 'Full-stack developer turned educator', date: '2026-07-05' },
  ];

  const selectedTutorData = tutors.find(t => t.id === selectedTutor);
  const selectedReviews = selectedTutor ? getReviewsForTutor(selectedTutor) : [];
  const selectedSessions = selectedTutor ? sessions.filter(s => s.tutorId === selectedTutor) : [];
  const selectedEarnings = selectedTutor ? payments.filter(p => p.tutorId === selectedTutor && p.type === 'session_payment' && p.status === 'completed').reduce((s, p) => s + p.amount, 0) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tutor Management</h1>
        <p className="text-gray-500 mt-1">{tutors.length} active · {pendingTutors.length} pending approval</p>
      </div>

      <Tabs
        tabs={[
          { id: 'active', label: 'Active Tutors', count: tutors.length },
          { id: 'pending', label: 'Pending Approval', count: pendingTutors.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'active' ? (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Tutor</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Subjects</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Rating</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Sessions</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Earnings</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tutors.map(t => {
                  const tSessions = sessions.filter(s => s.tutorId === t.id);
                  const tEarnings = payments.filter(p => p.tutorId === t.id && p.type === 'session_payment' && p.status === 'completed').reduce((s, p) => s + p.amount, 0);
                  return (
                    <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={t.name} size="sm" />
                          <span className="text-sm font-medium text-gray-900">{t.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {t.subjects?.map(s => <Badge key={s} variant="info">{s}</Badge>)}
                        </div>
                      </td>
                      <td className="px-4 py-3"><StarRating rating={t.rating || 0} size="sm" /></td>
                      <td className="px-4 py-3 text-sm text-gray-700">{tSessions.length}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(tEarnings)}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedTutor(t.id)}>View</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pendingTutors.map(t => (
            <Card key={t.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={t.name} size="md" />
                  <div>
                    <p className="font-medium text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.email}</p>
                    <p className="text-xs text-gray-400">{t.bio}</p>
                    <p className="text-xs text-gray-400">Applied {formatDate(t.date)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-green-600 border-green-300"><Check size={14} className="mr-1" /> Approve</Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-300"><X size={14} className="mr-1" /> Reject</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedTutor} onClose={() => setSelectedTutor(null)} title="Tutor Details">
        {selectedTutorData && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={selectedTutorData.name} size="lg" />
              <div>
                <p className="font-semibold text-gray-900">{selectedTutorData.name}</p>
                <p className="text-sm text-gray-500">{selectedTutorData.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">{selectedTutorData.bio}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Rate:</span> <span className="font-medium">{formatCurrency(selectedTutorData.hourlyRate || 0)}/hr</span></div>
              <div><span className="text-gray-500">Rating:</span> <StarRating rating={selectedTutorData.rating || 0} size="sm" /></div>
              <div><span className="text-gray-500">Sessions:</span> <span className="font-medium">{selectedSessions.length}</span></div>
              <div><span className="text-gray-500">Earnings:</span> <span className="font-medium">{formatCurrency(selectedEarnings)}</span></div>
            </div>
            {selectedReviews.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Recent Reviews</p>
                {selectedReviews.slice(0, 3).map(r => (
                  <div key={r.id} className="text-sm p-2 bg-gray-50 rounded-lg mb-1">
                    <StarRating rating={r.rating} size="sm" />
                    <p className="text-gray-600 mt-1">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
