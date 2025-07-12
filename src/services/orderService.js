import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const order = {
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending'
    };

    const docRef = await addDoc(collection(db, 'orders'), order);
    console.log('Order created with ID:', docRef.id);
    return { id: docRef.id, ...order };
  } catch (error) {
    console.error('Error creating order:', error);
    toast.error('Failed to create order');
    throw error;
  }
};

// Get orders for a specific user by userId and email
export const getUserOrders = async (userId, userEmail = null) => {
  try {
    console.log('Fetching orders for user:', userId, userEmail);

    // First try with orderBy, if it fails due to index, fall back to simple query
    let q;
    try {
      q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    } catch (indexError) {
      console.log('Using simple query without orderBy due to missing index');
      q = query(
        collection(db, 'orders'),
        where('userId', '==', userId)
      );
    }

    const querySnapshot = await getDocs(q);
    const orders = [];

    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    // Sort manually if we couldn't use orderBy
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log('Found orders:', orders.length);
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);

    // If the error is about missing index, try email-based query as fallback
    if (error.message && error.message.includes('index') && userEmail) {
      console.log('Trying email-based query as fallback...');
      try {
        const emailQuery = query(
          collection(db, 'orders'),
          where('userEmail', '==', userEmail)
        );
        const querySnapshot = await getDocs(emailQuery);
        const orders = [];

        querySnapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() });
        });

        // Sort manually
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log('Found orders via email:', orders.length);
        return orders;
      } catch (emailError) {
        console.error('Email-based query also failed:', emailError);
      }
    }

    // Final fallback - try simple query without orderBy
    try {
      const simpleQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(simpleQuery);
      const orders = [];

      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });

      // Sort manually
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return orders;
    } catch (fallbackError) {
      console.error('All query methods failed:', fallbackError);
      toast.error('Failed to fetch orders');
      return [];
    }
  }
};

// Get orders by email (additional method for email-based retrieval)
export const getUserOrdersByEmail = async (userEmail) => {
  try {
    console.log('Fetching orders by email:', userEmail);

    const q = query(
      collection(db, 'orders'),
      where('userEmail', '==', userEmail)
    );

    const querySnapshot = await getDocs(q);
    const orders = [];

    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    // Sort manually by creation date
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log('Found orders by email:', orders.length);
    return orders;
  } catch (error) {
    console.error('Error fetching orders by email:', error);
    toast.error('Failed to fetch orders');
    return [];
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: status,
      updatedAt: new Date().toISOString()
    });
    
    console.log('Order status updated:', orderId, status);
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    toast.error('Failed to update order status');
    return false;
  }
};

// Generate order number
export const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORB${timestamp}${random}`;
};

// Calculate order totals
export const calculateOrderTotals = (items) => {
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  let shippingCharge = 0;
  if (subtotal <= 200) {
    shippingCharge = 30;
  } else if (subtotal <= 400) {
    shippingCharge = 25;
  } else {
    shippingCharge = 20;
  }
  
  const total = subtotal + shippingCharge;
  
  return {
    subtotal,
    shippingCharge,
    total
  };
};

// Order status options
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Payment method options
export const PAYMENT_METHODS = {
  ONLINE: 'online',
  COD: 'cash_on_delivery'
};

// Test function to verify order storage and retrieval
export const testOrderPersistence = async (userEmail, userId) => {
  try {
    console.log('Testing order persistence for:', userEmail, userId);

    // Create a test order
    const testOrder = {
      orderNumber: generateOrderNumber(),
      userId: userId,
      userEmail: userEmail,
      userName: 'Test User',
      items: [
        {
          id: 'test-item-1',
          name: 'Test Product',
          price: 99.99,
          quantity: 1,
          image: '/test-image.jpg'
        }
      ],
      subtotal: 99.99,
      shippingCharge: 20.00,
      total: 119.99,
      paymentMethod: 'test',
      paymentId: 'test-payment-id',
      shippingAddress: {
        address: 'Test Address',
        city: 'Test City',
        country: 'Test Country',
        zip: '12345'
      },
      phone: '1234567890'
    };

    // Save the test order
    const savedOrder = await createOrder(testOrder);
    console.log('Test order saved:', savedOrder.id);

    // Retrieve orders
    const retrievedOrders = await getUserOrdersByEmail(userEmail);
    console.log('Retrieved orders:', retrievedOrders.length);

    return {
      saved: savedOrder,
      retrieved: retrievedOrders,
      success: true
    };
  } catch (error) {
    console.error('Order persistence test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
