import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatCurrency, cn } from '../../lib/utils';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input, Select } from '../../components/ui/input';
import { Avatar } from '../../components/ui/avatar';
import { Tabs } from '../../components/ui/tabs';
import { StarRating, EmptyState } from '../../components/shared/shared';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { isTutorAvailableAt } from '../../data/availability';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]; // 8 AM – 7 PM (display as 1-hour slots)
const DAY_NAMES_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const tutorColors: Record<string, string> = {
  'tutor-1': 'bg-blue-500',
  'tutor-2': 'bg-purple-500',
  'tutor-3': 'bg-teal-500',
  'tutor-4': 'bg-green-600',
  'tutor-5': 'bg-pink-500',
  'tutor-6': 'bg-orange-500',
  'tutor-7': 'bg-indigo-500',
  'tutor-8': 'bg-amber-600',
};

function formatHour(h: number): string {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour} ${ampm}`;
}

export function FindTutors() {
  const navigate = useNavigate();
  const { tutors, subjects } = useApp();

  // --- Tab state ---
  const [activeTab, setActiveTab] = useState('subject');

  // --- Subject tab state ---
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');

  // --- Schedule tab state ---
  const [scheduleSubject, setScheduleSubject] = useState('math');

  const subjectOptions = [
    { value: 'all', label: 'All Subjects' },
    ...subjects.map((s) => ({ value: s.id, label: s.name })),
  ];

  const subjectOptionsNoAll = subjects.map((s) => ({ value: s.id, label: s.name }));

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      const matchesSearch = search === '' ||
        tutor.name.toLowerCase().includes(search.toLowerCase()) ||
        tutor.bio?.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = subjectFilter === 'all' ||
        tutor.subjects?.includes(subjectFilter);
      return matchesSearch && matchesSubject;
    });
  }, [tutors, search, subjectFilter]);

  // Build calendar data: day × hour → list of available tutors for scheduleSubject
  const calendarData = useMemo(() => {
    if (!scheduleSubject) return null;
    const grid: { day: number; hour: number; tutors: (typeof tutors)[0][] }[] = [];
    for (let day = 0; day < 5; day++) {
      for (let hour = 8; hour < 20; hour++) {
        const available = tutors.filter(
          (t) =>
            t.subjects?.includes(scheduleSubject) &&
            isTutorAvailableAt(t.id, day, hour)
        );
        if (available.length > 0) {
          grid.push({ day, hour, tutors: available });
        }
      }
    }
    return grid;
  }, [tutors, scheduleSubject]);

  // Group calendar data by day and hour for quick lookup
  const calendarLookup = useMemo(() => {
    if (!calendarData) return {};
    const lookup: Record<string, (typeof tutors)[0][]> = {};
    calendarData.forEach(({ day, hour, tutors: tuts }) => {
      lookup[`${day}-${hour}`] = tuts;
    });
    return lookup;
  }, [calendarData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Tutors</h1>
        <p className="text-gray-500 mt-1">Discover the perfect tutor for your learning journey.</p>
      </div>

      <Tabs
        tabs={[
          { id: 'subject', label: 'Browse by Subject' },
          { id: 'schedule', label: 'Browse by Schedule' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* ===== TAB 1: Browse by Subject ===== */}
      {activeTab === 'subject' && (
        <>
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-48 flex-shrink-0">
                  <Select
                    options={subjectOptions}
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                  />
                </div>
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search tutors by name or bio..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {filteredTutors.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No tutors found"
              description="Try adjusting your search or filter criteria."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTutors.map((tutor) => (
                <Card key={tutor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <Avatar name={tutor.name} size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                              <MapPin size={12} />
                              <span>Online</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-lg text-primary-700">{formatCurrency(tutor.hourlyRate || 0)}</p>
                            <p className="text-xs text-gray-500">per hour</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {tutor.rating && <StarRating rating={tutor.rating} size="sm" />}
                          {tutor.reviewCount && (
                            <span className="text-xs text-gray-500">({tutor.reviewCount} reviews)</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tutor.subjects?.map((subjId) => {
                            const subj = subjects.find((s) => s.id === subjId);
                            return (
                              <Badge key={subjId} variant="info" className="text-xs">
                                {subj?.name || subjId}
                              </Badge>
                            );
                          })}
                        </div>
                        {tutor.bio && (
                          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                            {tutor.bio.length > 100 ? tutor.bio.slice(0, 100) + '...' : tutor.bio}
                          </p>
                        )}
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/student/tutors/${tutor.id}`)}
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* ===== TAB 2: Browse by Schedule ===== */}
      {activeTab === 'schedule' && (
        <>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 flex-shrink-0">Select a subject:</label>
                <div className="w-56">
                  <Select
                    options={[{ value: '', label: '— Choose subject —' }, ...subjectOptionsNoAll]}
                    value={scheduleSubject}
                    onChange={(e) => setScheduleSubject(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {!scheduleSubject ? (
            <EmptyState
              icon="📅"
              title="Pick a subject to see availability"
              description="Select a subject above to view which tutors are available throughout the week."
            />
          ) : calendarData && calendarData.length === 0 ? (
            <EmptyState
              icon="📭"
              title="No availability found"
              description={`No tutors are currently available for ${subjects.find(s => s.id === scheduleSubject)?.name}. Try another subject.`}
            />
          ) : (
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 w-20">Time</th>
                      {DAYS.map((day, i) => (
                        <th key={day} className="px-2 py-3 text-center text-xs font-medium text-gray-500">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HOURS.map((hour) => (
                      <tr key={hour} className="border-b border-gray-100 last:border-0">
                        <td className="px-3 py-2.5 text-xs text-gray-500 font-medium align-top">
                          {formatHour(hour)}
                        </td>
                        {DAYS.map((_, dayIdx) => {
                          const slotTutors = calendarLookup[`${dayIdx}-${hour}`] || [];
                          const visible = slotTutors.slice(0, 3);
                          const extra = slotTutors.length - 3;

                          return (
                            <td key={dayIdx} className="px-1 py-1.5 align-top min-h-[40px]">
                              {visible.map((tutor, idx) => (
                                <button
                                  key={tutor.id}
                                  onClick={() => navigate(`/student/tutors/${tutor.id}`)}
                                  className={cn(
                                    'w-full text-left px-2 py-1 rounded text-xs font-medium transition-all mb-0.5 flex items-center gap-1.5',
                                    tutorColors[tutor.id] || 'bg-gray-400',
                                    'text-white hover:ring-2 hover:ring-offset-1 hover:ring-gray-400'
                                  )}
                                  title={`${tutor.name} — ${tutor.hourlyRate ? formatCurrency(tutor.hourlyRate) + '/hr' : ''}`}
                                >
                                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                    {tutor.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                  <span className="truncate">{tutor.name.split(' ').slice(-1)[0]}</span>
                                </button>
                              ))}
                              {extra > 0 && (
                                <div className="text-[10px] text-gray-400 text-center py-0.5">
                                  +{extra} more
                                </div>
                              )}
                              {slotTutors.length === 0 && (
                                <div className="h-7" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
