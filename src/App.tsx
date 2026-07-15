import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Auth
import { LoginPage } from './pages/auth/LoginPage';

// Student
import { StudentDashboard } from './pages/student/Dashboard';
import { FindTutors } from './pages/student/FindTutors';
import { TutorDetail } from './pages/student/TutorDetail';
import { StudentSessions } from './pages/student/Sessions';
import { StudentSessionRoom } from './pages/student/SessionRoom';
import { StudentAssignments } from './pages/student/Assignments';
import { StudentPayments } from './pages/student/Payments';
import { StudentMessages } from './pages/student/Messages';
import { StudentProgress } from './pages/student/Progress';
import { StudentReviews } from './pages/student/Reviews';

// Tutor
import { TutorDashboard } from './pages/tutor/Dashboard';
import { TutorSchedule } from './pages/tutor/Schedule';
import { TutorStudents } from './pages/tutor/Students';
import { TutorSessionRoom } from './pages/tutor/SessionRoom';
import { TutorEarnings } from './pages/tutor/Earnings';
import { TutorAssignments } from './pages/tutor/Assignments';
import { TutorMessages } from './pages/tutor/Messages';
import { TutorProfile } from './pages/tutor/Profile';

// Parent
import { ParentDashboard } from './pages/parent/Dashboard';
import { ParentChildren } from './pages/parent/Children';
import { ParentProgress } from './pages/parent/Progress';

// Admin
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminUsers } from './pages/admin/Users';
import { AdminTutors } from './pages/admin/Tutors';
import { AdminSessions } from './pages/admin/Sessions';
import { AdminPayments } from './pages/admin/Payments';
import { AdminSettings } from './pages/admin/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppLayout />}>
            {/* Student */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/find-tutors" element={<FindTutors />} />
            <Route path="/student/tutors/:id" element={<TutorDetail />} />
            <Route path="/student/sessions" element={<StudentSessions />} />
            <Route path="/student/sessions/:id/live" element={<StudentSessionRoom />} />
            <Route path="/student/assignments" element={<StudentAssignments />} />
            <Route path="/student/payments" element={<StudentPayments />} />
            <Route path="/student/messages" element={<StudentMessages />} />
            <Route path="/student/progress" element={<StudentProgress />} />
            <Route path="/student/reviews" element={<StudentReviews />} />
            {/* Tutor */}
            <Route path="/tutor/dashboard" element={<TutorDashboard />} />
            <Route path="/tutor/schedule" element={<TutorSchedule />} />
            <Route path="/tutor/students" element={<TutorStudents />} />
            <Route path="/tutor/sessions/:id/live" element={<TutorSessionRoom />} />
            <Route path="/tutor/earnings" element={<TutorEarnings />} />
            <Route path="/tutor/assignments" element={<TutorAssignments />} />
            <Route path="/tutor/messages" element={<TutorMessages />} />
            <Route path="/tutor/profile" element={<TutorProfile />} />
            {/* Parent */}
            <Route path="/parent/dashboard" element={<ParentDashboard />} />
            <Route path="/parent/children" element={<ParentChildren />} />
            <Route path="/parent/progress" element={<ParentProgress />} />
            {/* Admin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/tutors" element={<AdminTutors />} />
            <Route path="/admin/sessions" element={<AdminSessions />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
