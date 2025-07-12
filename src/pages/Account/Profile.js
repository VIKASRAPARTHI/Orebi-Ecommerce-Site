import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserOrders, getUserOrdersByEmail } from "../../services/orderService";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { motion } from "framer-motion";
import OrderTracking from "../../components/OrderTracking";
import { useSearchParams } from "react-router-dom";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchUserOrders();
    }
  }, [currentUser]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching orders for user:', currentUser.uid, currentUser.email);

      // Try to get orders by userId first, then by email as fallback
      let userOrders = await getUserOrders(currentUser.uid, currentUser.email);

      // If no orders found by userId, try email-based retrieval
      if (userOrders.length === 0) {
        console.log('No orders found by userId, trying email...');
        userOrders = await getUserOrdersByEmail(currentUser.email);
      }

      console.log('Total orders found:', userOrders.length);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };



  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-purple-600 bg-purple-100';
      case 'shipped': return 'text-indigo-600 bg-indigo-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentUser) {
    return (
      <div className="max-w-container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please sign in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="My Profile" />
      
      <div className="pb-10">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primeColor rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">
                    {currentUser.displayName || currentUser.userData?.displayName || 'User'}
                  </h1>
                  <p className="text-gray-600">{currentUser.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => handleTabChange('profile')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-primeColor text-primeColor'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => handleTabChange('orders')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'orders'
                      ? 'border-primeColor text-primeColor'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Order History ({orders.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <p className="text-gray-900">{currentUser.displayName || currentUser.userData?.displayName || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{currentUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{currentUser.userData?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <p className="text-gray-900">{currentUser.userData?.city || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <p className="text-gray-900">{currentUser.userData?.address || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <p className="text-gray-900">{currentUser.userData?.country || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <p className="text-gray-900">{currentUser.userData?.zip || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Order History Button */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleTabChange('orders')}
                      className="w-full md:w-auto px-6 py-3 bg-primeColor text-white font-medium rounded-lg hover:bg-black transition-colors duration-300"
                    >
                      View Order History ({orders.length})
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Order History</h2>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primeColor mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No orders found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                              <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <p className="text-sm text-gray-600 mt-1">
                                {order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}
                              </p>
                              <button
                                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                                className="mt-2 px-3 py-1 bg-primeColor text-white text-xs rounded hover:bg-black transition-colors"
                              >
                                {selectedOrder?.id === order.id ? 'Hide Tracking' : 'Track Order'}
                              </button>
                            </div>
                          </div>
                          
                          <div className="border-t pt-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
                                <div className="space-y-1">
                                  {order.items.slice(0, 2).map((item, index) => (
                                    <p key={index} className="text-sm text-gray-600">
                                      {item.name} x {item.quantity}
                                    </p>
                                  ))}
                                  {order.items.length > 2 && (
                                    <p className="text-sm text-gray-500">
                                      +{order.items.length - 2} more items
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Shipping Address</h4>
                                <p className="text-sm text-gray-600">
                                  {order.shippingAddress.address}<br/>
                                  {order.shippingAddress.city}, {order.shippingAddress.zip}<br/>
                                  {order.shippingAddress.country}
                                </p>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Order Total</h4>
                                <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                                <p className="text-sm text-gray-600">
                                  Subtotal: ${order.subtotal.toFixed(2)}<br/>
                                  Shipping: ${order.shippingCharge.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Order Tracking */}
                          {selectedOrder?.id === order.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 border-t pt-4"
                            >
                              <OrderTracking order={order} />
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
