import React from 'react';
import './RoleSelector.css';



export default function RoleSelector({ role, onRoleChange, required = false }) {
    return (
        <div className="role-selector-group">
            <label htmlFor="role">I am a <span className="required">*</span></label>
            <select
                id="role"
                value={role}
                onChange={(e) => onRoleChange(e.target.value)}
                required={required}
                className="role-select"
            >
                <option value="">Select a role</option>
                <option value="student">Student/Tenant</option>
                <option value="landlord/agent">Landlord/Agent</option>
            </select>
        </div>
    );
}
