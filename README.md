# NiceBar – Headless E-commerce & Blog Platform

**NiceBar** is a modern, fully responsive Headless Commerce web application that combines the functionalities of an online bartending equipment store with an educational module (blog).

Built from scratch using the **MERN** stack (MongoDB, Express.js, React, Node.js), this project demonstrates the ability to design a scalable architecture that decouples the presentation layer from the business logic. The application solves real-world e-commerce challenges by integrating secure payments (**Stripe API**), intelligent product recommendations (**Google Gemini AI**), and an advanced session-based authentication system.

The entire environment is containerized using **Docker**, ensuring deterministic execution and easy deployment.

## ✨ Key Features

### 🛒 E-commerce & Payments
* **Cart Management:** Asynchronous order value calculation and inventory control (blocking purchases of out-of-stock products).
* **Secure Transactions:** Full integration with the **Stripe API** (PaymentIntents), ensuring compliance with security standards and support for test credit cards.
* **Logistics Process:** Order status tracking (e.g., Processing, Shipped) updated directly from the admin panel.

### 🧠 AI Integration (Google Gemini)
* **Smart Cross-selling:** Utilizing generative AI models to analyze blog post content and automatically suggest contextually related products (e.g., recommending a specific shaker under an article about drink preparation).

### 🔒 Security & Authorization (RBAC)
* **Session Authentication:** Implementation of `httpOnly` cookies (Express-Session + Connect-Mongo) to mitigate XSS attacks, providing a much more secure alternative to storing tokens in `localStorage`.
* **User Roles:** Granular Role-Based Access Control (RBAC) dividing permissions between regular Customers and Administrators (CMS access).

### ⚙️ Custom CMS (Admin Panel)
* **Product Management (CRUD):** Adding inventory, handling image uploads (Multer), and modifying prices and descriptions.
* **Order & User Management:** Full visibility into transactions, delivery statuses, and client accounts.

## 🛠 Technology Stack & Architecture

**Frontend (Client-side):**
* **React.js & Vite** – Fast building and rendering of the UI (SPA).
* **Tailwind CSS & Shadcn/ui** – Responsive and modern styling system.
* **React Router & Axios** – Client-side routing and REST API communication.
* **Stripe.js** – Secure payment interface components.

**Backend (Server-side):**
* **Node.js & Express.js** – Stateless REST API handling business logic.
* **MongoDB & Mongoose** – NoSQL database perfectly suited for dynamic e-commerce product structures.
* **Bcrypt & Express-Session** – Password security and identity management.
* **Multer** – Middleware for handling file uploads.

**Integrations & DevOps:**
* **Docker & Docker Compose** – Containerization of the development environment.
* **Stripe API** – Payment gateway.
* **Google Gemini API** – AI recommendation engine.

## 🚀 Local Setup

The project uses containerization, which significantly simplifies the startup process.

> **Important:** The application requires external services (MongoDB, Stripe, Gemini). You must configure the environment variables before running it.

**1. Clone the repository:**
```bash
git clone https://github.com/Lebron02/NiceBar
cd NiceBar
```

**2. Configure environment variables:**
Create a .env file in the root directory based on the provided .env.example file and fill it with your own access keys:
```bash
MONGO_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_test_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
SESSION_SECRET=your_random_secret_string
```

**3. Run the environment using Docker**
```bash
docker-compose up --build
```

The client application (Frontend) will be available at: **http://localhost:5173**<br>
The server (API) is listening at: **http://localhost:5000**

Project developed as an Engineering Thesis (Software Engineering) by Szymon Adamczyk.
