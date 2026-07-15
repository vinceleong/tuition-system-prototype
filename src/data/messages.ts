export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  userId: string;
  messages: Message[];
}

function ts(hoursAgo: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

export const conversations: Conversation[] = [
  {
    userId: 'tutor-1',
    messages: [
      { id: 'msg-1', senderId: 'student-1', receiverId: 'tutor-1', text: 'Hi Dr. Chen! I had a question about the quadratic equation homework.', timestamp: ts(2) },
      { id: 'msg-2', senderId: 'tutor-1', receiverId: 'student-1', text: 'Of course, Emma! What specifically are you struggling with?', timestamp: ts(1.9) },
      { id: 'msg-3', senderId: 'student-1', receiverId: 'tutor-1', text: 'The factoring method on problem 5. I keep getting the wrong signs.', timestamp: ts(1.8) },
      { id: 'msg-4', senderId: 'tutor-1', receiverId: 'student-1', text: 'Let me send you a quick video explanation. Check your inbox in 5 minutes!', timestamp: ts(1.7) },
      { id: 'msg-5', senderId: 'student-1', receiverId: 'tutor-1', text: 'Thank you so much! I\'ll review it before our next session.', timestamp: ts(1) },
    ],
  },
  {
    userId: 'tutor-4',
    messages: [
      { id: 'msg-6', senderId: 'tutor-4', receiverId: 'student-2', text: 'Liam, great work on the JavaScript exercises! Ready to move on to DOM manipulation?', timestamp: ts(5) },
      { id: 'msg-7', senderId: 'student-2', receiverId: 'tutor-4', text: 'Yes! I\'ve been practicing on my own too. I made a small game!', timestamp: ts(4.5) },
      { id: 'msg-8', senderId: 'tutor-4', receiverId: 'student-2', text: 'That\'s amazing! Share the code with me and we\'ll review it next session.', timestamp: ts(4) },
    ],
  },
  {
    userId: 'tutor-5',
    messages: [
      { id: 'msg-9', senderId: 'student-1', receiverId: 'tutor-5', text: 'Hi Emily, could we focus on thesis statements next session?', timestamp: ts(24) },
      { id: 'msg-10', senderId: 'tutor-5', receiverId: 'student-1', text: 'Absolutely! Bring your essay draft and we\'ll workshop it together.', timestamp: ts(23) },
    ],
  },
];

export function getConversationWithUser(currentUserId: string, otherUserId: string): Message[] {
  const convo = conversations.find(
    (c) => c.userId === otherUserId || c.messages.some((m) => m.senderId === otherUserId || m.receiverId === otherUserId)
  );
  if (!convo) return [];
  return convo.messages.filter((m) =>
    (m.senderId === currentUserId && m.receiverId === otherUserId) ||
    (m.senderId === otherUserId && m.receiverId === currentUserId)
  );
}

export function getConversationPartners(userId: string): string[] {
  const partners = new Set<string>();
  conversations.forEach((c) => {
    c.messages.forEach((m) => {
      if (m.senderId === userId) partners.add(m.receiverId);
      if (m.receiverId === userId) partners.add(m.senderId);
    });
  });
  return Array.from(partners);
}
