import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  Bell, 
  Star, 
  Calendar, 
  TrendingUp, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import apiService from '../../services/api';

const AdminPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({
    users: [],
    foodListings: [],
    notifications: [],
    reviews: [],
    reservations: []
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');

  // Load data on component mount
  useEffect(() => {
    console.log('AdminPanel mounted, loading data...');
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [users, foodListings, notifications, reviews, reservations] = await Promise.all([
        apiService.getDataWithFallback('/users/', 'users'),
        apiService.getDataWithFallback('/food-listings/', 'food-listings'),
        apiService.getDataWithFallback('/notifications/', 'notifications'),
        apiService.getDataWithFallback('/reviews/', 'reviews'),
        apiService.getDataWithFallback('/reservations/', 'reservations')
      ]);

      setData({
        users: users || [],
        foodListings: foodListings || [],
        notifications: notifications || [],
        reviews: reviews || [],
        reservations: reservations || []
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setModalType('create');
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalType('edit');
    setShowModal(true);
  };

  const handleDelete = async (item, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        await apiService.deleteItem(`/${type}/${item.id}/`);
        loadAllData(); // Refresh data
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
    }
  };

  const getFilteredData = (type) => {
    const items = data[type] || [];
    if (!searchTerm) return items;
    return items.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const getStats = () => {
    return {
      totalUsers: data.users.length,
      totalFoodListings: data.foodListings.length,
      totalNotifications: data.notifications.length,
      totalReviews: data.reviews.length,
      totalReservations: data.reservations.length,
      activeFoodListings: data.foodListings.filter(f => f.status === 'available').length,
      unreadNotifications: data.notifications.filter(n => !n.is_read).length
    };
  };

  const stats = getStats();

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total Users</p>
              <p className="text-2xl font-bold text-blue-800">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Food Listings</p>
              <p className="text-2xl font-bold text-green-800">{stats.totalFoodListings}</p>
            </div>
            <Package className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Notifications</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.totalNotifications}</p>
            </div>
            <Bell className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Reservations</p>
              <p className="text-2xl font-bold text-purple-800">{stats.totalReservations}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {data.foodListings.slice(0, 5).map((listing, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{listing.name}</p>
                  <p className="text-xs text-gray-500">Added {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : 'Unknown date'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Food Listings</span>
              <span className="text-sm font-medium text-green-600">{stats.activeFoodListings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Unread Notifications</span>
              <span className="text-sm font-medium text-yellow-600">{stats.unreadNotifications}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Reviews</span>
              <span className="text-sm font-medium text-blue-600">{stats.totalReviews}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTable = (type, columns, data) => {
    const filteredData = getFilteredData(type);
    
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold capitalize">{type}</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleCreate}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add New</span>
              </button>
              <button
                onClick={loadAllData}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
              >
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item[column.toLowerCase().replace(/\s+/g, '_')] || '-'}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item, type)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'foodListings', label: 'Food Listings', icon: Package },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'reservations', label: 'Reservations', icon: Calendar }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">KindBite Admin Panel</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-100 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Content */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="animate-spin" size={32} />
                </div>
              ) : (
                <>
                  {activeTab === 'dashboard' && renderDashboard()}
                  {activeTab === 'users' && renderTable('users', ['Username', 'Email', 'Role', 'Kind Coins', 'Verified'])}
                  {activeTab === 'foodListings' && renderTable('foodListings', ['Name', 'Provider', 'Category', 'Price', 'Status'])}
                  {activeTab === 'notifications' && renderTable('notifications', ['Title', 'Type', 'User', 'Read', 'Created'])}
                  {activeTab === 'reviews' && renderTable('reviews', ['User', 'Food Listing', 'Rating', 'Comment', 'Created'])}
                  {activeTab === 'reservations' && renderTable('reservations', ['User', 'Food Listing', 'Quantity', 'Status', 'Pickup Time'])}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
