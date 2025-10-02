# 📦 TrendyTreasures – E-Commerce Microservices Platform

## 📖 Overview
**TrendyTreasures** is a modular **e-commerce platform** designed with **microservices architecture**. 
It simulates a real-world distributed retail ecosystem with separate services for **Products, Inventory, Orders, Cart, and Authentication**.  
Each service operates independently, communicates over **REST APIs**, and is orchestrated by an **API Gateway** for unified access.

This project demonstrates my ability to design **scalable systems**, implement **secure authentication flows**, 
and build **role-based access controls (RBAC)** across distributed services, while being extensible for future containerization and cloud deployment.

---

## ✨ Key Features
- **Independent Microservices** → Products, Inventory, Orders, Cart, Auth.  
- **Authentication & Security** → JWT-based auth, OAuth-inspired authorization, RBAC enforcement.  
- **API Gateway Layer** → Centralized routing with REST-based inter-service communication.  
- **Admin Controls** → Restricted endpoints for inventory/product updates and order management.  
- **Scalable & Extensible** → Loosely coupled services, designed for independent updates and future containerization.  

---

## 🏗️ Architecture
```
          ┌──────────┐       ┌─────────────┐
          │  Client  │ <–––> │ API Gateway │
          └──────────┘       └──────┬──────┘
                                     │
   ┌──────────┬───────────┬──────────┴───────────┐
   │ Products │ Inventory │   Orders   │   Auth   │
   └──────────┴───────────┴──────────┬───────────┘
                                     │
                                 MongoDB
```

---

## 🏗️ Tech Stack
- **Frontend**: React.js  
- **Backend**: Node.js, Express.js, Python Flask  
- **Database**: MongoDB  
- **Auth**: JWT, OAuth-inspired flows  
- **Other Tools**: Git, Postman, JSON-Server (for local mocks)  

---

## 📂 Folder Structure (example)
```
TrendyTreasures/
│── api-gateway/
│   ├── index.js
│   ├── routes/
│── services/
│   ├── products/
│   │   ├── app.js
│   │   ├── routes/
│   │   ├── models/
│   ├── inventory/
│   ├── orders/
│   ├── cart/
│   ├── auth/
│── frontend/ (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
```

---

## ⚙️ Getting Started
**Clone the repository**
```bash
git clone https://github.com/yourusername/trendytreasures.git
cd trendytreasures
```

**Install dependencies**
For each service (Products, Inventory, Orders, Cart, Auth, API Gateway, Frontend):
```bash
cd service-name
npm install
```

**Run services**
```bash
npm start
```

**Access Frontend**
👉 `http://localhost:3000`

---

## ⚡ Challenges & Learnings
- Designing clear **service boundaries** (e.g., Products vs Inventory).  
- Implementing **RBAC enforcement** and securing admin routes.  
- Managing **consistent JWT authentication** across services.  
- Understanding **API Gateway patterns** and their role in simplifying inter-service communication.  

---

## 🚀 Future Enhancements
- Containerize services with **Docker** and orchestrate with **Kubernetes**.  
- Add **service discovery & load balancing**.  
- Replace REST with **message queues (RabbitMQ/Kafka)** for async workflows.  
- Add a **Payment Service** and extend **analytics dashboards** for admins.  
- Set up **CI/CD pipelines** for automated testing and deployment.  
