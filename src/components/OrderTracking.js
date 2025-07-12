import React from 'react';
import { motion } from 'framer-motion';

const OrderTracking = ({ order }) => {
  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Order Placed', description: 'Your order has been placed successfully' },
      { key: 'confirmed', label: 'Order Confirmed', description: 'Your order has been confirmed' },
      { key: 'processing', label: 'Processing', description: 'Your order is being prepared' },
      { key: 'shipped', label: 'Shipped', description: 'Your order is on the way' },
      { key: 'delivered', label: 'Delivered', description: 'Your order has been delivered' }
    ];

    const currentStatusIndex = steps.findIndex(step => step.key === order.status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStatusIndex,
      active: index === currentStatusIndex
    }));
  };

  const statusSteps = getStatusSteps();

  const getPaymentStatusColor = () => {
    if (order.paymentMethod === 'online') {
      return 'text-green-600 bg-green-100';
    } else {
      return 'text-blue-600 bg-blue-100';
    }
  };

  const getDeliveryEstimate = () => {
    const orderDate = new Date(order.createdAt);
    const estimatedDelivery = new Date(orderDate);
    
    if (order.paymentMethod === 'cash_on_delivery') {
      estimatedDelivery.setDate(orderDate.getDate() + 5); // 5 days for COD
    } else {
      estimatedDelivery.setDate(orderDate.getDate() + 3); // 3 days for online payment
    }
    
    return estimatedDelivery.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold">Order #{order.orderNumber}</h2>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor()}`}>
              {order.paymentMethod === 'online' ? 'Paid Online' : 'Cash on Delivery'}
            </span>
            <p className="text-sm text-gray-600 mt-1">
              Total: ${order.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-800 mb-1">Estimated Delivery</h3>
          <p className="text-blue-700">{getDeliveryEstimate()}</p>
          {order.paymentMethod === 'cash_on_delivery' && (
            <p className="text-sm text-blue-600 mt-1">
              Payment will be collected upon delivery
            </p>
          )}
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Order Status</h3>
        <div className="relative">
          {statusSteps.map((step, index) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start mb-4 last:mb-0"
            >
              {/* Timeline Line */}
              {index < statusSteps.length - 1 && (
                <div
                  className={`absolute left-4 top-8 w-0.5 h-8 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
              
              {/* Status Icon */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : step.active
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step.completed ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              
              {/* Status Content */}
              <div className="ml-4 flex-1">
                <h4 className={`font-medium ${step.active ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-600'}`}>
                  {step.label}
                </h4>
                <p className="text-sm text-gray-500">{step.description}</p>
                {step.active && (
                  <p className="text-xs text-blue-600 mt-1">Current Status</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">Order Items</h3>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="border-t pt-4 mt-4">
        <h3 className="font-semibold mb-2">Shipping Address</h3>
        <div className="text-gray-600">
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
          <p>{order.shippingAddress.country}</p>
          {order.phone && <p>Phone: {order.phone}</p>}
        </div>
      </div>

      {/* COD Information */}
      {order.paymentMethod === 'cash_on_delivery' && (
        <div className="border-t pt-4 mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Cash on Delivery</h3>
            <p className="text-yellow-700 text-sm">
              Please keep ${order.total.toFixed(2)} ready for payment upon delivery.
              Our delivery partner will collect the payment when your order arrives.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
