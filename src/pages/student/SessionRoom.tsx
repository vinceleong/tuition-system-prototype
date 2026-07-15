import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getUserById } from '../../data/users';
import { Avatar } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import {
  Mic, MicOff, Camera, CameraOff, Monitor, MonitorOff,
  Pencil, Send, Phone, Clock,
} from 'lucide-react';

export function StudentSessionRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sessions, currentUser, updateSessionStatus } = useApp();

  const session = sessions.find((s) => s.id === id);
  const tutor = session ? getUserById(session.tutorId) : null;

  const [elapsed, setElapsed] = useState(0);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const [message, setMessage] = useState('');

  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'Tutor', text: 'Welcome! Let\'s get started with today\'s topic.', time: 'Just now' },
    { id: '2', sender: 'You', text: 'Hi! I\'m ready. I reviewed the material from last session.', time: 'Just now' },
    { id: '3', sender: 'Tutor', text: 'Great! Let\'s dive into the main concepts.', time: 'Just now' },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}`, sender: 'You', text: message.trim(), time: 'Just now' },
    ]);
    setMessage('');
  };

  const handleEndSession = () => {
    if (session) {
      updateSessionStatus(session.id, 'completed');
    }
    navigate('/student/sessions');
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Session not found</h2>
        <p className="text-gray-500 mb-4">This session doesn't exist or has ended.</p>
        <Button onClick={() => navigate('/student/sessions')}>Back to Sessions</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] -m-6">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-sm">{session.topic}</h2>
          <span className="text-gray-400 text-xs">|</span>
          <span className="text-gray-400 text-xs">{tutor?.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-red-600 px-3 py-1 rounded-full text-xs font-mono">
            <Clock size={14} />
            {formatTime(elapsed)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Video + Whiteboard */}
        <div className="flex-1 lg:w-[60%] flex flex-col bg-gray-800">
          {/* Video Call Area */}
          <div className="flex-1 relative p-4 flex items-center justify-center">
            <div className="relative w-full max-w-2xl aspect-video bg-gray-700 rounded-xl flex items-center justify-center">
              {/* Tutor Video Simulacrum */}
              <div className="absolute bottom-4 right-4 w-32 aspect-video bg-gray-600 rounded-lg border-2 border-gray-500 flex items-center justify-center">
                <div className="text-center">
                  <Avatar name={currentUser.name} size="md" />
                  <p className="text-white text-xs mt-1">You</p>
                </div>
              </div>
              {/* Main Video (Tutor) */}
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-white">
                    {tutor?.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <p className="text-white font-medium mt-3">{tutor?.name}</p>
                <p className="text-gray-400 text-sm mt-1">Video Call</p>
              </div>
            </div>
          </div>

          {/* Whiteboard */}
          {whiteboardOpen && (
            <div className="h-48 bg-white m-4 rounded-xl border-2 border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <Pencil size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">Whiteboard</p>
                <p className="text-gray-400 text-sm">Draw, type, and collaborate</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Chat */}
        <div className="lg:w-[40%] bg-white border-l border-gray-200 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 font-semibold text-sm text-gray-900">
            Chat
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2 ${
                    msg.sender === 'You'
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}
                >
                  <p className="text-xs font-semibold mb-0.5 opacity-70">{msg.sender}</p>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-[10px] mt-1 opacity-60">{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Button size="sm" onClick={handleSendMessage}>
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-center gap-4">
        <button
          onClick={() => setMicOn(!micOn)}
          className={`p-3 rounded-full transition-colors ${micOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
          title={micOn ? 'Mute Mic' : 'Unmute Mic'}
        >
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <button
          onClick={() => setCameraOn(!cameraOn)}
          className={`p-3 rounded-full transition-colors ${cameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
          title={cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {cameraOn ? <Camera size={20} /> : <CameraOff size={20} />}
        </button>
        <button
          onClick={() => setScreenSharing(!screenSharing)}
          className={`p-3 rounded-full transition-colors ${screenSharing ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          title={screenSharing ? 'Stop Sharing' : 'Share Screen'}
        >
          {screenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
        </button>
        <button
          onClick={() => setWhiteboardOpen(!whiteboardOpen)}
          className={`p-3 rounded-full transition-colors ${whiteboardOpen ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          title="Toggle Whiteboard"
        >
          <Pencil size={20} />
        </button>
        <div className="w-px h-8 bg-gray-700 mx-2" />
        <button
          onClick={() => setShowEndDialog(true)}
          className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          title="End Session"
        >
          <Phone size={20} className="rotate-[135deg]" />
        </button>
      </div>

      {/* End Session Dialog */}
      <Dialog
        open={showEndDialog}
        onClose={() => setShowEndDialog(false)}
        title="End Session"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Are you sure you want to end this session? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowEndDialog(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleEndSession}>
              End Session
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
