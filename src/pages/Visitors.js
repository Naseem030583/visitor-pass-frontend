import React, { useState, useEffect } from 'react';
import { getAllVisitors, createVisitor, approveVisitor, deleteVisitor, getAllUsers, downloadPDF } from '../services/api';

const Visitors = ({ user }) => {
    const [visitors, setVisitors] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', company: '', purpose: '', host: '', expectedDate: ''
    });

    useEffect(() => {
        fetchVisitors();
        if (user.role === 'admin') fetchEmployees();
        // eslint-disable-next-line
    }, []);

    const fetchVisitors = async () => {
        try {
            const res = await getAllVisitors();
            setVisitors(res.data);
        } catch (error) {
            console.log('Error fetching visitors');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await getAllUsers();
            setEmployees(res.data.filter(u => u.role === 'employee'));
        } catch (error) {
            console.log('Error fetching employees');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('company', formData.company);
            data.append('purpose', formData.purpose);
            data.append('expectedDate', formData.expectedDate);

            if (user.role === 'employee') {
                data.append('host', user._id);
            } else {
                data.append('host', formData.host);
            }

            if (photo) {
                data.append('photo', photo);
            }

            await createVisitor(data);
            setFormData({ name: '', email: '', phone: '', company: '', purpose: '', host: '', expectedDate: '' });
            setPhoto(null);
            setPhotoPreview(null);
            setShowForm(false);
            fetchVisitors();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating visitor');
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveVisitor(id);
            fetchVisitors();
        } catch (error) {
            alert(error.response?.data?.message || 'Error approving visitor');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this visitor?')) {
            try {
                await deleteVisitor(id);
                fetchVisitors();
            } catch (error) {
                alert(error.response?.data?.message || 'Error deleting visitor');
            }
        }
    };

    const handleDownloadPDF = async (id, name) => {
        try {
            const res = await downloadPDF(id);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `visitor-pass-${name}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Error downloading PDF');
        }
    };

    // Helper to check if photo is a base64 string
    const getPhotoSrc = (photoData) => {
        if (!photoData) return null;
        if (photoData.startsWith('data:image')) return photoData;
        return null;
    };

    if (loading) return <div className="loading">Loading Visitors...</div>;

    return (
        <div className="visitors-page">
            <div className="page-header">
                <h2>Visitors ({visitors.length})</h2>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Cancel' : '+ New Visitor'}
                </button>
            </div>

            {showForm && (
                <div className="visitor-form-card">
                    <h3>Register New Visitor</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Name *</label>
                                <input name="name" value={formData.name} onChange={handleChange} placeholder="Visitor name" required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone *</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" required />
                            </div>
                            <div className="form-group">
                                <label>Company</label>
                                <input name="company" value={formData.company} onChange={handleChange} placeholder="Company name" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Purpose *</label>
                                <input name="purpose" value={formData.purpose} onChange={handleChange} placeholder="Purpose of visit" required />
                            </div>
                            <div className="form-group">
                                <label>Expected Date *</label>
                                <input name="expectedDate" type="date" value={formData.expectedDate} onChange={handleChange} required />
                            </div>
                        </div>
                        {user.role === 'admin' && (
                            <div className="form-group">
                                <label>Host Employee *</label>
                                <select name="host" value={formData.host} onChange={handleChange} required>
                                    <option value="">Select Host</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>{emp.name} - {emp.department}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="form-group">
                            <label>Visitor Photo</label>
                            <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={handlePhotoChange} className="file-input" />
                            {photoPreview && (
                                <div className="photo-preview">
                                    <img src={photoPreview} alt="Preview" />
                                    <button type="button" className="btn-remove-photo" onClick={() => { setPhoto(null); setPhotoPreview(null); }}>✕ Remove</button>
                                </div>
                            )}
                        </div>
                        <button type="submit" className="btn-primary">Register Visitor</button>
                    </form>
                </div>
            )}

            {/* QR Code Modal */}
            {selectedVisitor && (
                <div className="modal-overlay" onClick={() => setSelectedVisitor(null)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Visitor Pass</h3>
                            <button className="btn-close" onClick={() => setSelectedVisitor(null)}>✕</button>
                        </div>
                        <div className="pass-card">
                            {getPhotoSrc(selectedVisitor.photo) && (
                                <div className="pass-photo">
                                    <img src={getPhotoSrc(selectedVisitor.photo)} alt="Visitor" />
                                </div>
                            )}
                            <h2>{selectedVisitor.name}</h2>
                            <p><strong>Company:</strong> {selectedVisitor.company || '-'}</p>
                            <p><strong>Purpose:</strong> {selectedVisitor.purpose}</p>
                            <p><strong>Host:</strong> {selectedVisitor.host?.name || '-'}</p>
                            <p><strong>Date:</strong> {new Date(selectedVisitor.expectedDate).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> <span className={`status-badge ${selectedVisitor.status}`}>{selectedVisitor.status}</span></p>
                            <p><strong>Pass Code:</strong> <code className="passcode">{selectedVisitor.passCode}</code></p>
                            {selectedVisitor.qrCode && (
                                <div className="qr-section">
                                    <img src={selectedVisitor.qrCode} alt="QR Code" className="qr-image" />
                                    <p className="qr-label">Scan this QR Code</p>
                                </div>
                            )}
                            <button className="btn-pdf" onClick={() => handleDownloadPDF(selectedVisitor._id, selectedVisitor.name)}>
                                📄 Download PDF Badge
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="visitors-table">
                {visitors.length === 0 ? (
                    <p className="no-data">No visitors registered yet</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Company</th>
                                <th>Purpose</th>
                                <th>Host</th>
                                <th>Status</th>
                                <th>Pass Code</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visitors.map((visitor) => (
                                <tr key={visitor._id}>
                                    <td>
                                        {getPhotoSrc(visitor.photo) ? (
                                            <img src={getPhotoSrc(visitor.photo)} alt="Visitor" className="table-photo" />
                                        ) : (
                                            <div className="no-photo">👤</div>
                                        )}
                                    </td>
                                    <td>{visitor.name}</td>
                                    <td>{visitor.phone}</td>
                                    <td>{visitor.company || '-'}</td>
                                    <td>{visitor.purpose}</td>
                                    <td>{visitor.host?.name || '-'}</td>
                                    <td>
                                        <span className={`status-badge ${visitor.status}`}>
                                            {visitor.status}
                                        </span>
                                    </td>
                                    <td><code className="passcode">{visitor.passCode}</code></td>
                                    <td>{new Date(visitor.expectedDate).toLocaleDateString()}</td>
                                    <td className="actions">
                                        <button className="btn-view" onClick={() => setSelectedVisitor(visitor)}>📋 Pass</button>
                                        {visitor.status === 'pending' && (user.role === 'admin' || user.role === 'employee') && (
                                            <button className="btn-approve" onClick={() => handleApprove(visitor._id)}>✓ Approve</button>
                                        )}
                                        {user.role === 'admin' && (
                                            <button className="btn-delete" onClick={() => handleDelete(visitor._id)}>✕ Delete</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Visitors;
