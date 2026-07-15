import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { BarChart, StatCard } from '../../components/shared/shared';
import { ProgressBar } from '../../components/ui/progress';
import { Avatar } from '../../components/ui/avatar';
import { TrendingUp, BookOpen, CheckCircle } from 'lucide-react';
import { getUserById } from '../../data/users';
import { subjects } from '../../data/subjects';

export function ParentProgress() {
  const { students, sessions, assignments, reviews } = useApp();
  const [expandedChild, setExpandedChild] = useState<string | null>(students[0]?.id || null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Learning Progress</h1>
        <p className="text-gray-500 mt-1">Track your children's academic development</p>
      </div>

      {students.map(student => {
        const studentSessions = sessions.filter(s => s.studentId === student.id);
        const completed = studentSessions.filter(s => s.status === 'completed');
        const total = studentSessions.length;
        const attendanceRate = total > 0 ? Math.round((completed.length / total) * 100) : 0;
        const studentAssignments = assignments.filter(a => a.studentId === student.id);
        const graded = studentAssignments.filter(a => a.status === 'graded');
        const completionRate = studentAssignments.length > 0
          ? Math.round(((graded.length + studentAssignments.filter(a => a.status === 'submitted').length) / studentAssignments.length) * 100)
          : 0;

        const gradeData = subjects.map(sub => {
          const subAssignments = graded.filter(a => a.subjectId === sub.id);
          const avg = subAssignments.length > 0
            ? subAssignments.filter(a => a.grade && !['F', 'D'].includes(a.grade[0])).length / subAssignments.length * 100
            : 0;
          return { label: sub.name, value: Math.round(avg), color: 'bg-primary-400' };
        });

        const isExpanded = expandedChild === student.id;

        return (
          <Card key={student.id}>
            <CardHeader>
              <button
                onClick={() => setExpandedChild(isExpanded ? null : student.id)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={student.name} size="md" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.grade}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-lg">{isExpanded ? '▾' : '▸'}</span>
              </button>
            </CardHeader>
            {isExpanded && (
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard label="Attendance Rate" value={`${attendanceRate}%`} icon={<CheckCircle size={20} />} trend={attendanceRate > 80 ? 'up' : 'down'} />
                  <StatCard label="Sessions Completed" value={completed.length} icon={<BookOpen size={20} />} />
                  <StatCard label="Assignment Completion" value={`${completionRate}%`} icon={<TrendingUp size={20} />} />
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-3">Grades by Subject</h4>
                  <BarChart data={gradeData} />
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Attendance</h4>
                  <div className="flex items-center gap-3">
                    <ProgressBar value={attendanceRate} className="flex-1" />
                    <span className="text-sm font-medium text-gray-700">{completed.length}/{total} sessions</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Tutor Feedback</h4>
                  <div className="space-y-2">
                    {completed.filter(s => s.notes).slice(0, 3).map(s => {
                      const tutor = getUserById(s.tutorId);
                      return (
                        <div key={s.id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{s.notes}</p>
                          <p className="text-xs text-gray-500 mt-1">— {tutor?.name} · {s.topic}</p>
                        </div>
                      );
                    })}
                    {completed.filter(s => s.notes).length === 0 && (
                      <p className="text-sm text-gray-500">No feedback yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
