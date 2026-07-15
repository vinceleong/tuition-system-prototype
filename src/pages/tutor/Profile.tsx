import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input, Textarea, Select } from '../../components/ui/input';
import { Avatar } from '../../components/ui/avatar';
import { StarRating, StatCard } from '../../components/shared/shared';
import { Badge } from '../../components/ui/badge';
import { Save, BookOpen, Users, Star } from 'lucide-react';
import { getUserById } from '../../data/users';
import { formatCurrency, formatDate } from '../../lib/utils';

export function TutorProfile() {
  const { currentUser, sessions, reviews, getReviewsForTutor } = useApp();
  const mySessions = sessions.filter(s => s.tutorId === currentUser.id);
  const uniqueStudents = [...new Set(mySessions.map(s => s.studentId))];
  const myReviews = getReviewsForTutor(currentUser.id);
  const avgRating = myReviews.length ? myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your public profile and view your stats</p>
      </div>

      <Card>
        <CardHeader><h3 className="font-semibold text-gray-900">Profile Information</h3></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar name={currentUser.name} size="lg" />
            <div>
              <p className="text-lg font-semibold">{currentUser.name}</p>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" defaultValue={currentUser.name} />
            <Input label="Email" defaultValue={currentUser.email} />
            <Input label="Hourly Rate ($)" defaultValue={String(currentUser.hourlyRate || '')} />
            <Select
              label="Primary Subject"
              options={[
                { value: 'math', label: 'Mathematics' },
                { value: 'physics', label: 'Physics' },
                { value: 'english', label: 'English' },
                { value: 'coding', label: 'Programming' },
              ]}
              defaultValue={currentUser.subjects?.[0] || ''}
            />
          </div>
          <Textarea label="Bio" defaultValue={currentUser.bio || ''} rows={4} />
          <div className="flex justify-end">
            <Button onClick={() => alert('Profile saved! (visual only)')}>
              <Save size={16} className="mr-1" /> Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Sessions Taught" value={mySessions.length} icon={<BookOpen size={20} />} />
        <StatCard label="Students Taught" value={uniqueStudents.length} icon={<Users size={20} />} />
        <StatCard label="Avg Rating" value={avgRating.toFixed(1)} icon={<Star size={20} />} />
      </div>

      <Card>
        <CardHeader><h3 className="font-semibold text-gray-900">Reviews ({myReviews.length})</h3></CardHeader>
        <CardContent>
          {myReviews.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No reviews yet</p>
          ) : (
            <div className="space-y-3">
              {myReviews.map(r => {
                const student = getUserById(r.studentId);
                return (
                  <div key={r.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <StarRating rating={r.rating} size="sm" />
                      <span className="text-xs text-gray-400">{formatDate(r.date)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{r.text}</p>
                    <p className="text-xs text-gray-500 mt-1">— {student?.name}</p>
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
