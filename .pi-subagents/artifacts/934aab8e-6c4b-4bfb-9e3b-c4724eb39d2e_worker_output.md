Now I have a thorough understanding of the codebase. Let me present my implementation plan before writing code.

## Implementation Plan

### Parent Pages (3 files)

**1. `Dashboard.tsx`**
- `useApp()` pulls: `currentUser`, `students`, `sessions`, `payments`, `assignments`
- Layout: Welcome banner → Total spending card → per-child cards in a grid (each: Avatar, name, grade, stat summary of 3 metrics: sessions this month, assignments pending, average grade) → "Upcoming Sessions" card (table-like list: child, tutor, subject, date/time)

**2. `Children.tsx`**
- `useApp()` pulls: `students`, `sessions`, `payments`, `tutors`, `subjects`, `getUserById`
- Tabs: one per student (by name)
- Active tab: child profile card (Avatar, name, grade, email, joined date); tutor list (unique tutorIds from sessions → resolved); recent sessions table (last 5, with status badge); payment history table; "Book a Session" mock section (Select tutor, Select subject, Select topic, request button — visual only)

**3. `Progress.tsx`**
- `useApp()` pulls: `students`, `sessions`, `assignments`, `reviews`, `subjects`
- Per-child expandable sections (or all visible): BarChart of grades by subject (from graded assignments), attendance progress bar (completed / total sessions), assignment completion rate bar, tutor feedback cards (from sessions with notes)

### Admin Pages (6 files)

**4. `Dashboard.tsx`**
- `useApp()` pulls: `users`, `tutors`, `sessions`, `payments`
- 6 stat cards: Total Users, Total Tutors, Active Sessions (upcoming+live count), Revenue This Month, New Signups This Month (joined this month), Pending Tutor Approvals (static 3ish)
- Two BarCharts: Revenue by month (last 6 months, computed from payments), Sessions by subject (count per subjectId)
- Recent activity feed (latest 5 payments + any interesting events)
- Quick actions row: "Approve Tutors", "View Reports" buttons

**5. `Users.tsx`**
- `useApp()` pulls: `users`
- Tabs: All | Students | Parents
- Search input filters by name/email
- Table: Name (Avatar+name), Email, Role badge, Joined Date, Status (all "active" for now)
- View button → Dialog (full profile)
- Suspend/Activate toggle button (visual state only)
- Top stats: total users, active this month

**6. `Tutors.tsx`**
- `useApp()` pulls: `tutors`, `sessions`, `payments`, `reviews`, `getReviewsForTutor`
- Tabs: Active | Pending Approval (3 mock pending tutors)
- Pending tab: tutor cards with Apply/Reject buttons
- Active tab: table (Name, Subjects badges, Rating stars, Sessions count (computed), Earnings (computed), Status badge)
- Click row → Dialog: full profile, reviews list, session history, earnings summary

**7. `Sessions.tsx`**
- `useApp()` pulls: `sessions`, `tutors`, `students`, `subjects`, `getUserById`
- Tabs: Live Now | Upcoming | Completed | Cancelled
- Each tab: table (Tutor, Student, Subject, Date, Time, Status badge)
- Live tab: "Monitor" button per session (visual)
- Top stats: total today, completion rate, cancellation rate

**8. `Payments.tsx`**
- `useApp()` pulls: `payments`, `users`, `getUserById`
- Revenue stat cards: Today, This Week, This Month, Total
- Transaction table: ID, From, To, Amount, Type badge, Status badge, Date
- Refund handling section: pending refunds with Approve/Reject buttons
- Date range filter inputs (visual)

**9. `Settings.tsx`**
- Pure visual form (no useApp needed beyond perhaps currentUser)
- Three Card sections: General (platform name input, support email, commission rate), Features (4 toggle switches), Payment (minimum payout, checkboxes)
- Save button → `alert('Settings saved!')`

Shall I proceed with implementation?