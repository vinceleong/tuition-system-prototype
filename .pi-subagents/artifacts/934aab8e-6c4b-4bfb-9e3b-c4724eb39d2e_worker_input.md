# Task for worker

[Read from: /Users/admin/Documents/code-repo/tuition-system/context.md, /Users/admin/Documents/code-repo/tuition-system/plan.md]

You are building pages for a React online tuition system prototype. Write all 3 PARENT pages and 6 ADMIN pages as TSX files.

## PROJECT STRUCTURE (already built)
- `src/data/` - mock data: users (User with id, name, email, role, avatar, subjects, grade, bio, hourlyRate, rating, reviewCount, joinedAt), subjects (Subject with id, name, icon, topics[]), sessions (Session with id, tutorId, studentId, subjectId, topic, date, startTime, endTime, status, notes), payments (Payment with id, userId, tutorId, sessionId, amount, type, status, date, description), messages, assignments (Assignment with id, tutorId, studentId, subjectId, title, description, dueDate, status, grade, submittedAt, feedback), reviews (Review with id, tutorId, studentId, sessionId, rating, text, date)
- `src/context/AppContext.tsx` - useApp() returns: { currentRole, currentUserId, currentUser, users, tutors, students, subjects, sessions, payments, assignments, reviews, getSessions(), getPayments(), getAssignments(), getTutorEarnings(), getWalletBalance(), getReviewsForTutor(id), getReviewsForStudent(id), getConversationWith(otherId), getConversationPartners(), updateSessionStatus, addPayment, submitAssignment, gradeAssignment, addReview, sendMessage }
- `src/lib/utils.ts` - cn(), formatCurrency(n), formatDate(dateStr), getInitials(name)
- `src/components/ui/*` - Button, Card/CardHeader/CardContent, Badge (variant: default|success|warning|danger|info), Input/Textarea/Select, Avatar, Dialog, Tabs, ProgressBar
- `src/components/shared/shared.tsx` - StarRating, StatCard, BarChart, EmptyState, Separator
- icons: use lucide-react (Calendar, Clock, Users, DollarSign, TrendingUp, BookOpen, FileText, ClipboardList, Bell, GraduationCap, Search, Filter, Settings, Shield, Ban, Check, X, Eye, Edit, Plus, Star, BarChart3, CreditCard)

## PARENT PAGES

### 1. /Users/admin/Documents/code-repo/tuition-system/src/pages/parent/Dashboard.tsx
Parent dashboard showing overview of all linked children:
- Welcome, {parent name}
- For each student (use all students from data), show a child card with: Avatar, name, grade
- Per-child stat summary: Sessions this month, Assignments pending, Average grade
- Total spending this month across all children (formatCurrency)
- Upcoming sessions for all children combined, showing which child + tutor + subject + time

### 2. /Users/admin/Documents/code-repo/tuition-system/src/pages/parent/Children.tsx
Detailed child management:
- Tabs for each child (use student names)
- Active child's: profile info, list of tutors they work with
- Recent sessions list
- Payment history for this child
- Session booking interface mock (view tutor, request session)

### 3. /Users/admin/Documents/code-repo/tuition-system/src/pages/parent/Progress.tsx
Learning progress across children:
- For each child: BarChart showing grades by subject
- Overall attendance: sessions attended vs booked (progress bar)
- Assignment completion rate
- Tutor feedback summary (aggregate from completed sessions with notes)

## ADMIN PAGES

### 4. /Users/admin/Documents/code-repo/tuition-system/src/pages/admin/Dashboard.tsx
Admin overview dashboard:
- 6 stat cards: Total Users, Total Tutors, Active Sessions (count of upcoming + live), Revenue This Month, New Signups This Month, Pending Tutor Approvals
- BarChart: Revenue by month (last 6 months)
- BarChart: Sessions by subject
- Recent activity feed: latest payments, new user signups, session completions
- Quick actions: "Approve Tutors", "View Reports"

