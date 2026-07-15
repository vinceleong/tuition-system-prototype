import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getUserById } from '../../data/users';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/input';
import { Avatar } from '../../components/ui/avatar';
import { Mic, Camera, Monitor, PenTool, PhoneOff, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

export function TutorSessionRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sessions, updateSessionStatus } = useApp();
  const session = sessions.find(s => s.id === id);
  const [elapsed, setElapsed] = useState(0);
  const [showWhiteboard, setShowWhiteboard] = useState(true);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [messages, setMessages] = useState([
    { from: 'student', text: 'Hi! I\'m ready for the session.', time: '0:02' },
    { from: 'tutor', text: 'Great! Let\'s get started with today\'s topic.', time: '0:05' },
    { from: 'student', text: 'I reviewed the homework you sent.', time: '0:12' },
  ]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!session) return <p className="text-center py-10 text-gray-500">Session not found</p>;
  const student = getUserById(session.studentId);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  const handleEnd = () => {
    updateSessionStatus(session.id, 'completed');
    navigate('/tutor/schedule');
  };

  const sendMsg = () => {
    if (!newMsg.trim()) return;
    setMessages(prev => [...prev, { from: 'tutor', text: newMsg, time: `${mins}:${String(secs).padStart(2, '0')}` }]);
    setNewMsg('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-2 rounded-t-xl">
        <div>
          <p className="font-medium">{student?.name} — {session.topic}</p>
          <p className="text-xs text-gray-400">{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')} elapsed</p>
        </div>
        <Button variant="danger" size="sm" onClick={() => setShowEndDialog(true)}>
          <PhoneOff size={16} className="mr-1" /> End Session
        </Button>
      </div>

      <div className="flex-1 flex gap-0">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-gray-800 flex items-center justify-center relative">
            <div className="text-center">
              <div className="flex gap-8 mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center">
                  <Avatar name={student?.name || 'S'} size="lg" />
                </div>
              </div>
              <p className="text-gray-400 text-sm">Video Call Active</p>
            </div>
            {showWhiteboard && (
              <div className="absolute inset-0 bg-white m-4 rounded-lg flex items-center justify-center opacity-90">
                <div className="text-center">
                  <PenTool size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Whiteboard — draw, type, and collaborate</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-100 font-medium text-sm">Chat</div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'tutor' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${msg.from === 'tutor' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  {msg.text}
                  <p className={`text-[10px] mt-0.5 ${msg.from === 'tutor' ? 'text-primary-200' : 'text-gray-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg()}
              placeholder="Type a message..."
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <button onClick={sendMsg} className="text-primary-600 hover:text-primary-700">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 bg-gray-100 px-4 py-2 rounded-b-xl">
        {[
          { icon: Mic, label: 'Mic', active: true },
          { icon: Camera, label: 'Camera', active: true },
          { icon: Monitor, label: 'Screen', active: false },
          { icon: PenTool, label: 'Board', active: showWhiteboard, onClick: () => setShowWhiteboard(!showWhiteboard) },
        ].map(ctrl => (
          <button
            key={ctrl.label}
            onClick={ctrl.onClick}
            className={`p-2.5 rounded-full transition ${ctrl.active ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:bg-gray-200'}`}
            title={ctrl.label}
          >
            <ctrl.icon size={20} />
          </button>
        ))}
      </div>

      <Dialog open={showEndDialog} onClose={() => setShowEndDialog(false)} title="End Session">
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Add session notes before ending.</p>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Session notes..." rows={3} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowEndDialog(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleEnd}>End Session</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
