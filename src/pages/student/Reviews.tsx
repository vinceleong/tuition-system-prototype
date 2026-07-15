import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getUserById } from '../../data/users';
import { formatDate } from '../../lib/utils';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Avatar } from '../../components/ui/avatar';
import { Select } from '../../components/ui/input';
import { Tabs } from '../../components/ui/tabs';
import { StarRating, EmptyState } from '../../components/shared/shared';
import { Filter } from 'lucide-react';

export function StudentReviews() {
  const {
    currentUserId, getReviewsForStudent, reviews, tutors, subjects,
  } = useApp();
  const [activeTab, setActiveTab] = useState('my');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [tutorFilter, setTutorFilter] = useState('all');

  const myReviews = getReviewsForStudent(currentUserId);

  const allReviews = reviews;

  const subjectOptions = [
    { value: 'all', label: 'All Subjects' },
    ...subjects.map((s) => ({ value: s.id, label: s.name })),
  ];

  const tutorOptions = [
    { value: 'all', label: 'All Tutors' },
    ...tutors.map((t) => ({ value: t.id, label: t.name })),
  ];

  const filteredMyReviews = myReviews;
  const filteredAllReviews = allReviews.filter((r) => {
    if (subjectFilter !== 'all') {
      const tutor = tutors.find((t) => t.id === r.tutorId);
      if (!tutor?.subjects?.includes(subjectFilter)) return false;
    }
    if (tutorFilter !== 'all' && r.tutorId !== tutorFilter) return false;
    return true;
  });

  const tabs = [
    { id: 'my', label: 'My Reviews', count: myReviews.length },
    { id: 'all', label: 'All Reviews', count: filteredAllReviews.length },
  ];

  const displayReviews = activeTab === 'my' ? filteredMyReviews : filteredAllReviews;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-500 mt-1">View and manage your reviews.</p>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            {activeTab === 'all' && (
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-gray-400" />
                <Select
                  options={subjectOptions}
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="w-36"
                />
                <Select
                  options={tutorOptions}
                  value={tutorFilter}
                  onChange={(e) => setTutorFilter(e.target.value)}
                  className="w-36"
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {displayReviews.length === 0 ? (
            <EmptyState
              icon="⭐"
              title={activeTab === 'my' ? 'No reviews written' : 'No reviews found'}
              description={
                activeTab === 'my'
                  ? 'You haven\'t written any reviews yet. Complete a session to leave a review.'
                  : 'No reviews match your filters.'
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {displayReviews.map((review) => {
                const tutor = getUserById(review.tutorId);
                const student = getUserById(review.studentId);
                const isMyReview = review.studentId === currentUserId;
                const subjectName = tutor?.subjects?.[0]
                  ? subjects.find((s) => s.id === tutor.subjects![0])?.name
                  : null;

                return (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={isMyReview ? (tutor?.name || 'Tutor') : (student?.name || 'Student')}
                          size="md"
                        />
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {isMyReview ? tutor?.name : student?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {isMyReview ? 'Tutor' : 'Student'} · {formatDate(review.date)}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>

                    <div className="flex items-center gap-2 mt-3">
                      {subjectName && (
                        <Badge variant="info" className="text-xs">{subjectName}</Badge>
                      )}
                      {isMyReview && (
                        <Button variant="ghost" size="sm" className="text-xs">
                          Edit
                        </Button>
                      )}
                      {!isMyReview && (
                        <span className="text-xs text-gray-400">
                          Review for {tutor?.name}
                        </span>
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
