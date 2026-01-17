# InstaApp - Instagram Clone

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.x-red" alt="Laravel">
  <img src="https://img.shields.io/badge/React-18.x-blue" alt="React">
  <img src="https://img.shields.io/badge/Inertia.js-2.0-purple" alt="Inertia">
  <img src="https://img.shields.io/badge/Docker-✓-blue" alt="Docker">
</p>

Aplikasi social media mirip Instagram yang dibangun dengan Laravel 12, Inertia.js, React 18, dan Docker.

## 🚀 Fitur

- ✅ **Autentikasi** - Register, Login, Logout dengan Laravel Breeze
- ✅ **Posting** - Buat post dengan text dan gambar
- ✅ **Like** - Like/unlike post
- ✅ **Komentar** - Komentar pada post
- ✅ **Hak Akses** - Policy untuk post, like, dan komentar
- ✅ **API Backend** - RESTful API
- ✅ **Modern Frontend** - React dengan Inertia.js
- ✅ **Docker** - Containerized development environment

## 🛠 Tech Stack

### Backend
- **Laravel 12** - PHP Framework
- **MySQL 8.0** - Database
- **Redis** - Cache & Session
- **Laravel Sanctum** - API Authentication
- **Laravel Breeze** - Authentication Scaffolding

### Frontend
- **React 18** - UI Library
- **Inertia.js 2.0** - Modern Monolith
- **TailwindCSS 3** - Utility-first CSS
- **Headless UI** - Accessible UI Components
- **Vite** - Build Tool

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web Server

## 📋 Prerequisites

Pastikan Anda sudah menginstall:
- **Docker Desktop** (untuk macOS/Windows) atau **Docker Engine** (untuk Linux)
- **Docker Compose** v2.0+
- **Git**

## 🔧 Setup & Installation

### 1. Clone Repository (jika belum)

```bash
git clone https://github.com/MuhammadHatta72/insta-app
cd insta-app
```

### 2. Setup Environment

Salin file environment:
```bash
cp .env.example .env
```

File `.env` sudah dikonfigurasi untuk Docker dengan setting berikut:
- Database: MySQL (host: `db`)
- Redis: Cache & Session (host: `redis`)
- App URL: `http://localhost:8000`

### 3. Build & Start Docker Containers

```bash
docker-compose up -d
```

Ini akan menjalankan containers:
- **app** - PHP-FPM (port internal)
- **nginx** - Web Server (port 8000)
- **db** - MySQL (port 3307)
- **redis** - Redis (port 6380)
- **node** - Vite Dev Server (untuk hot reload)

### 4. Install Dependencies

Masuk ke container app:
```bash
docker exec -it instaapp bash
```

Install PHP dependencies:
```bash
composer install
```

Generate application key:
```bash
php artisan key:generate
```

### 5. Setup Database

Jalankan migrations:
```bash
php artisan migrate
```

Seed database (optional):
```bash
php artisan db:seed
```

### 6. Setup Storage

Buat symbolic link untuk storage:
```bash
php artisan storage:link
```

Set permissions:
```bash
chmod -R 775 storage bootstrap/cache
```

### 7. Keluar dari Container

```bash
exit
```

### 8. Akses Aplikasi

Buka browser dan akses:
```
http://localhost:8000
```
