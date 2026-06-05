import React, { useEffect, useRef } from 'react';
import './ErrorDialog.css';

export default function ErrorDialog({ visible, title = 'Error', message, onClose }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (!visible) return;

        const previousActive = document.activeElement;
        dialogRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            previousActive?.focus?.();
        };
    }, [visible, onClose]);

    if (!visible) return null;

    return (
        <div className="error-dialog-overlay" role="alertdialog" aria-modal="true" aria-labelledby="error-dialog-title" aria-describedby="error-dialog-message">
            <div className="error-dialog-box" ref={dialogRef} tabIndex={-1}>
                <div className="error-dialog-header">
                    <h3 id="error-dialog-title">{title}</h3>
                    <button className="error-dialog-close" onClick={onClose} aria-label="Close error dialog" type="button">
                        ×
                    </button>
                </div>
                <div className="error-dialog-content">
                    <p id="error-dialog-message">{message}</p>
                </div>
                <div className="error-dialog-actions">
                    <button className="btn-primary" onClick={onClose} type="button">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
