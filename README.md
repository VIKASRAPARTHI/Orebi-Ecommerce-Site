# OREBI Shopping - Full-Stack E-commerce Platform

A comprehensive, modern e-commerce platform built with React.js, Firebase, and Razorpay, featuring complete user authentication, order management, payment processing, and persistent data storage.

![App Screenshot](https://github.com/VIKASRAPARTHI/Orebi-Ecommerce-Site/blob/main/public/Screenshot.png?raw=true)

## Features

###  **Authentication & Security**
- **Firebase Authentication**: Secure email/password authentication
- **Protected Routes**: All main pages require authentication
- **User Profiles**: Complete user profile management with personal information
- **Session Persistence**: Automatic login state management across browser sessions

###  **Shopping Experience**
- **Product Catalog**: Browse products by categories (New Arrivals, Best Sellers, Special Offers)
- **Shopping Cart**: Add/remove items with Redux state management
- **Product Details**: Detailed product pages with images and descriptions
- **Responsive Design**: Mobile-first design with Tailwind CSS

###  **Payment & Orders**
- **Razorpay Integration**: Secure online payment processing
- **Cash on Delivery**: COD option with order tracking
- **Order Management**: Complete order history and tracking system
- **Persistent Storage**: Orders stored permanently by user email
- **Cross-Session Data**: Order history persists across logout/login cycles

###  **Order Tracking & Management**
- **Real-time Status**: 5-stage order tracking (Pending → Confirmed → Processing → Shipped → Delivered)
- **Visual Timeline**: Interactive order status with progress indicators
- **Order Details**: Complete order breakdown with items, pricing, and shipping information
- **Payment Method Tracking**: Clear distinction between online payments and COD
- **Delivery Estimates**: Automatic delivery date calculation

###  **User Interface**
- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works seamlessly on all devices
- **Smooth Animations**: Framer Motion animations and transitions
- **Intuitive Navigation**: User-friendly navigation with authentication-aware menus

##  Tech Stack

### **Frontend**
- **React.js** - Modern JavaScript library for building user interfaces
- **React Router DOM** - Client-side routing and navigation
- **Redux Toolkit** - State management for cart and user data
- **Tailwind CSS** - Utility-first CSS framework for styling

### **Backend & Database**
- **Firebase Authentication** - Secure user authentication and management
- **Cloud Firestore** - NoSQL database for storing orders and user data
- **Firebase Hosting** - (Optional) For deployment

### **Payment Processing**
- **Razorpay** - Secure payment gateway for online transactions
- **Test Mode** - Safe testing environment for development

### **UI/UX Libraries**
- **React Icons** - Comprehensive icon library
- **Framer Motion** - Smooth animations and transitions
- **React Slick** - Carousel and slider components
- **React Toastify** - User-friendly notifications

### **Development Tools**
- **Create React App** - React application boilerplate
- **ESLint** - Code linting and formatting
- **Git** - Version control

##  Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Firebase Account** (for authentication and database)
- **Razorpay Account** (for payment processing)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd orebishopping
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Razorpay Configuration
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
REACT_APP_RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password
   - Create a Firestore database
   - Add your domain to authorized domains

5. **Set up Razorpay**
   - Create account at [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Get your API keys from the dashboard
   - Configure webhook URLs (optional)

6. **Start the development server**
```bash
npm start
```

7. **Open [http://localhost:3000](http://localhost:3000)** to view it in your browser

##  Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

##  Project Structure

```
src/
├── components/          # Reusable components
│   ├── home/           # Home page components (Header, Footer, etc.)
│   ├── designLayouts/  # Layout components
│   ├── pageProps/      # Page-specific components
│   ├── ProtectedRoute.js # Authentication route protection
│   └── OrderTracking.js # Order tracking component
├── pages/              # Main pages
│   ├── Account/        # Authentication pages
│   │   ├── SignIn.js   # User login page
│   │   ├── SignUp.js   # User registration page
│   │   └── Profile.js  # User profile and order history
│   ├── Home/           # Home page
│   ├── Shop/           # Product listing and catalog
│   ├── Cart/           # Shopping cart management
│   ├── payment/        # Payment processing
│   │   └── Payment.js  # Razorpay integration
│   └── Contact/        # Contact and about pages
├── contexts/           # React contexts
│   └── AuthContext.js  # Firebase authentication context
├── services/           # API and service functions
│   └── orderService.js # Order management functions
├── firebase/           # Firebase configuration
│   └── config.js       # Firebase setup and initialization
├── hooks/              # Custom React hooks
│   └── useClickOutside.js # Click outside detection hook
├── assets/             # Images and static files
├── redux/              # Redux store and slices
│   └── orebiSlice.js   # Cart state management
└── constants/          # App constants and configuration
```

##  Key Features & User Flow

###  **Authentication Flow**
1. **Registration**: Users create accounts with email, password, and personal details
2. **Login**: Secure authentication with Firebase
3. **Protected Access**: All main pages require authentication
4. **Profile Management**: Users can view and manage their profile information

###  **Shopping Experience**
1. **Browse Products**: Explore categorized product catalog
2. **Product Details**: View detailed product information and images
3. **Add to Cart**: Add items with quantity selection
4. **Cart Management**: Review, modify, and manage cart items
5. **Secure Checkout**: Proceed to payment with authentication

###  **Payment & Order Processing**
1. **Payment Options**: Choose between online payment (Razorpay) or Cash on Delivery
2. **Order Creation**: Orders automatically saved to database with complete details
3. **Order Confirmation**: Immediate confirmation with order number
4. **Email-based Storage**: Orders linked to user email for persistence

###  **Order Management**
1. **Order History**: View all past orders in profile page
2. **Order Tracking**: Real-time status updates with visual timeline
3. **Order Details**: Complete breakdown of items, pricing, and shipping
4. **Cross-Session Persistence**: Orders remain accessible after logout/login

###  **User Experience**
- **Responsive Design**: Seamless experience across all devices
- **Intuitive Navigation**: Easy-to-use interface with clear call-to-actions
- **Real-time Feedback**: Toast notifications for all user actions
- **Loading States**: Smooth loading indicators for better UX

##  Database Structure

### **Users Collection (Firebase Auth + Firestore)**
```javascript
{
  uid: "firebase_user_uid",
  email: "user@example.com",
  displayName: "User Name",
  userData: {
    phone: "1234567890",
    address: "Street Address",
    city: "City Name",
    country: "Country",
    zip: "12345"
  }
}
```

### **Orders Collection (Firestore)**
```javascript
{
  orderNumber: "ORB1752324674972123",
  userId: "firebase_user_uid",
  userEmail: "user@example.com",
  userName: "User Name",
  items: [
    {
      id: "product_id",
      name: "Product Name",
      price: 99.99,
      quantity: 2,
      image: "product_image_url"
    }
  ],
  subtotal: 199.98,
  shippingCharge: 25.00,
  total: 224.98,
  paymentMethod: "online" | "cash_on_delivery",
  paymentId: "razorpay_payment_id",
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered",
  shippingAddress: {
    address: "Street Address",
    city: "City",
    country: "Country",
    zip: "ZIP Code"
  },
  phone: "Phone Number",
  createdAt: "2025-07-12T12:46:06.991Z",
  updatedAt: "2025-07-12T12:46:06.991Z"
}
```

##  Deployment

### **Firebase Hosting**
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize project: `firebase init hosting`
4. Build the app: `npm run build`
5. Deploy: `firebase deploy`

### **Netlify**
1. Build the app: `npm run build`
2. Drag and drop the `build` folder to Netlify
3. Configure environment variables in Netlify dashboard

### **Vercel**
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

##  Testing

### **Manual Testing Checklist**
- [ ] User registration and login
- [ ] Product browsing and search
- [ ] Add/remove items from cart
- [ ] Checkout process (both payment methods)
- [ ] Order creation and storage
- [ ] Order history and tracking
- [ ] Logout and login persistence
- [ ] Responsive design on mobile/tablet

### **Payment Testing**
- Use Razorpay test credentials for safe testing
- Test both successful and failed payment scenarios
- Verify order creation for both online and COD payments

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

**Vikas Raparthi**
- GitHub: [@VIKASRAPARTHI](https://github.com/VIKASRAPARTHI)
- LinkedIn: [Raparthi Vikas](https://linkedin.com/in/raparthi-vikas-442242294/)

## Acknowledgments

- React.js community for excellent documentation
- Firebase for providing robust backend services
- Razorpay for secure payment processing
- Tailwind CSS for beautiful styling utilities
- All open-source contributors who made this project possible