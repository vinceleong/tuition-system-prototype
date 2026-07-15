# Task for worker

[Read from: /Users/admin/Documents/code-repo/tuition-system/context.md, /Users/admin/Documents/code-repo/tuition-system/plan.md]

You are building pages for a React online tuition system prototype. Write all 10 STUDENT pages as TSX files.

## PROJECT STRUCTURE (already built)
- `src/data/` - mock data: users (User with id, name, email, role, avatar, subjects, grade, bio, hourlyRate, rating, reviewCount, joinedAt), subjects (Subject with id, name, icon, topics[]), sessions (Session with id, tutorId, studentId, subjectId, topic, date, startTime, endTime, status, notes), payments (Payment with id, userId, tutorId, sessionId, amount, type, status, date, description), messages (Message with id, senderId, receiverId, text, timestamp; Conversation with userId, messages[]), assignments (Assignment with id, tutorId, studentId, subjectId, title, description, dueDate, status, grade, submittedAt, feedback), reviews (Review with id, tutorId, studentId, sessionId, rating, text, date)
- `src/context/AppContext.tsx` - useApp() hook returning: { currentRole, currentUserId, currentUser, users, tutors, students, subjects, sessions, payments, assignments, reviews, getSessions(), getPayments(), getAssignments(), getTutorEarnings(), getWalletBalance(), getReviewsForTutor(id), getReviewsForStudent(id), getConversationWith(otherId), getConversationPartners(), setRole, setCurrentUserId, updateSessionStatus, addPayment, submitAssignment, gradeAssignment, addReview, sendMessage }
- `src/lib/utils.ts` - cn(), formatCurrency(n), formatDate(dateStr), getInitials(name)
- `src/components/ui/*` - Button (variant: primary|secondary|outline|ghost|danger, size: sm|md|lg), Card/CardHeader/CardContent, Badge (variant: default|success|warning|danger|info), Input/Textarea/Select, Avatar (name, size: sm|md|lg), Dialog (open, onClose, title, children), Tabs (tabs: {id,label,count?}[], activeTab, onChange), ProgressBar (value: number)
- `src/components/shared/shared.tsx` - StarRating(rating, size), StatCard(label, value, subtext, icon, trend), BarChart(data: {label, value, color?}[]), EmptyState(icon, title, description, action), Separator
- icons: lucide-react (Calendar, Clock, Video, Star, MessageSquare, CreditCard, Search, Filter, MapPin, Plus, Send, ArrowRight, Check, X, TrendingUp, BookOpen, FileText, Upload, Download, GraduationCap, Users, DollarSign, ClipboardList, Bell, Home, etc.)

## PAGES TO CREATE

### 1. /Users/admin/Documents/code-repo/tuition-system/src/pages/student/Dashboard.tsx
Student dashboard showing:
- Welcome back, {student name}
- 4 stat cards: Upcoming Sessions (count), Completed Sessions (count), Wallet Balance (formatCurrency), Average Grade (from graded assignments)
- "Upcoming Sessions" section: list next 3 upcoming sessions as cards showing tutor name (get from getUserById), subject, topic, date (formatDate), time, with "Join" button linking to /student/sessions/:id/live
- "Recent Assignments" section: list 3 assignments with title, due date, status badge

### 2. /Users/admin/Documents/code-repo/tuition-system/src/pages/student/FindTutors.tsx
Tutor discovery page:
- Search bar and subject filter dropdown
- Grid of tutor cards (2 columns on desktop): Avatar, name, subjects (as badges), rating (StarRating), hourly rate (formatCurrency), bio snippet (truncated 100 chars), "View Profile" button linking to /student/tutors/:id

