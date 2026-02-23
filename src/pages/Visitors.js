import React, { useState, useEffect } from 'react';
import { getAllVisitors, createVisitor, approveVisitor, deleteVisitor, getAllUsers } from '../services/api';

const Visitors = ({ user }) => {
    const [visitors, setVisitors] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', company: '', purpose: '', host: '', expectedDate: ''
    });

    useEffect(() => {
        fetchVisitors();
        if (user.role === 'admin') fetchEmployees();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...formData };
            if (user.role === 'employee') {
                data.host = user._id;
            }
            await createVisitor(data);
            setFormData({ name: '', email: '', phone: '', company: '', purpose: '', host: '', expectedDate: '' });
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
                        <button type="submit" className="btn-primary">Register Visitor</button>
                    </form>
                </div>
            )}

            <div className="visitors-table">
                {visitors.length === 0 ? (
                    <p className="no-data">No visitors registered yet</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Company</th>
                                <th>Purpose</th>
                                <th>Host</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visitors.map((visitor) => (
                                <tr key={visitor._id}>
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
                                    <td>{new Date(visitor.expectedDate).toLocaleDateString()}</td>
                                    <td className="actions">
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