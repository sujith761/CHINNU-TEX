import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

export default function MessagesPage() {
  const location = useLocation();
  const { highlightId } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');
  const [highlightedMessageId, setHighlightedMessageId] = useState(highlightId || null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (highlightId && messages.length > 0) {
      const element = document.getElementById(`msg-${highlightId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        setHighlightedMessageId(highlightId);
      }
    }
  }, [highlightId, messages]);

  useEffect(() => {
    if (location.state?.highlightId !== highlightedMessageId) {
      setHighlightedMessageId(location.state?.highlightId || null);
    }
  }, [location.state]);

  const loadMessages = async () => {
    try {
      const res = await api.get('/admin/messages');
      setMessages(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load messages');
    }
  };

  const handleReply = async (id) => {
    try {
      await api.post(`/admin/messages/${id}/reply`, { reply: replyText });
      setReplyingId(null);
      setReplyText('');
      loadMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reply');
    }
  };

  const toggleResolved = async (id, current) => {
    try {
      await api.patch(`/admin/messages/${id}`, { replied: !current });
      loadMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update message');
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/admin/messages/${id}`);
      loadMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete message');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/25 font-semibold">Support</p>
          <h1 className="text-4xl font-extrabold gradient-text">Customer Messages</h1>
          <p className="text-white/40">Reply faster with status badges and quick actions.</p>
        </header>

        {error && (
          <div className="glass-card border-neon-rose/30 bg-neon-rose/10 text-neon-rose px-4 py-3">{error}</div>
        )}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg._id} 
              id={`msg-${msg._id}`}
              className={`glass-card-hover p-6 transition-all ${
                highlightedMessageId === msg._id
                  ? 'bg-neon-amber/5 border-neon-amber/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                  : ''
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-lg text-white">{msg.name}</h3>
                  <p className="text-white/30 text-sm">{msg.email}</p>
                  {msg.phone && <p className="text-white/30 text-sm">{msg.phone}</p>}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${msg.replied ? 'bg-neon-emerald/10 text-neon-emerald border-neon-emerald/20' : 'bg-neon-amber/10 text-neon-amber border-neon-amber/20'}`}>
                  {msg.replied ? 'Replied' : 'New'}
                </span>
              </div>

              <p className="mt-4 text-white/70 leading-relaxed">{msg.message}</p>

              {msg.reply && (
                <div className="mt-4 p-4 bg-neon-violet/5 border border-neon-violet/15 rounded-xl">
                  <p className="text-sm text-white/60"><strong className="text-neon-violet">Your Reply:</strong> {msg.reply}</p>
                </div>
              )}

              <div className="mt-4 flex gap-2 flex-wrap">
                {msg.replied ? (
                  <button
                    onClick={() => toggleResolved(msg._id, msg.replied)}
                    className="px-5 py-2 rounded-lg border border-white/[0.1] text-white/60 hover:bg-white/[0.05] transition-colors"
                  >
                    Mark as New
                  </button>
                ) : (
                  replyingId === msg._id ? (
                    <div className="w-full space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        rows={3}
                        className="glass-input w-full px-4 py-3"
                      />
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleReply(msg._id)}
                          className="btn-glow px-5 py-2"
                        >
                          Send Reply
                        </button>
                        <button
                          onClick={() => setReplyingId(null)}
                          className="px-5 py-2 rounded-lg border border-white/[0.1] text-white/60 hover:bg-white/[0.05] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingId(msg._id)}
                      className="btn-glow px-5 py-2"
                    >
                      Reply
                    </button>
                  )
                )}

                <button
                  onClick={() => deleteMessage(msg._id)}
                  className="px-5 py-2 rounded-lg bg-neon-rose/15 text-neon-rose border border-neon-rose/20 font-semibold hover:bg-neon-rose/25 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
