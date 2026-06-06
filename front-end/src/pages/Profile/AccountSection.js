import React, { useState } from 'react';
import { API_BASE, isOnline, readOfflineCache, writeOfflineCache } from '../../utils';
import ErrorDialog from '../../components/ErrorDialog';

export default function AccountSection({ user, setUser }) {
    const [isSavingAccount, setIsSavingAccount] = useState(false);
    const [accountMessage, setAccountMessage] = useState('');
    const [accountError, setAccountError] = useState('');

    if (!user) return null;

    const handleRoleChange = (role) => {
        setUser((prev) => ({
            ...prev,
            role,
            university: role === 'student' ? prev.university : '',
        }));
    };

    const handleAccountSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) return;
        if (!isOnline()) {
            setAccountError('Offline mode: account updates require a network connection.');
            return;
        }

        setIsSavingAccount(true);
        setAccountMessage('');
        setAccountError('');

        const updatePayload = {
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        };

        if (user.role === 'student') {
            updatePayload.university = user.university;
        }

        try {
            const response = await fetch(`${API_BASE}/users/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatePayload),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Unable to update account information');
            }

            const updatedUser = {
                ...user,
                fullName: data.fullName || user.fullName,
                email: data.email || user.email,
                role: data.role || user.role,
                university: data.university || (data.role === 'student' ? user.university : ''),
            };
            setUser(updatedUser);

            const cachedProfile = readOfflineCache('offlineProfile') || {};
            writeOfflineCache('offlineProfile', {
                ...cachedProfile,
                ...updatedUser,
                preferences: cachedProfile.preferences,
                notificationSettings: cachedProfile.notificationSettings,
            });
            setAccountMessage('Account information updated successfully');
        } catch (err) {
            setAccountError(err.message || 'Unable to update account information');
        } finally {
            setIsSavingAccount(false);
        }
    };

    return (
        <section className="card account-card" id="profile-panel-account" role="tabpanel" aria-labelledby="profile-tab-account" tabIndex={0}>
            <h2>Account Information</h2>
            <form onSubmit={handleAccountSubmit} className="account-form">
                <div className="input-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        id="fullName"
                        type="text"
                        value={user.fullName}
                        onChange={(e) => setUser((prev) => ({ ...prev, fullName: e.target.value }))}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="role">Role</label>
                    <select
                        id="role"
                        value={user.role}
                        onChange={(e) => handleRoleChange(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="landlord/agent">Landlord/Agent</option>
                    </select>
                </div>
                {user.role === 'student' && (
                    <div className="input-group">
                        <label htmlFor="university">University</label>
                        <input
                            id="university"
                            type="text"
                            value={user.university}
                            onChange={(e) => setUser((prev) => ({ ...prev, university: e.target.value }))}
                            required
                        />
                    </div>
                )}
                <button type="submit" className="save-btn" disabled={isSavingAccount}>
                    {isSavingAccount ? 'Saving...' : 'Save Account'}
                </button>
                {accountMessage && <p className="form-success">{accountMessage}</p>}
            </form>
            <ErrorDialog visible={!!accountError} title="Update Error" message={accountError} onClose={() => setAccountError('')} />
        </section>
    );
}
