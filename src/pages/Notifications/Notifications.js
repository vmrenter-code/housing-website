import React, {useState} from 'react';
import Navbar from '../../components/Navbar.js';
import Footer from '../../components/Footer.js';
import './Notifications.css';



const initialNotifications = [
  { 
    id: 1,
    title: 'New Match!',
    body: '3 new listings near UCLA match your filters.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    title: 'Message Received',
    body: 'John from Oak Apartments replied to your inquiry.',
    time: '15 min ago',
    unread: true,
  },
  {
    id: 3,
    title: 'Price Drop!',
    body: 'Pine Studios dropped to $820/mo.',
    time: '1 hr ago',
    unread: true,
  },
  {
    id: 4,
    title: 'Saved',
    body: 'You saved Maple House to your favorites.',
    time: '3 hrs ago',
    unread: false,
  },
  {
    id: 5,
    title: 'New Match!',
    body: '5 new listings near UCLA match your filters.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 6,
    title: 'Application Update',
    body: 'Your application to Campus Suites is under review.',
    time: '2 days ago',
    unread: false,
  },
  {
    id: 7,
    title: 'Message Received',
    body: 'Sarah from Elm Court sent you a message.',
    time: '3 days ago',
    unread: false,
  },
  {
    id: 8,
    title: 'Reminder',
    body: 'You have 3 unseen listings in your saved folder.',
    time: '1 week ago',
    unread: false,
  },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(initialNotifications);

    const unreadCount = notifications.filter((n) => n.unread).length;

    const handleMarkAllRead = () => {
        setNotifications( (prev) => prev.map( (n) => ({...n, unread: false})));
    }

    const handleMarkOneRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
    <div className="notifications-page">
      <Navbar />
 
      <main className="notifications-main">
        {/* Header row */}
        <div className="notifications-header">
          <div className="notifications-title-group">
            <h1 className="notifications-title">Notifications</h1>
            {unreadCount > 0 && (
              <span className="notifications-badge">{unreadCount}</span>
            )}
          </div>
          <button
            className="notifications-mark-all-btn"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            Mark All Read
          </button>
        </div>
 
        {/* Notification list */}
        <div className="notifications-list">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${n.unread ? 'notification-item--unread' : ''}`}
              onClick={() => n.unread && handleMarkOneRead(n.id)}
              style={{ cursor: n.unread ? 'pointer' : 'default' }}
            >
              {n.unread && <div className="notification-accent-bar" />}
              <div className="notification-content">
                <p className="notification-item-title">{n.title}</p>
                <p className="notification-item-body">{n.body}</p>
              </div>
              <div className="notification-meta">
                <span className="notification-time">{n.time}</span>
                {n.unread && <span className="notification-dot" />}
              </div>
            </div>
          ))}
        </div>
      </main>
 
      <Footer />
    </div>
  );
    

}