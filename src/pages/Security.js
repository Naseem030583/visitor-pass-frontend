import React, { useState } from 'react';
import { checkInVisitor, checkOutVisitor } from '../services/api';

const Security = () => {
    const [passCode, setPassCode] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCheckIn = async () => {
        if (!passCode.trim()) return alert('Please enter a pass code');
        setError('');
        setResult(null);
        setLoading(true);
        try {
            const res = await checkInVisitor({ passCode });
            setResult({ type: 'check-in', visitor: res.data.visitor, message: res.data.message });
            setPassCode('');
        } catch (err) {
            setError(err.response?.data?.message || 'Check-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        if (!passCode.trim()) return alert('Please enter a pass code');
        setError('');
        setResult(null);
        setLoading(true);
        try {
            const res = await checkOutVisitor({ passCode });
            setResult({ type: 'check-out', visitor: res.data.visitor, message: res.data.message });
            setPassCode('');
        } catch (err) {
            setError(err.response?.data?.message || 'Check-out failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="security-page">
            <h2>🔒 Security Checkpoint</h2>
            <p className="page-subtitle">Enter visitor pass code to check-in or check-out</p>

            <div className="security-card">
                <div className="form-group">
                    <label>Visitor Pass Code</label>
                    <input
                        type="text"
                        value={passCode}
                        onChange={(e) => setPassCode(e.target.value)}
                        placeholder="Enter pass code (e.g. 6cf8cf1df3f4)"
                        className="passcode-input"
                    />
                </div>
                <div className="security-buttons">
                    <button className="btn-checkin" onClick={handleCheckIn} disabled={loading}>
                        {loading ? 'Processing...' : '✓ Check In'}
                    </button>
                    <button className="btn-checkout" onClick={handleCheckOut} disabled={loading}>
                        {loading ? 'Processing...' : '✕ Check Out'}
                    </button>
                </div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            {result && (
                <div className={`result-card ${result.type}`}>
                    <h3>{result.message}</h3>
                    <div className="visitor-details">
                        <p><strong>Name:</strong> {result.visitor.name}</p>
                        <p><strong>Phone:</strong> {result.visitor.phone}</p>
                        <p><strong>Company:</strong> {result.visitor.company || '-'}</p>
                        <p><strong>Purpose:</strong> {result.visitor.purpose}</p>
                        <p><strong>Status:</strong> <span className={`status-badge ${result.visitor.status}`}>{result.visitor.status}</span></p>
                        {result.visitor.checkInTime && (
                            <p><strong>Check-In Time:</strong> {new Date(result.visitor.checkInTime).toLocaleString()}</p>
                        )}
                        {result.visitor.checkOutTime && (
                            <p><strong>Check-Out Time:</strong> {new Date(result.visitor.checkOutTime).toLocaleString()}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Security;