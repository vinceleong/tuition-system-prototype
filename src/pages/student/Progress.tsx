import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { BarChart, EmptyState } from '../../components/shared/shared';
import {
  TrendingUp, Clock, BookOpen, CheckCircle, Target,
} from 'lucide-react';

export function StudentProgress() {
  const { getSessions, getAssignments, subjects } = useApp();

  const sessions = getSessions();
  const assignments = getAssignments();

  const completedSessions = sessions.filter((s) => s.status === 'completed');

  const totalHours = completedSessions.reduce((sum, s) => {
    const [startH, startM] = s.startTime.split(':').map(Number);
    const [endH, endM] = s.endTime.split(':').map(Number);
    return sum + (endH + endM / 60) - (startH + startM / 60);
  }, 0);

  const now = new Date();
  const thisMonthSessions = completedSessions.filter((s) => {
    const d = new Date(s.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const gradedAssignments = assignments.filter((a) => a.status === 'graded');

  const gradeMap: Record<string, number> = { 'A+': 4.3, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0 };

  // Bar chart data by subject
  const subjectGrades = useMemo(() => {
    const bySubject: Record<string, { total: number; count: number }> = {};
    gradedAssignments.forEach((a) => {
      if (!bySubject[a.subjectId]) {
        bySubject[a.subjectId] = { total: 0, count: 0 };
      }
      bySubject[a.subjectId].total += gradeMap[a.grade || 'F'] || 0;
      bySubject[a.subjectId].count += 1;
    });

    const colors = ['bg-primary-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
    return Object.entries(bySubject).map(([subjId, data], idx) => ({
      label: subjects.find((s) => s.id === subjId)?.name || subjId,
      value: Math.round((data.total / data.count) * 100) / 100,
      color: colors[idx % colors.length],
    }));
  }, [gradedAssignments, subjects]);

  // Subject breakdown
  const subjectBreakdown = useMemo(() => {
    const breakdown: Record<string, { assignments: typeof gradedAssignments; avgGrade: number }> = {};
    gradedAssignments.forEach((a) => {
      if (!breakdown[a.subjectId]) {
        breakdown[a.subjectId] = { assignments: [], avgGrade: 0 };
      }
      breakdown[a.subjectId].assignments.push(a);
    });
    // Calculate averages
    Object.keys(breakdown).forEach((subjId) => {
      const items = breakdown[subjId].assignments;
      let total = 0;
      items.forEach((a) => {
        total += gradeMap[a.grade || 'F'] || 0;
      });
      breakdown[subjId].avgGrade = total / items.length;
    });
    return breakdown;
  }, [gradedAssignments]);

  const getGradeColor = (grade?: string) => {
    if (!grade) return 'text-gray-500';
    const letter = grade.charAt(0).toUpperCase();
    if (letter === 'A') return 'text-green-600';
    if (letter === 'B') return 'text-blue-600';
    if (letter === 'C') return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
        <p className="text-gray-500 mt-1">Track your learning journey and performance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Hours</span>
            <Clock size={20} className="text-primary-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}h</div>
          <div className="text-xs text-gray-500 mt-1">Learning time</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Sessions This Month</span>
            <Target size={20} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{thisMonthSessions.length}</div>
          <div className="text-xs text-gray-500 mt-1">Completed sessions</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Assignments Graded</span>
            <CheckCircle size={20} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{gradedAssignments.length}</div>
          <div className="text-xs text-gray-500 mt-1">Total graded work</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Overall GPA</span>
            <TrendingUp size={20} className="text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {gradedAssignments.length > 0
              ? (gradedAssignments.reduce((sum, a) => sum + (gradeMap[a.grade || 'F'] || 0), 0) / gradedAssignments.length).toFixed(1)
              : 'N/A'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Across all subjects</div>
        </div>
      </div>

      {/* Grade Trend */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-600" />
            <h2 className="font-semibold text-gray-900">Grade Trend by Subject</h2>
          </div>
        </CardHeader>
        <CardContent>
          {subjectGrades.length === 0 ? (
            <EmptyState
              icon="📊"
              title="No grade data"
              description="Complete and get graded on assignments to see your trends."
            />
          ) : (
            <BarChart data={subjectGrades} />
          )}
        </CardContent>
      </Card>

      {/* Subject Breakdown */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-primary-600" />
            <h2 className="font-semibold text-gray-900">Subject Breakdown</h2>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(subjectBreakdown).length === 0 ? (
            <EmptyState
              icon="📚"
              title="No subject data"
              description="Your subject performance will appear here."
            />
          ) : (
            <div className="space-y-4">
              {Object.entries(subjectBreakdown).map(([subjId, data]) => {
                const subj = subjects.find((s) => s.id === subjId);
                const avg = data.avgGrade;
                return (
                  <div key={subjId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{subj?.name || subjId}</h3>
                      <Badge variant="info">{avg.toFixed(1)} GPA</Badge>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-2 text-xs font-medium text-gray-500">Assignment</th>
                            <th className="text-left py-2 text-xs font-medium text-gray-500">Grade</th>
                            <th className="text-left py-2 text-xs font-medium text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.assignments.map((a) => (
                            <tr key={a.id} className="border-b border-gray-50">
                              <td className="py-2 text-gray-900">{a.title}</td>
                              <td className={`py-2 font-semibold ${getGradeColor(a.grade)}`}>
                                {a.grade || 'N/A'}
                              </td>
                              <td className="py-2">
                                <Badge variant="success">Graded</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
