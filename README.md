Here is your updated, fully customized `README.md` file reflecting the **SINEX Earn** branding, live Vercel deployments, production configuration, and GitHub details without omitting any setup or dependency information:

```markdown
# Project Name: SINEX Earn

## SINEX Earn - Micro-Task and Earning Platform

Welcome to **SINEX Earn**! This MERN-stack application provides a seamless experience for users to perform, create, and manage micro-tasks while earning and managing platform coins. The platform supports three distinct user roles: **Worker**, **Buyer**, and **Admin**, each with tailored functionalities for an engaging and efficient tasking ecosystem.

---

# Admin Credentials

- **Admin Email:** `admin@sinex.com`
- **Initial Password:** Configured via Firebase Authentication console or admin invitation flow.

---

# 🌟 Live Production URLs

- **Frontend Application:** [https://earn-money-rose.vercel.app](https://earn-money-rose.vercel.app)
- **Backend API:** [https://earn-money-server-inky.vercel.app](https://earn-money-server-inky.vercel.app)

---

# 🚀 Features

## 1. Three User Roles:
* **Worker:** Completes micro-tasks, submits proof of completion, tracks earnings, and requests coin withdrawals.
* **Buyer:** Posts tasks with coin rewards, reviews worker submissions, approves/rejects proofs, and purchases coins.
* **Admin:** Oversees platform operations, manages user accounts and role assignments, monitors system activity, and addresses reported issues.

## 2. Authentication System:
* Secure registration with role selection (Worker vs. Buyer).
* Authentication powered by Firebase Auth (Email/Password & Google Sign-In).
* Client-side session persistence and token verification via serverless middleware.

## 3. Dynamic Homepage & UI:
* Hero section highlighting key platform benefits.
* "Best Workers" showcase ranking top contributors by earnings.
* Responsive, modern user interfaces built with React, Vite, and Tailwind CSS.

## 4. Responsive Design:
* Full layout optimization across mobile devices, tablets, and desktop browsers, including all role-based dashboards.

## 5. Worker Dashboard:
* Displays total submissions, pending approvals, and net coin earnings.
* Micro-task browsing in card views with task details and submission forms.

## 6. Buyer Dashboard:
* Overview of active tasks, pending submission reviews, and payment history.
* Task creation, updating, deletion, and coin checkout interface.

## 7. Admin Dashboard:
* User management table to search, inspect, and update user roles.
* System analytics and platform monitoring.

## 8. Secure Data Handling & Integration:
* MongoDB Atlas database connection with serverless connection pooling.
* Strict environment variable separation for secrets across Vercel deployments.
* Robust client and server input validation.

## 9. Payments:
* Integrated coin acquisition flows using Stripe.
* Fallback payment options for environment testing.

## 10. Notifications and Real-Time Updates:
* Worker alerts upon task approval or payout process.
* Buyer alerts upon new task submissions from workers.

---

# 📦 Dependencies

| Package | Version | Description |
| :--- | :--- | :--- |
| `@headlessui/react` | ^2.2.0 | UI components for accessible design |
| `@smastrom/react-rating` | ^1.5.0 | Star rating component for React |
| `@stripe/react-stripe-js` | ^3.1.1 | React bindings for Stripe.js |
| `@stripe/stripe-js` | ^5.5.0 | Official Stripe.js client SDK |
| `@tanstack/react-query` | ^5.64.1 | Data-fetching and state management |
| `apexcharts` | ^4.3.0 | Data visualization charting library |
| `axios` | ^1.7.9 | Promise-based HTTP client |
| `firebase` | ^11.1.0 | Firebase Client SDK for web apps |
| `localforage` | ^1.10.0 | Offline storage utility |
| `match-sorter` | ^8.0.0 | Array filtering and string matching |
| `motion` | ^11.18.0 | React animation library |
| `react` | ^18.3.1 | Core UI library |
| `react-apexcharts` | ^1.7.0 | React wrapper for ApexCharts |
| `react-countup` | ^6.5.3 | Animated counter UI component |
| `react-datepicker` | ^7.6.0 | Date picker UI component |
| `react-dom` | ^18.3.1 | React DOM renderer |
| `react-hook-form` | ^7.54.2 | Form state and validation library |
| `react-hot-toast` | ^2.5.1 | Notification toast management |
| `react-icons` | ^5.4.0 | SVG icon library for React |
| `react-router-dom` | ^7.1.1 | Client-side routing engine |
| `react-scroll-trigger` | ^0.6.14 | Scroll event detection utility |
| `recharts` | ^2.15.0 | Modular charting library |
| `sort-by` | ^1.2.0 | Array sorting utility |
| `swiper` | ^11.2.1 | Touch slider carousel library |

To install all dependencies, run:
```sh
npm install

```

---

# 🛠️ Run the Project Locally

Follow the steps below to set up and run **SINEX Earn** on your local machine.

## 📌 Prerequisites

Ensure you have the following installed:

* **Node.js** (v18+ recommended)
* **Git**
* **Firebase Account** (Project ID: `earn-money-34177`)
* **MongoDB Atlas Account**

---

## 🚀 Local Development Setup

### 1️⃣ Clone the Repositories

**Frontend Repository:**

```sh
git clone [https://github.com/SirArleayous/earn-money.git](https://github.com/SirArleayous/earn-money.git)
cd earn-money

```

**Backend Repository:**

```sh
git clone [https://github.com/SirArleayous/earn-money-server.git](https://github.com/SirArleayous/earn-money-server.git)
cd earn-money-server

```

---

### 2️⃣ Install Dependencies

For each folder (`earn-money` and `earn-money-server`), run:

```sh
npm install

```

---

### 3️⃣ Configure Environment Variables

#### Frontend `.env` (in root of `earn-money`):

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_test_51MockStripeKeyForTestingOnly00000000000000000000000000000000000000000000000000000000000

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyA6h9LLdboTnX6FUeCh_sEa4fBpZQmaM-Y
VITE_FIREBASE_AUTH_DOMAIN=sinex-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=earn-money-34177
VITE_FIREBASE_STORAGE_BUCKET=sinex-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789000
VITE_FIREBASE_APP_ID=1:123456789000:web:abcdef123456

```

#### Backend `.env` (in root of `earn-money-server`):

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
CLIENT_ORIGINS=http://localhost:5173,[https://earn-money-rose.vercel.app](https://earn-money-rose.vercel.app)
ADMIN_EMAIL=admin@sinex.com
ALLOW_DUMMY_PAYMENTS=true
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

```

---

### 4️⃣ Start Local Development Servers

**Start Backend API:**

```sh
cd earn-money-server
npm run dev

```

**Start Frontend Application:**

```sh
cd earn-money
npm run dev

```

The application will be accessible at:
👉 **Frontend:** `http://localhost:5173`

👉 **Backend API:** `http://localhost:5000`

---

# ☁️ Vercel Deployment Settings

### Serverless Backend Settings (`earn-money-server`)

* **Framework Preset:** Other / Node.js
* **Build Command:** None required (`vercel.json` routes requests to `index.js` via `@vercel/node`)
* **Package Override:** Uses `"overrides": { "jose": "^4.15.5" }` in `package.json` to ensure compatibility with Vercel's serverless runtime environment.

### React Frontend Settings (`earn-money`)

* **Framework Preset:** Vite
* **Build Command:** `npm run build`
* **Output Directory:** `dist`

---

# 📄 License

This project is licensed under the ISC License. Developed for **SirArleayous / SINEX**.

```

```
