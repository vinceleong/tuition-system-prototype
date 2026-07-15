import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { EmptyState } from '../../components/shared/shared';
import { Users, Calendar, Mail, GraduationCap } from 'lucide-react';
import { getUserById } from '../../data/users';
import { formatDate } from '../../lib/utils';
import { useState } from 'react';
import type { User } from '../../data';

export function TutorStudents() {
  const { sessions, currentUser } = useApp();
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const mySessions = sessions.filter(s => s.tutorId === currentUser.id);
  const uniqueStudentIds = [...new Set(mySessions.map(s => s.studentId))];
  const myStudents = uniqueStudentIds.map(id => getUserById(id)).filter(Boolean) as User[];

  function getStudentSessions(studentId: string) {
    return mySessions.filter(s => s.studentId === studentId);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
        <p className="text-gray-500 mt-1">{myStudents.length} students across your sessions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myStudents.map(student => {
          const studentSessions = getStudentSessions(student.id);
          const lastSession = studentSessions.sort((a, b) => b.date.localeCompare(a.date))[0];
          return (
            <Card key={student.id}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={student.name} size="lg" />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.grade || 'N/A'}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Sessions</span><span className="font-medium">{studentSessions.length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Last Session</span><span className="font-medium">{lastSession ? formatDate(lastSession.date) : 'N/A'}</span></div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setSelectedStudent(student)}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
        {myStudents.length === 0 && (
          <div className="col-span-full">
            <EmptyState icon="👨‍🎓" title="No students yet" description="Students will appear here once you have conducted sessions." />
          </div>
        )}
      </div>

      <Dialog open={!!selectedStudent} onClose={() => setSelectedStudent(null)} title="Student Details">
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={selectedStudent.name} size="lg" />
              <div>
                <p className="font-semibold text-gray-900">{selectedStudent.name}</p>
                <p className="text-sm text-gray-500">{selectedStudent.email}</p>
                <p className="text-sm text-gray-500">{selectedStudent.grade}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Session History</p>
              <div className="space-y-2">
                {getStudentSessions(selectedStudent.id).map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                    <div>
                      <p className="font-medium">{s.topic}</p>
                      <p className="text-gray-500">{formatDate(s.date)}</p>
                    </div>
                    <Badge variant={s.status === 'completed' ? 'success' : s.status === 'upcoming' ? 'info' : 'warning'}>
                      {s.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
