import React from 'react';
import './ErrorDialog.css';



export default function ErrorDialog({ visible, title = 'Error', message, onClose }) {
    if (!visible) return null;

    return (
        <div className="error-dialog-overlay" role="alertdialog" aria-modal="true">
            <div className="error-dialog-box">
                <div className="error-dialog-header">
                    <h3>{title}</h3>
                    <button className="error-dialog-close" onClick={onClose} aria-label="Close error dialog">
                        ×
                    </button>
                </div>
                <div className="error-dialog-content">
                    <p>{message}</p>
                </div>
                <div className="error-dialog-actions">
                    <button className="btn-primary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