### 3. /Users/admin/Documents/code-repo/tuition-system/src/pages/student/TutorDetail.tsx
Full tutor profile (use useParams for :id):
- Avatar (lg), name, subjects, rating + review count
- Bio full text
- Stats: hourly rate, total sessions, years teaching
- "Book a Session" button that opens a Dialog with: Select subject, Select topic, Date picker (simple text input), Time slot selector, Confirm button that adds a session and payment
- "Reviews" section: list all reviews for this tutor, each showing student name, star rating, text, date

### 4. /Users/admin/Documents/code-repo/tuition-system/src/pages/student/Sessions.tsx
- Tabs: Upcoming | Completed | Cancelled
- Each tab shows session cards: Tutor name + avatar, subject, topic, date (formatDate), time range, status badge
- Upcoming: "Join" button (if within 15 min of start) linking to /student/sessions/:id/live
- Completed: "Leave Review" button and tutor notes if present
- Cancelled: just display

### 5. /Users/admin/Documents/code-repo/tuition-system/src/pages/student/SessionRoom.tsx
Simulated live session room (useParams for :id):
- Top bar: session topic, timer showing elapsed time
- Main area: two panels side by side
  - Left (60%): "Video Call" placeholder - large gray area with tutor and student avatar simulacrum, "Virtual Whiteboard" placeholder area with text "Whiteboard — draw, type, and collaborate"
  - Right (40%): Chat panel with pre-seeded messages, message input at bottom
- Bottom bar: controls - Mic, Camera, Screen Share, Whiteboard toggle buttons (icon only, styled)
- "End Session" button that shows confirmation dialog, then navigates to /student/sessions

### 6. /Users/admin/Documents/code-repo/tuition-system/src/pages/student/Assignments.tsx
- Tabs: Pending | Submitted | Graded
- Pending: cards with title, tutor name, subject, due date, description, "Submit" button that opens Dialog with Textarea + "Submit" that calls submitAssignment
- Submitted: cards showing submittedAt date, "Awaiting Grade" badge
- Graded: cards showing grade (colored: A green, B blue, etc.), feedback text, tutor name

### 7. /Users/admin/Documents/code-repo/tuition-system/src/pages/student/Payments.tsx
- Wallet balance prominently at top (formatCurrency)
- "Top Up" button that opens Dialog: amount input, simulated payment (click Pay → success toast/alert → wallet balance updates via addPayment)
- Transaction history table/list: date, description, amount (with +/- prefix), type badge, status badge
- Total spent this month summary

### 8. /Users/admin/Documents/code-repo/tuition-system/src/pages/student/Messages.tsx
- Split layout: left side = conversation list (avatar + name + last message preview), right side = chat
- Chat shows messages with sender vs receiver alignment, timestamps
- Input box at bottom (send is visual only - calls sendMessage)
- If no conversation selected, show EmptyState "Select a conversation"

### 9. /Users/admin/Documents/code-repo/tuition-system/src/pages/student/Progress.tsx
- Overall grade trend (BarChart from graded assignments by subject)
- Session stats: total hours, sessions completed this month
- Subject breakdown: per subject show assignment grades as mini table/progress

### 10. /Users/admin/Documents/code-repo/tuition-system/src/pages/student/Reviews.tsx
- My Reviews tab: list reviews the student has written, with edit capability (just visual)
- All Reviews tab: filterable by subject/tutor, grid of review cards

## RULES
- Import useApp from '../../context/AppContext'
- Import getUserById from '../../data/users' when needed
- Use lucide-react for ALL icons (no emoji in JSX)
- Every page must be a named export function
- Use Tailwind CSS classes only (no custom CSS)
- Use the Card/CardHeader/CardContent pattern for sections
- Make pages visually rich: use proper spacing, colors, hover states, transitions
- Handle empty states gracefully with EmptyState component
- All mock data comes from useApp(), not from direct imports
- Write complete, working TSX files - no placeholders or TODO comments

---
Update progress at: /Users/admin/Documents/code-repo/tuition-system/.pi-subagents/artifacts/progress/9bd2080b-ff28-4468-be2a-2916dab31530/progress.md

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