### 5. /Users/admin/Documents/code-repo/tuition-system/src/pages/admin/Users.tsx
User management:
- Tabs: All | Students | Parents
- Searchable table: Name, Email, Role, Joined Date, Status (active/suspended badge)
- Actions per row: View (Dialog with full profile), Suspend/Activate (toggle button)
- Stats at top: total users, active this month

### 6. /Users/admin/Documents/code-repo/tuition-system/src/pages/admin/Tutors.tsx
Tutor management:
- Tabs: Active | Pending Approval
- Pending: tutors needing approval with Apply/Reject buttons (visual only)
- Active: table with Name, Subjects, Rating, Sessions taught, Earnings, Status
- Click tutor row to see detail Dialog: full profile, reviews, session history, earnings

### 7. /Users/admin/Documents/code-repo/tuition-system/src/pages/admin/Sessions.tsx
Platform-wide session monitoring:
- Tabs: Live Now | Upcoming | Completed | Cancelled
- Each tab shows session table: Tutor, Student, Subject, Date, Time, Status badge
- Live sessions: "Monitor" button (links to session room view - just visual)
- Stats: total sessions today, completion rate, cancellation rate

### 8. /Users/admin/Documents/code-repo/tuition-system/src/pages/admin/Payments.tsx
Financial overview:
- Revenue stats: Today, This Week, This Month, Total (all formatCurrency)
- Transaction table: ID, From (user name), To (tutor name), Amount, Type badge, Status badge, Date
- Refund handling: pending refunds with Approve/Reject buttons (visual only)
- Filter by date range (visual inputs)

### 9. /Users/admin/Documents/code-repo/tuition-system/src/pages/admin/Settings.tsx
Platform settings (visual only - no persistence):
- General: Platform name Input, Support email Input, Commission rate Input with %
- Features: toggle switches for Reviews, Messaging, Video Recording, Whiteboard
- Payment: Minimum payout threshold Input, Payment methods checkboxes (Credit Card, PayPal, Bank Transfer)
- "Save Settings" button with toast/alert feedback

## RULES
- Import useApp from '../../context/AppContext'
- Import getUserById from '../../data/users' when needed
- Use lucide-react for ALL icons
- Every page must be a named export function
- Use Tailwind CSS classes only
- Use Card/CardHeader/CardContent pattern for sections
- Make pages visually rich: proper spacing, colors, hover states, transitions
- Handle empty states with EmptyState component
- All mock data comes from useApp()
- Write complete, working TSX files - no placeholders or TODO comments

---
Update progress at: /Users/admin/Documents/code-repo/tuition-system/.pi-subagents/artifacts/progress/934aab8e-6c4b-4bfb-9e3b-c4724eb39d2e/progress.md

## Acceptance Contract
Acceptance level: reviewed
Completion is not accepted from prose alone. End with a structured acceptance report.

Criteria:
- criterion-1: Implement the requested change without widening scope
- criterion-2: Return evidence sufficient for an independent acceptance review

Required evidence: changed-files, tests-added, commands-run, validation-output, residual-risks, no-staged-files

Review gate: required by reviewer.

Finish with a fenced JSON block tagged `acceptance-report` in this shape:
Use empty arrays when no items apply; array fields contain strings unless object entries are shown.
```acceptance-report
{
  "criteriaSatisfied": [
    {
      "id": "criterion-1",
      "status": "satisfied",
      "evidence": "specific proof"
    }
  ],
  "changedFiles": [
    "src/file.ts"
  ],
  "testsAddedOrUpdated": [
    "test/file.test.ts"
  ],
  "commandsRun": [
    {
      "command": "command",
      "result": "passed",
      "summary": "short result"
    }
  ],
  "validationOutput": [
    "validation output or concise summary"
  ],
  "residualRisks": [
    "none"
  ],
  "noStagedFiles": true,
  "diffSummary": "short description of the diff",
  "reviewFindings": [
    "blocker: file.ts:12 - issue found, or no blockers"
  ],
  "manualNotes": "anything else the parent should know"
}
```