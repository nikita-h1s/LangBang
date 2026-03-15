## LangBang: Full-Stack Language Learning Platform

LangBang is a language learning application that aims to offer a structured course, exercises, and gamified achievements to keep learners motivated.

The application has a service-oriented architecture to manage complicated business logic, including course management, real-time progress management, and an automated achievement system to reward users when they finish exercises and collect points.

## 🛠 Tech Stack
Runtime: Node.js

Language: TypeScript

Database: PostgreSQL

ORM: Prisma

Authentication: JWT with Refresh Token rotation

## ✨ User Features
- Structured courses with lessons and exercises
- Real-time progress tracking
- Gamified achievement system
- Secure user authentication

## 🚀 Key Technical Features

### Concurrency-Safe Sequencing
- Lesson and exercise ordering system built with Prisma transactions.
- Uses Serializable isolation level to prevent race conditions.
- Custom retry logic handles transient P2034 write conflicts.

### Asynchronous Achievement Engine
- Gamification logic runs asynchronously after exercise completion.
- Evaluates milestones such as total exercises completed and total points earned.
- Keeps the main request-response cycle fast and responsive.

### Progress Analytics
- Real-time completion tracking for lessons and courses.
- Aggregates exercise results to determine mastery of lesson content.

### Secure Identity Management
- JWT authentication with access and refresh token rotation.
- Role-Based Access Control (RBAC) for administrative actions.

## 🏗 Architecture
The project follows a Layered Service Architecture:

Services: Encapsulate business logic (e.g., achievements.service.ts, courses.service.ts).

Middleware: Handles request validation and authentication.

Database Layer: Prisma ORM for type-safe data access and migrations.

## 📘 API Documentation

The API documentation is available via Swagger UI.

You can explore and test the endpoints here:

[https://lang-bang.vercel.app/api-docs](https://lang-bang.vercel.app/api-docs/)

## 🔧 Installation & Setup

Follow the steps below to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/nikita-h1s/LangBang
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the project root and configure the following environment variables:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### 4. Run database migrations

Apply database migrations using Prisma:

```bash
npx prisma migrate dev
```

### 5. Start the development server

```bash
npm run dev
```

The server should now be running locally. 🚀

