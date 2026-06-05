import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { API_BASE } from '../../utils.js';
import './MessagesPage.css';

function getUserId(value) {
  return value && typeof value === 'object' ? value._id : value;
}

function getUserLabel(user) {
  if (!user) return 'Unknown user';
  return user.fullName || user.email || 'Unknown user';
}

function getUserEmail(user) {
  if (!user || typeof user !== 'object') return '';
  return user.email || '';
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [selectedThreadKey, setSelectedThreadKey] = useState('');
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch (err) {
      return null;
    }
  }, []);
  const currentUserId = currentUser?.id || currentUser?._id || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setFetchError('');

    fetch(`${API_BASE}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || data.message || 'Failed to load messages');
        }
        return data;
      })
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setFetchError(err.message || 'Failed to load messages');
        setLoading(false);
      });
  }, [navigate]);

  const threads = useMemo(() => {
    const grouped = new Map();

    messages.forEach((message) => {
      const senderId = getUserId(message.sender);
      const receiverId = getUserId(message.receiver);
      if (!currentUserId || (senderId !== currentUserId && receiverId !== currentUserId)) return;

      const otherUser = senderId === currentUserId ? message.receiver : message.sender;
      const conversationListingId = message.listingId || 'general';
      const threadKey = `${conversationListingId}:${getUserId(otherUser) || 'unknown'}`;
      const existing = grouped.get(threadKey) || {
        key: threadKey,
        listingId: conversationListingId,
        listingTitle: message.listingTitle || 'Conversation',
        otherUserId: getUserId(otherUser) || '',
        otherUser,
        messages: [],
      };

      existing.messages.push(message);
      existing.listingTitle = message.listingTitle || existing.listingTitle;
      existing.otherUser = otherUser || existing.otherUser;
      existing.otherUserId = getUserId(otherUser) || existing.otherUserId;
      grouped.set(threadKey, existing);
    });

    return Array.from(grouped.values())
      .map((thread) => {
        const sortedMessages = [...thread.messages].sort(
          (a, b) => new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp)
        );
        const lastMessage = sortedMessages[sortedMessages.length - 1];

        return {
          ...thread,
          messages: sortedMessages,
          lastMessage,
          lastTime: lastMessage?.createdAt || lastMessage?.timestamp || '',
          title: thread.listingTitle || `Conversation with ${getUserLabel(thread.otherUser)}`,
          preview: lastMessage?.content || '',
        };
      })
      .sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));
  }, [messages, currentUserId]);

  useEffect(() => {
    if (!selectedThreadKey && threads.length) {
      setSelectedThreadKey(threads[0].key);
    }
  }, [threads, selectedThreadKey]);

  const selectedThread = threads.find((thread) => thread.key === selectedThreadKey) || null;
  const selectedMessages = selectedThread?.messages || [];

  const handleReply = () => {
    if (!replyText.trim() || !selectedThread) return;

    const token = localStorage.getItem('token');
    if (!token || !selectedThread.otherUserId) return;

    fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        receiver: selectedThread.otherUserId,
        content: replyText,
        listingId: selectedThread.listingId,
        listingTitle: selectedThread.listingTitle,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || data.message || 'Unable to send message');
        }
        return data;
      })
      .then((savedMessage) => {
        setMessages((current) => [savedMessage, ...current]);
        setReplyText('');
      })
      .catch(() => {
        setFetchError('Unable to send reply. Please try again.');
      });
  };

  return (
    <div className="messages-page">
      <Navbar />
      <main className="messages-main">
        <aside className="threads-list">
          <h3>Conversations</h3>
          {loading && <p>Loading conversations...</p>}
          {!loading && threads.length === 0 && <p>No messages yet.</p>}
          {fetchError && <p role="alert" className="messages-error">{fetchError}</p>}
          <ul>
            {threads.map((thread) => (
              <li
                key={thread.key}
                className={thread.key === selectedThreadKey ? 'active' : ''}
                onClick={() => setSelectedThreadKey(thread.key)}
              >
                <strong>{thread.title}</strong>
                <div className="preview">{thread.preview}</div>
              </li>
            ))}
          </ul>
        </aside>

        <section className="conversation">
          <h3>Conversation</h3>
          {!selectedThread && !loading && <p>Select a conversation to view messages.</p>}

          {selectedThread && (
            <div className="messages-log">
              {selectedMessages.map((message) => {
                const senderId = getUserId(message.sender);
                const isMine = senderId === currentUserId;
                const senderName = getUserLabel(message.sender);
                const senderEmail = getUserEmail(message.sender);
                const senderLabel = senderEmail ? `${senderName} (${senderEmail})` : senderName;

                return (
                  <div key={message._id || message.id} className={isMine ? 'msg user' : 'msg agent'}>
                    <div className="msg-meta">{senderLabel} — {new Date(message.createdAt || message.timestamp).toLocaleString()}</div>
                    <div className="msg-content">{message.content}</div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedThread && (
            <div className="reply-box">
              <textarea
                placeholder="Write a message..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button onClick={handleReply}>Send</button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}