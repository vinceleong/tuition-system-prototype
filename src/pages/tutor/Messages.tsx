import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent } from '../../components/ui/card';
import { Avatar } from '../../components/ui/avatar';
import { EmptyState } from '../../components/shared/shared';
import { Input } from '../../components/ui/input';
import { Send, Search, MessageSquare } from 'lucide-react';
import { getUserById } from '../../data/users';

export function TutorMessages() {
  const { getConversationWith, getConversationPartners, sessions, currentUser } = useApp();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [newMsg, setNewMsg] = useState('');
  const [messages, setMessages] = useState<{ from: string; text: string; time: string }[]>([]);

  const mySessions = sessions.filter(s => s.tutorId === currentUser.id);
  const studentIds = [...new Set(mySessions.map(s => s.studentId))];
  const partners = studentIds.map(id => getUserById(id)).filter(Boolean);

  const handleSelectChat = (studentId: string) => {
    setActiveChat(studentId);
    const conv = getConversationWith(studentId);
    setMessages(conv.map(m => ({
      from: m.senderId === currentUser.id ? 'me' : 'them',
      text: m.text,
      time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })));
  };

  const sendMsg = () => {
    if (!newMsg.trim() || !activeChat) return;
    setMessages(prev => [...prev, { from: 'me', text: newMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setNewMsg('');
  };

  return (
    <div className="flex gap-0 h-[calc(100vh-10rem)]">
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col rounded-l-xl">
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search messages..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {partners.map(p => {
            if (!p) return null;
            const lastMsg = getConversationWith(p.id)?.[getConversationWith(p.id).length - 1];
            return (
              <button
                key={p.id}
                onClick={() => handleSelectChat(p.id)}
                className={`w-full text-left p-3 flex items-center gap-3 hover:bg-gray-50 transition border-b border-gray-50 ${
                  activeChat === p.id ? 'bg-primary-50 border-l-2 border-l-primary-600' : ''
                }`}
              >
                <Avatar name={p.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500 truncate">{lastMsg?.text || 'No messages yet'}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50 rounded-r-xl">
        {activeChat ? (
          <>
            <div className="p-3 bg-white border-b border-gray-200">
              <p className="font-medium text-sm">{getUserById(activeChat)?.name}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-xl px-3 py-2 text-sm ${
                    msg.from === 'me' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-900'
                  }`}>
                    {msg.text}
                    <p className={`text-[10px] mt-0.5 ${msg.from === 'me' ? 'text-primary-200' : 'text-gray-400'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              {messages.length === 0 && <p className="text-center text-gray-400 text-sm py-10">Start a conversation</p>}
            </div>
            <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
              <input
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMsg()}
                placeholder="Type a message..."
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button onClick={sendMsg} className="text-primary-600 hover:text-primary-700 p-2">
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <EmptyState icon="💬" title="Select a conversation" description="Choose a student from the list to view messages." />
        )}
      </div>
    </div>
  );
}
