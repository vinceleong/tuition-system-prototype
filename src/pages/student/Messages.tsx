import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getUserById } from '../../data/users';
import { Avatar } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { EmptyState } from '../../components/shared/shared';
import { Send, Search } from 'lucide-react';

export function StudentMessages() {
  const { currentUserId, getConversationPartners, getConversationWith, sendMessage } = useApp();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [localMessages, setLocalMessages] = useState<{ senderId: string; text: string; timestamp: string }[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const partners = getConversationPartners();

  useEffect(() => {
    if (selectedUserId) {
      const msgs = getConversationWith(selectedUserId);
      setLocalMessages(
        msgs.map((m) => ({
          senderId: m.senderId,
          text: m.text,
          timestamp: m.timestamp,
        }))
      );
    }
  }, [selectedUserId, getConversationWith]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  const selectedUser = selectedUserId ? getUserById(selectedUserId) : null;

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 24) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      }
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return ts;
    }
  };

  const handleSend = () => {
    if (!messageText.trim() || !selectedUserId) return;
    sendMessage(selectedUserId, messageText.trim());
    setLocalMessages((prev) => [
      ...prev,
      {
        senderId: currentUserId,
        text: messageText.trim(),
        timestamp: new Date().toISOString(),
      },
    ]);
    setMessageText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 mt-1">Chat with your tutors.</p>
      </div>

      <div className="flex h-[calc(100vh-260px)] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Conversation List */}
        <div className="w-80 border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {partners.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No conversations yet.
              </div>
            ) : (
              partners.map((partnerId) => {
                const user = getUserById(partnerId);
                const convoMsgs = getConversationWith(partnerId);
                const lastMsg = convoMsgs[convoMsgs.length - 1];
                return (
                  <button
                    key={partnerId}
                    onClick={() => setSelectedUserId(partnerId)}
                    className={`w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                      selectedUserId === partnerId ? 'bg-primary-50 border-l-2 border-l-primary-600' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={user?.name || 'User'} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {user?.name}
                        </p>
                        {lastMsg && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {lastMsg.text.length > 30
                              ? lastMsg.text.slice(0, 30) + '...'
                              : lastMsg.text}
                          </p>
                        )}
                      </div>
                      {lastMsg && (
                        <span className="text-[10px] text-gray-400 flex-shrink-0">
                          {formatTimestamp(lastMsg.timestamp)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!selectedUser ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon="💬"
                title="Select a conversation"
                description="Choose a conversation from the left to start chatting."
              />
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                <Avatar name={selectedUser.name} size="sm" />
                <div>
                  <p className="font-medium text-sm text-gray-900">{selectedUser.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{selectedUser.role}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {localMessages.map((msg, idx) => {
                  const isMine = msg.senderId === currentUserId;
                  return (
                    <div
                      key={idx}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-xl px-4 py-2 ${
                          isMine
                            ? 'bg-primary-600 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${isMine ? 'text-primary-200' : 'text-gray-400'}`}>
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Button size="sm" onClick={handleSend} disabled={!messageText.trim()}>
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
