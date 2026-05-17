import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './MessagesPage.css';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('messages') || '[]');
      setMessages(existing);
    } catch (e) {
      setMessages([]);
    }
  }, []);

  const threads = messages.reduce((acc, msg) => {
    const key = msg.listingId;
    acc[key] = acc[key] || [];
    acc[key].push(msg);
    return acc;
  }, {});

  const listingSummaries = Object.keys(threads).map((listingId) => {
    const thread = threads[listingId];
    const last = thread[thread.length - 1];
    return {
      listingId: Number(listingId),
      title: last.listingTitle || `Listing ${listingId}`,
      lastMessage: last.content,
      lastTime: last.timestamp,
      count: thread.length,
    };
  }).sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));

  const selectThread = (id) => {
    setSelectedListingId(id);
  };

  const handleReply = () => {
    if (!replyText.trim() || !selectedListingId) return;
    const origin = (threads[selectedListingId] || []).find((m) => m.sender === 'user') || threads[selectedListingId][0] || {};
    const reply = {
      id: Date.now(),
      listingId: selectedListingId,
      listingTitle: origin.listingTitle || `Listing ${selectedListingId}`,
      sender: 'user',
      name: origin.name || '',
      email: origin.email || '',
      content: replyText,
      timestamp: new Date().toISOString(),
    };
    const updated = [...messages, reply];
    localStorage.setItem('messages', JSON.stringify(updated));
    setMessages(updated);
    setReplyText('');
  };

  const selectedMessages = selectedListingId ? ([...(threads[selectedListingId] || [])].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))) : [];

  return (
    <div className="messages-page">
      <Navbar />
      <main className="messages-main">
        <aside className="threads-list">
          <h3>Conversations</h3>
          {listingSummaries.length === 0 && <p>No messages yet.</p>}
          <ul>
            {listingSummaries.map((s) => (
              <li
                key={s.listingId}
                className={s.listingId === selectedListingId ? 'active' : ''}
                onClick={() => selectThread(s.listingId)}
              >
                <strong>{s.title}</strong>
                <div className="preview">{s.lastMessage}</div>
              </li>
            ))}
          </ul>
        </aside>

        <section className="conversation">
          <h3>Conversation</h3>
          {!selectedListingId && <p>Select a conversation to view messages.</p>}
          {selectedListingId && (
            <div className="messages-log">
              {selectedMessages.map((m) => (
                <div key={m.id} className={m.sender === 'user' ? 'msg user' : 'msg agent'}>
                  <div className="msg-meta">{m.sender} — {new Date(m.timestamp).toLocaleString()}</div>
                  <div className="msg-content">{m.content}</div>
                </div>
              ))}
            </div>
          )}

          {selectedListingId && (
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
