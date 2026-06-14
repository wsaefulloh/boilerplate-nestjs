# 🚀 Boilerplate NestJS
  <img src="https://img.shields.io/badge/GitHub-Template-blue" alt="Template" />
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <img src="https://img.shields.io/badge/node-%3E%3D20.19-brightgreen" alt="Node Version" />
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/badge/npm-v10.8.2-blue" alt="NPM Version" /></a>
  <img src="https://img.shields.io/badge/TypeScript-v5.9-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TypeORM-v0.3.x-2D3748" alt="TypeORM" />

## NestJS + TypeORM + MySQL Starter Template

A production-ready NestJS boilerplate featuring JWT Authentication, TypeORM, MySQL, Database Migrations, Winston Logging, Rate Limiting, Global Exception Handling, and Jest Testing.
This project provides a scalable and maintainable foundation for building modern REST APIs using NestJS while following best practices for security, logging, testing, and database management.

> 💡 This repository is a GitHub Template. Click **Use this template** to create a new project with all configurations and best practices already set up.
---

## ✨ Features

### 🔐 Authentication & Security

* JWT Authentication
* Passport JWT Strategy
* Route Protection with Guards
* Password Hashing using bcrypt
* Rate Limiting with NestJS Throttler
* Cookie Parser Support

### 🗄 Database

* TypeORM Integration
* MySQL Support
* SQLite Support (Development & Testing)
* Entity Relationships
* Database Migration Management

### 🏗 Architecture

* Modular Architecture
* DTO Validation
* Global Exception Filter
* Standardized API Response Interceptor
* Environment-Based Configuration

### 📊 Logging

* Winston Logger Integration
* Centralized Logging Service
* Structured Application Logs

### 🧪 Testing

* Jest Unit Testing
* End-to-End Testing Support
* Coverage Reports

### ⚙️ Developer Experience

* ESLint
* Prettier
* Husky Git Hooks
* Commitlint

---

## 📁 Project Structure

```text
src/
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   └── transform.interceptor.ts
│   ├── loggers/
│   │   ├── logger.module.ts
│   │   └── logger.service.ts
│   └── utils/
│       └── password.util.ts
│
├── config/
│   ├── app.config.ts
│   └── database.config.ts
│
├── database/
│   ├── migrations/
│   └── data-source.ts
│
├── modules/
│   ├── auth/
│   ├── user/
│   └── product/
│
├── app.module.ts
└── main.ts
```

---

## 🛠 Tech Stack

| Technology      | Purpose                     |
| --------------- | --------------------------- |
| NestJS          | Backend Framework           |
| TypeORM         | ORM                         |
| MySQL           | Relational Database         |
| SQLite          | Local Development & Testing |
| JWT             | Authentication              |
| Passport        | Authentication Strategy     |
| Winston         | Logging                     |
| Jest            | Testing                     |
| Class Validator | Request Validation          |
| Throttler       | Rate Limiting               |

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/wsaefulloh/boilerplate-nestjs.git

cd boilerplate-nestjs
```

Install dependencies:

```bash
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root.

Example:

```env
APP_NAME=Boilerplate NestJS
APP_PORT=3000
NODE_ENV=development

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=DB_USERNAME
DB_PASSWORD=DB_PASSWORD
DB_NAME=DB_NAME
DB_TIMEZONE=+07:00
TZ=Asia/Jakarta

JWT_SECRET=JWT_SECRET
JWT_EXPIRES_IN=30s
JWT_REFRESH_SECRET=JWT_REFRESH_SECRET
JWT_SECRET_EXPIRES_IN=120s

COOKIE_DOMAIN=localhost
```

Adjust values according to your environment.

---

## 🚀 Running the Application

### Development

```bash
npm run start:dev
```

### Debug Mode

```bash
npm run start:debug
```

### Production

```bash
npm run build

npm run start:prod
```

---

## 🗄 Database Migration

### Generate Migration

```bash
npm run migration:generate --name=CreateProductsTable
```

### Run Migration

```bash
npm run migration:run
```

### Revert Migration

```bash
npm run migration:revert
```

---

## 🔐 Authentication

This boilerplate includes JWT-based authentication.

Protected endpoints require a valid Bearer Token:

```http
Authorization: Bearer <access_token>
```

Authentication module includes:

* Register
* Login
* JWT Strategy
* JWT Guard
* Password Hashing

---

## 👤 User Module

Example CRUD operations:

* Create User
* Get User Detail
* Update User
* Delete User

---

## 📦 Product Module

Example CRUD operations:

* Create Product
* Get Products
* Get Products by Users
* Get Product Detail
* Update Product
* Delete Product

---

## 📊 Logging

Application logging is powered by Winston.

Features:

* Application Logs
* Error Logs
* Centralized Logging Service

---

## ⚠️ Exception Handling

Global exception handling is implemented through:

```text
common/filters/http-exception.filter.ts
```

This ensures a consistent error response structure across the application.

---

## 🔄 API Response Transformation

API responses are standardized using:

```text
common/interceptors/transform.interceptor.ts
```

This helps maintain consistent response formats throughout the application.

---

## 🧪 Testing

Run E2E tests:

```bash
npm run test:e2e
```

---

## 📚 API Documentation

A Postman collection is available at:

```text
Bolierplate NestJs by Wahyu Saefulloh.postman_collection.json
```

---

## 📄 License

This project is licensed under the MIT License.
