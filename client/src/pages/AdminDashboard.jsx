import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiLogOut,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiX,
  FiRefreshCw,
  FiMenu,
  FiSettings
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#9334E6'];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '', search: '' });
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchFeedback();
  }, [pagination.page, filters]);

  // Real-time updates - refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAnalytics();
      fetchFeedback();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [pagination.page, filters]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/admin/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      const response = await axios.get('/api/admin/feedback', { params });
      setFeedback(response.data.feedback);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleEdit = (item) => {
    setEditingFeedback(item);
    setEditForm({
      status: item.status,
      category: item.category,
      rating: item.rating,
      message: item.message,
      name: item.name,
      email: item.email,
      phone: item.phone
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`/api/admin/feedback/${editingFeedback.id}`, editForm);
      setEditingFeedback(null);
      fetchFeedback();
      fetchAnalytics();
    } catch (error) {
      alert('Failed to update feedback');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`/api/admin/feedback/${id}`);
        fetchFeedback();
        fetchAnalytics();
      } catch (error) {
        alert('Failed to delete feedback');
        console.error(error);
      }
    }
  };

  const clearFilters = () => {
    setFilters({ status: '', category: '', search: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative" style={{
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23 11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23e5e7eb\' fill-opacity=\'0.3\' fill-rule=\'evenodd\'/%3E%3C/svg%3E"), linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
      backgroundSize: '200px 200px, cover',
      backgroundPosition: '0 0, center',
      backgroundRepeat: 'repeat, no-repeat'
    }}>
      {/* Gmail-style Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiMenu className="text-xl text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <img 
                src="/college_logo.png" 
                alt="SDCKL Logo" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-lg font-medium text-gray-900">Feedback Dashboard</h1>
                <p className="text-xs text-gray-500">Sentral Digital College KL</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FiSettings className="text-xl text-gray-700" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Gmail-style Sidebar */}
        <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}>
          <div className="p-4 space-y-2">
            <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm">
              📊 Analytics
            </div>
            <div className="px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700 cursor-pointer">
              📝 All Feedback
            </div>
            <div className="px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700 cursor-pointer">
              ⏳ Pending ({analytics.byStatus.find(s => s.status === 'pending')?.count || 0})
            </div>
            <div className="px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700 cursor-pointer">
              ✅ Resolved ({analytics.byStatus.find(s => s.status === 'resolved')?.count || 0})
            </div>
            <div className="px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700 cursor-pointer">
              📁 Archived ({analytics.byStatus.find(s => s.status === 'archived')?.count || 0})
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Analytics Cards - Gmail style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="text-xs font-medium text-gray-500 uppercase mb-1">Total Feedback</div>
              <div className="text-3xl font-bold text-gray-900">{analytics.total}</div>
              <div className="text-xs text-gray-500 mt-2">All time</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="text-xs font-medium text-gray-500 uppercase mb-1">Average Rating</div>
              <div className="text-3xl font-bold text-yellow-600">
                {analytics.avgRating.toFixed(1)} ⭐
              </div>
              <div className="text-xs text-gray-500 mt-2">Out of 5.0</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="text-xs font-medium text-gray-500 uppercase mb-1">Pending</div>
              <div className="text-3xl font-bold text-orange-600">
                {analytics.byStatus.find(s => s.status === 'pending')?.count || 0}
              </div>
              <div className="text-xs text-gray-500 mt-2">Needs review</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="text-xs font-medium text-gray-500 uppercase mb-1">Resolved</div>
              <div className="text-3xl font-bold text-green-600">
                {analytics.byStatus.find(s => s.status === 'resolved')?.count || 0}
              </div>
              <div className="text-xs text-gray-500 mt-2">Completed</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Rating Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.ratingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="rating" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="count" fill="#4285F4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Feedback by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics.byCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.byCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feedback List - Gmail style */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-base font-semibold text-gray-900">Feedback Management</h2>
                <button
                  onClick={fetchFeedback}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                  <FiRefreshCw />
                  Refresh
                </button>
              </div>

              {/* Search and Filters - Gmail style */}
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search feedback..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="">All Categories</option>
                  {analytics.byCategory.map(cat => (
                    <option key={cat.category} value={cat.category}>{cat.category}</option>
                  ))}
                </select>
                {(filters.status || filters.category || filters.search) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200"
                  >
                    <FiX />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Feedback Table - Gmail style */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : feedback.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p className="text-sm">No feedback found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {feedback.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 border-transparent hover:border-blue-500"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                              {item.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                {item.email && (
                                  <span className="text-xs text-gray-500 truncate">{item.email}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                  {item.category}
                                </span>
                                <span className="flex items-center text-yellow-500 text-xs">
                                  ⭐ {item.rating}/5
                                </span>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                  item.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                  item.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                  item.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mt-2 line-clamp-2">{item.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(item.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                            className="p-2 hover:bg-blue-50 rounded-full text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                            className="p-2 hover:bg-red-50 rounded-full text-red-600 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination - Gmail style */}
            {pagination.pages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="text-xs text-gray-600">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {editingFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Edit Feedback</h3>
              <button
                onClick={() => setEditingFeedback(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="text-xl text-gray-600" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Academic">Academic</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Staff">Staff</option>
                  <option value="Services">Services</option>
                  <option value="Technology">Technology</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editForm.rating}
                  onChange={(e) => setEditForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={editForm.message}
                  onChange={(e) => setEditForm(prev => ({ ...prev, message: e.target.value }))}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingFeedback(null)}
                  className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 py-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© 2025 Sentral Digital College Kuala Lumpur. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
