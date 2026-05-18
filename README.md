# NoCollege-Docker 🚀

A full-stack Dockerized educational notes sharing platform built using React, Spring Boot, MySQL, and Microservices architecture.

## 🌟 Features

* User Authentication & JWT Security
* OTP Verification System
* AI Chat Assistant Integration
* Upload & Download Notes
* Bookmark Notes
* Real-time Chat System
* Notification Microservice
* Premium Plans & Razorpay Integration
* Admin Feedback & Reports Management
* Dockerized Multi-Container Architecture
* Cloud Deployment Ready

---

# 🏗️ Architecture

## Frontend

* React.js
* Tailwind CSS
* Axios

## Backend

* Spring Boot
* Spring Security
* JWT Authentication
* REST APIs
* WebSocket Chat

## Database

* MySQL

## Microservices

* Notification Service
* Email OTP Service

## DevOps

* Docker
* Docker Compose
* Environment Variables

---

# 📦 Project Structure

```text
NoCollege-Docker
│
├── frontend
│   └── React Frontend
│
├── backend
│   └── Spring Boot Main Backend
│
├── backend-notification-microservice1
│   └── Notification Microservice
│
├── docker-compose.yml
├── .env
└── .gitignore
```

---

# 🔐 Environment Variables

Create a `.env` file in the root directory.

```env
DB_USERNAME=root
DB_PASSWORD=your_password

GROQ_API_KEY=your_api_key

RAZORPAY_KEY=your_key
RAZORPAY_SECRET=your_secret
```

---

# 🐳 Docker Setup

## Build & Run

```bash
docker compose up --build
```

## Run in Background

```bash
docker compose up -d
```

## Stop Containers

```bash
docker compose down
```

---

# 🌐 Ports

| Service              | Port |
| -------------------- | ---- |
| Frontend             | 3000 |
| Backend              | 8080 |
| Notification Service | 8081 |
| MySQL                | 3307 |

---

# ☁️ Deployment

## Frontend

* Vercel

## Backend

* Render

## Database

* Railway MySQL

---

# 🔥 Key Highlights

* Production-style Docker setup
* Secure environment variable management
* Multi-container architecture
* Cloud deployment ready
* Scalable backend design
* Resume-worthy full stack project

---

# 🚀 Future Improvements

* Kubernetes Deployment
* CI/CD Pipelines
* Nginx Reverse Proxy
* SSL/HTTPS Setup
* Redis Caching
* AWS Deployment
* Monitoring & Logging

---

# 👨‍💻 Author

**Anurag Jadoun**

Full Stack Java Developer

---

# ⭐ Support

If you like this project, give it a star on GitHub ⭐
