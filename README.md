# OREBI Shopping - E-commerce Platform

A modern, responsive e-commerce platform built with React.js, featuring a complete shopping experience with user authentication, product catalog, and cart functionality.

## Features

- **User Authentication**: Complete signup/signin flow with form validation
- **Product Catalog**: Browse products by categories (New Arrivals, Best Sellers, Special Offers)
- **Shopping Cart**: Add/remove items with Redux state management
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Product Details**: Detailed product pages with images and descriptions
- **Contact & About Pages**: Complete business information and contact forms
- **Newsletter Subscription**: Email subscription with validation

## Tech Stack

- **Frontend**: React.js, React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Icons**: React Icons
- **Animations**: Framer Motion
- **Carousel**: React Slick

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd orebishopping
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── home/           # Home page components
│   ├── designLayouts/  # Layout components
│   └── pageProps/      # Page-specific components
├── pages/              # Main pages
│   ├── Account/        # SignIn/SignUp pages
│   ├── Home/           # Home page
│   ├── Shop/           # Product listing
│   ├── Cart/           # Shopping cart
│   └── Contact/        # Contact page
├── assets/             # Images and static files
├── redux/              # Redux store and slices
└── constants/          # App constants
```

## Key Features

### Authentication Flow
- User registration with comprehensive form validation
- Secure login with email/password
- Automatic redirection after successful authentication

### Shopping Experience
- Product browsing with categories
- Add to cart functionality
- Responsive product grid
- Product search and filtering

### User Interface
- Modern, clean design
- Mobile-responsive layout
- Smooth animations and transitions
- Intuitive navigation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.