import React, { useState, useEffect } from 'react';
import { getDashboardStats, getAllVisitors } from '../services/api';

const Dashboard = ({ user }) => {
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, checkedIn: 0, checkedOut: 0 });
    const [recentVisitors, setRecentVisitors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            if (user.role === 'admin' || user.role === 'security') {
                const statsRes = await getDashboardStats();
                setStats(statsRes.data);
            }
            const visitorsRes = await getAllVisitors();
            setRecentVisitors(visitorsRes.data.slice(0, 5));
        } catch (error) {
            console.log('Error fetching dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading Dashboard...</div>;

    return (
        <div className="dashboard">
            <h2>Welcome, {user.name}!</h2>
            <p className="role-badge">{user.role.toUpperCase()} • {user.department}</p>

            {(user.role === 'admin' || user.role === 'security') && (
                <div className="stats-grid">
                    <div className="stat-card total">
                        <h3>{stats.total}</h3>
                        <p>Total Visitors</p>
                    </div>
                    <div className="stat-card pending">
                        <h3>{stats.pending}</h3>
                        <p>Pending</p>
                    </div>
                    <div className="stat-card approved">
                        <h3>{stats.approved}</h3>
                        <p>Approved</p>
                    </div>
                    <div className="stat-card checkedin">
                        <h3>{stats.checkedIn}</h3>
                        <p>Checked In</p>
                    </div>
                    <div className="stat-card checkedout">
                        <h3>{stats.checkedOut}</h3>
                        <p>Checked Out</p>
                    </div>
                </div>
            )}

            <div className="recent-visitors">
                <h3>Recent Visitors</h3>
                {recentVisitors.length === 0 ? (
                    <p className="no-data">No visitors yet</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Company</th>
                                <th>Purpose</th>
                                <th>Host</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentVisitors.map((visitor) => (
                                <tr key={visitor._id}>
                                    <td>{visitor.name}</td>
                                    <td>{visitor.company || '-'}</td>
                                    <td>{visitor.purpose}</td>
                                    <td>{visitor.host?.name || '-'}</td>
                                    <td>
                                        <span className={`status-badge ${visitor.status}`}>
                                            {visitor.status}
                                        </span>
                                    </td>
                                    <td>{new Date(visitor.expectedDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;