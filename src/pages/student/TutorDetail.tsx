import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getUserById } from '../../data/users';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input, Select, Textarea } from '../../components/ui/input';
import { Avatar } from '../../components/ui/avatar';
import { Dialog } from '../../components/ui/dialog';
import { StarRating, EmptyState } from '../../components/shared/shared';
import {
  Calendar, DollarSign, BookOpen, GraduationCap,
  Star, MessageSquare, ArrowLeft,
} from 'lucide-react';

export function TutorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    tutors, subjects, sessions, getReviewsForTutor, currentUserId,
    addPayment, addReview,
  } = useApp();

  const tutor = tutors.find((t) => t.id === id) || getUserById(id || '');

  const [showBookDialog, setShowBookDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');

  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const [booked, setBooked] = useState(false);

  if (!tutor) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Tutor not found</h2>
        <p className="text-gray-500 mb-4">The tutor you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/student/find-tutors')}>Back to Find Tutors</Button>
      </div>
    );
  }

  const reviews = getReviewsForTutor(tutor.id);
  const tutorSessions = sessions.filter((s) => s.tutorId === tutor.id);

  const tutorSubjects = subjects.filter((s) => tutor.subjects?.includes(s.id));
  const selectedSubjectData = subjects.find((s) => s.id === selectedSubject);

  const yearsTeaching = Math.max(1, Math.floor(
    (new Date().getTime() - new Date(tutor.joinedAt).getTime()) / (365 * 24 * 60 * 60 * 1000)
  ));

  const handleBookSession = () => {
    const newPayment = {
      id: `pay-${Date.now()}`,
      userId: currentUserId,
      tutorId: tutor.id,
      amount: tutor.hourlyRate || 0,
      type: 'session_payment' as const,
      status: 'completed' as const,
      date: new Date().toISOString().split('T')[0],
      description: `Session booking: ${selectedSubjectData?.name || selectedSubject} - ${selectedTopic}`,
    };
    addPayment(newPayment);
    setBooked(true);
    setShowBookDialog(false);
    setTimeout(() => setBooked(false), 3000);
  };

  const handleAddReview = () => {
    const newReview = {
      id: `rev-${Date.now()}`,
      tutorId: tutor.id,
      studentId: currentUserId,
      rating: reviewRating,
      text: reviewText,
      date: new Date().toISOString().split('T')[0],
    };
    addReview(newReview);
    setShowReviewDialog(false);
    setReviewRating(5);
    setReviewText('');
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/student/find-tutors')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Find Tutors
      </button>

      {/* Booked confirmation */}
      {booked && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
          Session booked successfully! The payment has been processed.
        </div>
      )}

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar name={tutor.name} size="lg" className="w-20 h-20 text-xl" />
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{tutor.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {tutor.subjects?.map((subjId) => {
                      const subj = subjects.find((s) => s.id === subjId);
                      return (
                        <Badge key={subjId} variant="info">
                          {subj?.name || subjId}
                        </Badge>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {tutor.rating && <StarRating rating={tutor.rating} size="md" />}
                    {tutor.reviewCount && (
                      <span className="text-sm text-gray-500">({tutor.reviewCount} reviews)</span>
                    )}
                  </div>
                </div>
                <Button size="lg" onClick={() => setShowBookDialog(true)}>
                  <Calendar size={18} className="mr-2" />
                  Book a Session
                </Button>
              </div>
              {tutor.bio && (
                <p className="text-gray-600 mt-4 leading-relaxed">{tutor.bio}</p>
              )}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <DollarSign size={18} className="mx-auto text-primary-600 mb-1" />
                  <p className="font-semibold text-gray-900">{formatCurrency(tutor.hourlyRate || 0)}</p>
                  <p className="text-xs text-gray-500">per hour</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <BookOpen size={18} className="mx-auto text-primary-600 mb-1" />
                  <p className="font-semibold text-gray-900">{tutorSessions.length}</p>
                  <p className="text-xs text-gray-500">Total Sessions</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <GraduationCap size={18} className="mx-auto text-primary-600 mb-1" />
                  <p className="font-semibold text-gray-900">{yearsTeaching}+</p>
                  <p className="text-xs text-gray-500">Years Teaching</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-primary-600" />
              <h2 className="font-semibold text-gray-900">Reviews</h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowReviewDialog(true)}>
              <Star size={14} className="mr-1" />
              Write a Review
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <EmptyState
              icon="⭐"
              title="No reviews yet"
              description="Be the first to review this tutor!"
            />
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const student = getUserById(review.studentId);
                return (
                  <div key={review.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name={student?.name || 'Student'} size="sm" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">{student?.name}</p>
                          <p className="text-xs text-gray-500">{formatDate(review.date)}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="text-sm text-gray-600 mt-3">{review.text}</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Book Session Dialog */}
      <Dialog open={showBookDialog} onClose={() => setShowBookDialog(false)} title="Book a Session">
        <div className="space-y-4">
          <Select
            label="Subject"
            options={[
              { value: '', label: 'Select a subject' },
              ...tutorSubjects.map((s) => ({ value: s.id, label: s.name })),
            ]}
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedTopic('');
            }}
          />
          {selectedSubject && selectedSubjectData && (
            <Select
              label="Topic"
              options={[
                { value: '', label: 'Select a topic' },
                ...selectedSubjectData.topics.map((t) => ({ value: t, label: t })),
              ]}
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            />
          )}
          <Input
            label="Date"
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
          />
          <Input
            label="Time"
            type="time"
            value={sessionTime}
            onChange={(e) => setSessionTime(e.target.value)}
          />
          {selectedSubject && selectedTopic && sessionDate && sessionTime && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="text-gray-600">Session Summary</p>
              <p className="font-medium text-gray-900 mt-1">{selectedSubjectData?.name} - {selectedTopic}</p>
              <p className="text-gray-500">{formatDate(sessionDate)} at {sessionTime}</p>
              <p className="font-bold text-primary-700 mt-2">{formatCurrency(tutor.hourlyRate || 0)}</p>
            </div>
          )}
          <Button
            className="w-full"
            disabled={!selectedSubject || !selectedTopic || !sessionDate || !sessionTime}
            onClick={handleBookSession}
          >
            Confirm Booking
          </Button>
        </div>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onClose={() => setShowReviewDialog(false)} title="Write a Review">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className={`text-2xl transition-colors ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <Textarea
            label="Your Review"
            placeholder="Share your experience with this tutor..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <Button
            className="w-full"
            disabled={!reviewText.trim()}
            onClick={handleAddReview}
          >
            Submit Review
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
