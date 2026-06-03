import React from 'react';

/**
 * Conditional field wrapper that shows/hides content based on role
 * @param {string} role - Current user role ('tenant' or 'landlord')
 * @param {string|string[]} showFor - Role(s) to show this field for
 * @param {React.ReactNode} children - Content to conditionally render
 * @param {boolean} required - Whether the field is required
 */
export default function ConditionalField({ role, showFor, children, required = false }) {
    const shouldShow = Array.isArray(showFor) ? showFor.includes(role) : role === showFor;
    
    if (!shouldShow) {
        return null;
    }

    return children;
}
