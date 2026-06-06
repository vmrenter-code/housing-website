import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar.js';
import Footer from '../../components/Footer.js';
import useOnlineStatus from '../../hooks/useOnlineStatus.js';
import { API_BASE, isOnline, readOfflineCache, writeOfflineCache } from '../../utils.js';
import './Notifications.css';

function formatNotificationTime(createdAt) {
  if (!createdAt) return '';

  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [usingOfflineNotifications, setUsingOfflineNotifications] = useState(false);
  const online = useOnlineStatus();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      const cachedNotifications = readOfflineCache('offlineNotifications') || [];
      setLoading(true);
      setFetchError(null);
      setUsingOfflineNotifications(false);

      if (!online) {
        if (cachedNotifications.length > 0) {
          setNotifications(cachedNotifications);
          setUsingOfflineNotifications(true);
        } else {
          setFetchError('Offline mode: no cached notifications are available.');
        }
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setFetchError('Please log in to view notifications.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setNotifications(data);
        writeOfflineCache('offlineNotifications', data);
      } catch (err) {
        if (cachedNotifications.length > 0) {
          setNotifications(cachedNotifications);
          setUsingOfflineNotifications(true);
        }
        setFetchError('Failed to load notifications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [online]);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await handleMarkOneRead(notification._id);
    }

    const listingId =
      typeof notification.listing === 'object'
        ? notification.listing._id
        : notification.listing;

    if (listingId) {
      navigate(`/listing/${listingId}`);
    }
  };

  const handleMarkAllRead = async () => {
    if (!isOnline()) {
      setFetchError('Offline mode: notifications cannot be updated until you reconnect.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setFetchError('Please log in to update notifications.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const updated = notifications.map((n) => ({ ...n, isRead: true }));
      setNotifications(updated);
      writeOfflineCache('offlineNotifications', updated);
    } catch (err) {
      setFetchError('Failed to mark all notifications as read.');
    }
  };

  const handleMarkOneRead = async (id) => {
    if (!isOnline()) {
      setFetchError('Offline mode: notifications cannot be updated until you reconnect.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setFetchError('Please log in to update notifications.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const updated = notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n));
      setNotifications(updated);
      writeOfflineCache('offlineNotifications', updated);
    } catch (err) {
      setFetchError('Failed to update notification.');
    }
  };

  return (
    <div className="notifications-page">
      <Navbar />

      <main className="notifications-main">
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
            disabled={unreadCount === 0 || !online}
          >
            Mark All Read
          </button>
        </div>

        {usingOfflineNotifications && (
          <p className="offline-info">
            Offline mode: showing cached notifications. Updates are disabled until you reconnect.
          </p>
        )}

        {loading && <p>Loading notifications...</p>}

        {fetchError && (
          <p role="alert" className="notifications-error">
            {fetchError}
          </p>
        )}

        {!loading && !fetchError && notifications.length === 0 && (
          <p className="notifications-empty">No notifications yet.</p>
        )}

        <div className="notifications-list">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`notification-item ${
                !n.isRead ? 'notification-item--unread' : ''
              }`}
              onClick={() => handleNotificationClick(n)}
              style={{ cursor: n.listing ? 'pointer' : 'default' }}
            >
              {!n.isRead && <div className="notification-accent-bar" />}

              <div className="notification-content">
                <p className="notification-item-title">{n.title}</p>
                <p className="notification-item-body">{n.message}</p>
              </div>

              <div className="notification-meta">
                <span className="notification-time">
                  {formatNotificationTime(n.createdAt)}
                </span>
                {!n.isRead && <span className="notification-dot" />}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}