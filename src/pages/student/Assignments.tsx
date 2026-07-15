import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getUserById } from '../../data/users';
import { formatDate } from '../../lib/utils';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/input';
import { Dialog } from '../../components/ui/dialog';
import { Tabs } from '../../components/ui/tabs';
import { EmptyState } from '../../components/shared/shared';
import {
  Calendar, Upload, FileText, CheckCircle, Clock, Download,
} from 'lucide-react';

export function StudentAssignments() {
  const { getAssignments, submitAssignment } = useApp();
  const [activeTab, setActiveTab] = useState('pending');
  const [submitDialogId, setSubmitDialogId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState('');

  const assignments = getAssignments();

  const pendingAssignments = assignments
    .filter((a) => a.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const submittedAssignments = assignments
    .filter((a) => a.status === 'submitted')
    .sort((a, b) => new Date(b.submittedAt || '').getTime() - new Date(a.submittedAt || '').getTime());
  const gradedAssignments = assignments
    .filter((a) => a.status === 'graded')
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const tabs = [
    { id: 'pending', label: 'Pending', count: pendingAssignments.length },
    { id: 'submitted', label: 'Submitted', count: submittedAssignments.length },
    { id: 'graded', label: 'Graded', count: gradedAssignments.length },
  ];

  const activeAssignments =
    activeTab === 'pending' ? pendingAssignments :
    activeTab === 'submitted' ? submittedAssignments :
    gradedAssignments;

  const handleSubmit = (assignmentId: string) => {
    submitAssignment(assignmentId);
    setSubmitDialogId(null);
    setSubmissionText('');
  };

  const getGradeColor = (grade?: string) => {
    if (!grade) return 'text-gray-500';
    const letter = grade.charAt(0).toUpperCase();
    if (letter === 'A') return 'text-green-600';
    if (letter === 'B') return 'text-blue-600';
    if (letter === 'C') return 'text-yellow-600';
    if (letter === 'D' || letter === 'F') return 'text-red-600';
    return 'text-gray-600';
  };

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-gray-500 mt-1">Track and submit your assignments.</p>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </CardHeader>
        <CardContent>
          {activeAssignments.length === 0 ? (
            <EmptyState
              icon="📝"
              title={`No ${activeTab} assignments`}
              description={
                activeTab === 'pending'
                  ? 'All caught up! No pending assignments right now.'
                  : `You have no ${activeTab} assignments yet.`
              }
            />
          ) : (
            <div className="space-y-3 mt-4">
              {activeAssignments.map((assignment) => {
                const tutor = getUserById(assignment.tutorId);
                return (
                  <div
                    key={assignment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex flex-col">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                          {activeTab === 'pending' && isOverdue(assignment.dueDate) && (
                            <Badge variant="danger">Overdue</Badge>
                          )}
                          {activeTab === 'submitted' && (
                            <Badge variant="warning">Awaiting Grade</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-1">
                          {assignment.subjectId} · Tutor: {tutor?.name}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            Due: {formatDate(assignment.dueDate)}
                          </span>
                          {assignment.submittedAt && (
                            <span className="flex items-center gap-1">
                              <Upload size={12} />
                              Submitted: {formatDate(assignment.submittedAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{assignment.description}</p>

                        {activeTab === 'graded' && assignment.grade && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-bold ${getGradeColor(assignment.grade)}`}>
                                {assignment.grade}
                              </span>
                              {assignment.feedback && (
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500">Feedback:</p>
                                  <p className="text-sm text-gray-700">{assignment.feedback}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alert(`📥 Downloading: ${assignment.title}\n\n(Demo — file download simulated)`)}
                        >
                          <Download size={14} className="mr-1.5" />
                          Download Assignment
                        </Button>
                        <div>
                          {activeTab === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => setSubmitDialogId(assignment.id)}
                            >
                              <Upload size={14} className="mr-1" />
                              Submit
                            </Button>
                          )}
                          {activeTab === 'submitted' && (
                            <div className="flex items-center gap-1 text-yellow-600">
                              <Clock size={14} />
                              <span className="text-xs font-medium">Awaiting Grade</span>
                            </div>
                          )}
                          {activeTab === 'graded' && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle size={16} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Dialog */}
      <Dialog
        open={!!submitDialogId}
        onClose={() => { setSubmitDialogId(null); setSubmissionText(''); }}
        title="Submit Assignment"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Add any notes or comments with your submission.
          </p>
          <Textarea
            label="Submission Notes"
            placeholder="Write any notes for your tutor..."
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
          />
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <FileText size={18} className="text-gray-400" />
            <span className="text-sm text-gray-500">Upload file (simulated)</span>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => { setSubmitDialogId(null); setSubmissionText(''); }}>
              Cancel
            </Button>
            <Button onClick={() => submitDialogId && handleSubmit(submitDialogId)}>
              Submit Assignment
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
