import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { useAuth } from "../../contexts/AuthContext";
import { resetCart } from "../../redux/orebiSlice";
import { toast } from "react-toastify";
import { createOrder, generateOrderNumber, PAYMENT_METHODS } from "../../services/orderService";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const products = useSelector((state) => state.orebiReducer.products);

  const [loading, setLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    totalAmount: 0,
    shippingCharge: 0,
    finalAmount: 0
  });

  // Calculate order totals
  useEffect(() => {
    let totalAmt = 0;
    products.forEach((item) => {
      totalAmt += item.price * item.quantity;
    });

    let shippingCharge = 0;
    if (totalAmt <= 200) {
      shippingCharge = 30;
    } else if (totalAmt <= 400) {
      shippingCharge = 25;
    } else {
      shippingCharge = 20;
    }

    setOrderDetails({
      totalAmount: totalAmt,
      shippingCharge: shippingCharge,
      finalAmount: totalAmt + shippingCharge
    });
  }, [products]);

  // Redirect if cart is empty (but not after payment completion)
  useEffect(() => {
    if (products.length === 0 && !paymentCompleted) {
      toast.error("Your cart is empty. Please add items to proceed.");
      navigate("/cart");
    }
  }, [products, navigate, paymentCompleted]);

  // Save order to database
  const saveOrder = async (paymentMethod, paymentId = null) => {
    try {
      const orderData = {
        orderNumber: generateOrderNumber(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.userData?.displayName || 'Guest',
        items: products.map(item => ({
          id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal: orderDetails.totalAmount,
        shippingCharge: orderDetails.shippingCharge,
        total: orderDetails.finalAmount,
        paymentMethod: paymentMethod,
        paymentId: paymentId,
        shippingAddress: {
          address: currentUser.userData?.address || '',
          city: currentUser.userData?.city || '',
          country: currentUser.userData?.country || '',
          zip: currentUser.userData?.zip || ''
        },
        phone: currentUser.userData?.phone || ''
      };

      console.log('Saving order for user:', currentUser.email, 'with', products.length, 'items');
      const savedOrder = await createOrder(orderData);
      console.log('Order saved successfully:', savedOrder.id, 'for email:', currentUser.email);
      return savedOrder;
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save order details');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setLoading(false);
        return;
      }

      // Verify Razorpay is loaded
      if (!window.Razorpay) {
        toast.error("Payment gateway not loaded properly. Please refresh and try again.");
        setLoading(false);
        return;
      }

      // Use your actual Razorpay key from environment variables
      const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_2xGYyaqTbp0HNw";

      if (!razorpayKey) {
        toast.error("Payment configuration error. Please contact support.");
        setLoading(false);
        return;
      }

      // Create order options
      const options = {
        key: razorpayKey,
        amount: orderDetails.finalAmount * 100, // Amount in paise
        currency: "INR",
        name: "OREBI Shopping",
        description: "Payment for your order",
        handler: async function (response) {
          // Payment successful
          console.log("Payment successful:", response);
          setPaymentCompleted(true);

          // Save order to database
          await saveOrder(PAYMENT_METHODS.ONLINE, response.razorpay_payment_id);

          toast.success("Payment successful! Order placed successfully.");

          // Clear the cart
          dispatch(resetCart());

          // Redirect to home page
          setTimeout(() => {
            navigate("/");
          }, 2000);
        },
        prefill: {
          name: currentUser?.displayName || currentUser?.userData?.displayName || "",
          email: currentUser?.email || "",
          contact: currentUser?.userData?.phone || ""
        },
        notes: {
          address: currentUser?.userData?.address || ""
        },
        theme: {
          color: "#262626"
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast.info("Payment cancelled");
          }
        }
      };

      const paymentObject = new window.Razorpay(options);

      // Add error handling for Razorpay initialization
      paymentObject.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setLoading(false);

        // Handle specific error codes
        if (response.error.code === 'BAD_REQUEST_ERROR') {
          toast.error("Invalid payment request. Please try again.");
        } else if (response.error.code === 'GATEWAY_ERROR') {
          toast.error("Payment gateway error. Please try again.");
        } else if (response.error.code === 'NETWORK_ERROR') {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`);
        }
      });

      paymentObject.open();

    } catch (error) {
      console.error("Payment error:", error);

      // Handle specific Razorpay errors
      if (error.message && error.message.includes('account')) {
        toast.error("Payment gateway account issue. Using alternative payment method...");
        // Fallback to order confirmation without payment
        handlePaymentFallback();
      } else if (error.message && error.message.includes('key')) {
        toast.error("Payment configuration error. Please contact support.");
        setLoading(false);
      } else {
        toast.error("Payment failed. Please try again.");
        setLoading(false);
      }
    }
  };

  // Fallback method when Razorpay fails
  const handlePaymentFallback = async () => {
    setPaymentCompleted(true);
    setLoading(true);

    // Save order to database
    await saveOrder(PAYMENT_METHODS.COD);

    toast.info("Order confirmed for Cash on Delivery.");

    // Clear the cart
    dispatch(resetCart());

    // Redirect to home page
    setTimeout(() => {
      navigate("/");
    }, 3000);

    setLoading(false);
  };

  if (products.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Payment Gateway" />
      <div className="pb-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Items in your order:</h3>
            {products.map((item) => (
              <div key={item._id} className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${orderDetails.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${orderDetails.shippingCharge.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${orderDetails.finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg text-white font-medium text-lg transition-colors ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-primeColor hover:bg-black"
              }`}
            >
              {loading ? "Processing..." : `Pay Online $${orderDetails.finalAmount.toFixed(2)}`}
            </button>

            <button
              onClick={handlePaymentFallback}
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg border-2 border-primeColor text-primeColor font-medium text-lg hover:bg-primeColor hover:text-white transition-colors"
            >
              Cash on Delivery
            </button>
          </div>

          <p className="text-sm text-gray-600 text-center mt-4">
            Secure payment powered by Razorpay | Alternative: Cash on Delivery
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
