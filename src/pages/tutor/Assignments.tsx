import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs } from '../../components/ui/tabs';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input, Textarea } from '../../components/ui/input';
import { Avatar } from '../../components/ui/avatar';
import { EmptyState } from '../../components/shared/shared';
import { getUserById } from '../../data/users';
import { formatDate } from '../../lib/utils';
import type { Assignment } from '../../data';

export function TutorAssignments() {
  const { assignments, currentUser, gradeAssignment, getAssignments } = useApp();
  const myAssignments = getAssignments();
  const [activeTab, setActiveTab] = useState('pending');
  const [grading, setGrading] = useState<Assignment | null>(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  const toGrade = myAssignments.filter(a => a.status === 'submitted');
  const graded = myAssignments.filter(a => a.status === 'graded');
  const pending = myAssignments.filter(a => a.status === 'pending');

  const displayed = activeTab === 'pending' ? [...toGrade, ...pending] : myAssignments;

  const handleGrade = () => {
    if (grading && grade) {
      gradeAssignment(grading.id, grade, feedback);
      setGrading(null);
      setGrade('');
      setFeedback('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-500 mt-1">Manage student assignments and grading</p>
      </div>

      <Tabs
        tabs={[
          { id: 'pending', label: 'To Grade', count: toGrade.length },
          { id: 'all', label: 'All Assignments' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="space-y-3">
        {displayed.map(a => {
          const student = getUserById(a.studentId);
          return (
            <Card key={a.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={student?.name || 'S'} size="sm" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">{a.title}</p>
                    <p className="text-xs text-gray-500">{student?.name} · Due {formatDate(a.dueDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={a.status === 'graded' ? 'success' : a.status === 'submitted' ? 'warning' : 'info'}>
                    {a.status}
                  </Badge>
                  {a.grade && <span className="font-bold text-sm text-gray-900">{a.grade}</span>}
                  {a.status === 'submitted' && (
                    <Button size="sm" onClick={() => setGrading(a)}>Grade</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {displayed.length === 0 && (
          <EmptyState icon="📝" title="No assignments" description="Assignments you create will appear here." />
        )}
      </div>

      <Dialog open={!!grading} onClose={() => setGrading(null)} title="Grade Assignment">
        {grading && (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-900">{grading.title}</p>
              <p className="text-sm text-gray-500">{grading.description}</p>
              <p className="text-xs text-gray-400 mt-1">Submitted: {grading.submittedAt}</p>
            </div>
            <Input label="Grade" value={grade} onChange={e => setGrade(e.target.value)} placeholder="A, B+, 85%, etc." />
            <Textarea label="Feedback" value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Provide feedback..." rows={3} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setGrading(null)}>Cancel</Button>
              <Button onClick={handleGrade}>Submit Grade</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
