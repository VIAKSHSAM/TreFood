# TreFood – Online Food Ordering Platform

TreFood is a full-stack online food ordering platform designed to make food ordering and restaurant management simple, convenient, and efficient.

The platform provides customers with an easy-to-use interface for exploring food products, placing orders, making payments, and tracking order status. It also includes an admin dashboard for managing products, orders, payments, and sales analytics.

## Project Overview

TreFood is developed as a recruitment prototype with the vision of creating a practical and user-friendly food ordering experience for the campus community.

The project focuses on:
- Simple and responsive user experience
- Secure customer authentication
- Efficient food ordering and checkout
- Online and Cash on Delivery payments
- Centralized order and product management
- Sales monitoring and analytics

## Key Features

### Customer Features
- Customer registration and login
- Browse food products and categories
- Search and explore available products
- Add products to shopping cart
- Manage cart items and quantities
- Checkout with customer details
- Cash on Delivery payment
- Online payment through Razorpay
- View order history
- Track order status
- Customer logout

### Admin Features
- Admin authentication
- Admin dashboard
- Add, update, and delete products
- Manage customer orders
- Update order status
- Manage payment status
- View total orders and revenue
- Track COD and online payment revenue
- Daily and monthly revenue analysis
- Sales charts and analytics

### Payment Integration
TreFood integrates Razorpay Standard Checkout for online payments.

Payment workflow:
1. Customer selects the online payment option.
2. Backend creates a Razorpay order.
3. Razorpay Checkout opens for payment.
4. Customer completes the payment.
5. Backend verifies the payment signature.
6. Payment details and order information are stored in MongoDB.

Cash on Delivery is also supported.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack application framework |
| React.js | User interface |
| TypeScript | Type-safe development |
| Tailwind CSS | Responsive styling |
| MongoDB | Database |
| Mongoose | Database modeling |
| Razorpay | Online payment gateway |
| Node.js | Backend runtime |
| Lucide React | Icons |
| Recharts | Analytics and charts |
| Git & GitHub | Version control |

## Application Structure

```text
TreFood/
├── app/
│   ├── api/
│   │   ├── admin-login/
│   │   ├── customer-logout/
│   │   ├── customer-session/
│   │   ├── login/
│   │   ├── orders/
│   │   ├── payment/
│   │   │   ├── create-order/
│   │   │   └── verify/
│   │   ├── products/
│   │   └── signup/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
├── models/
├── public/
├── package.json
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/VIAKSHSAM/TreFood.git
```

### 2. Navigate to Project Directory

```bash
cd TreFood
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root directory.

Add your configuration:

```env
MONGODB_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Add any additional authentication secrets required by your application.

Never upload actual credentials or secret keys to GitHub.

### 5. Run Development Server

```bash
npm run dev
```

Open the following address in your browser:

```text
http://localhost:3000
```

### 6. Production Build

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Future Improvements

The following improvements are proposed for future development:

- Mobile application for Android and iOS
- Real-time order tracking
- Push notifications for order updates
- Restaurant and vendor management
- Customer ratings and reviews
- Discount coupons and promotional offers
- Improved sales forecasting and analytics
- Improved security and role-based access control
- Better performance and scalability

## My Proposed Contributions

My vision for TreFood is to develop it into a reliable and convenient food ordering platform for the campus community.

I would like to contribute through:

- Improving the overall customer experience
- Introducing useful features based on student feedback
- Improving the admin management system
- Making the platform faster and more responsive
- Enhancing payment and order management workflows
- Continuously identifying and fixing bugs
- Supporting future feature development and maintenance

## Project Goals

- Build a practical food ordering solution.
- Simplify food ordering for customers.
- Make restaurant operations easier through an admin dashboard.
- Provide a reliable online payment experience.
- Create a platform that can be improved and expanded over time.

## Developer

**Vikash Kumar**

MCA Data Science

National Institute of Technology Patna

GitHub: VIAKSHSAM

## Acknowledgement

TreFood is developed as a prototype project for the TreFood recruitment assignment.

The project represents an effort to combine web development, database management, payment integration, and practical problem-solving into one application.