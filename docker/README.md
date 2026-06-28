# NestJS Boilerplate - Docker

NestJS boilerplate with Docker, MySQL, and Makefile support.

## Features

* NestJS
* Docker & Docker Compose
* MySQL 8.4
* Automatic `.env` generation from `.env.example`
* Automatic JWT secret generation
* Makefile for common development commands
* Hot reload development environment

---

## Requirements

* Docker
* Docker Compose
* Make

Verify installation:

```bash
docker --version
docker compose version
make --version
```

---

## Getting Started

Clone repository:

```bash
git clone <repository-url>
cd <project-name>
```

Start the application:

```bash
make up
```

On the first run, the project will automatically:

* Create `.env` from `.env.example`
* Generate `JWT_SECRET`
* Generate `JWT_REFRESH_SECRET`
* Build Docker images
* Start all containers

Application URL:

```text
http://localhost:3000
```

---

## Available Services

| Service            | Port |
| ------------------ | ---- |
| NestJS Application | 3000 |
| MySQL              | 3306 |

---

## Environment Variables

Example `.env.example`:

```env
APP_PORT=3000

DB_HOST=mysql
DB_PORT=3306
DB_NAME=nestjs
DB_USERNAME=nestjs
DB_PASSWORD=password
DB_ROOT_PASSWORD=rootpassword

JWT_SECRET=changeme
JWT_REFRESH_SECRET=changeme
```

---

## Make Commands

### Start containers

```bash
make up
```

### Stop containers

```bash
make stop
```

### Start existing containers

```bash
make start
```

### Restart containers

```bash
make restart
```

### Remove containers

```bash
make down
```

### Rebuild images and containers

```bash
make rebuild
```

### Reset containers and volumes

Warning: this command removes database volumes.

```bash
make reset
```

### Build images only

```bash
make build
```

### Show running containers

```bash
make ps
```

### Show all logs

```bash
make logs
```

### Show application logs only

```bash
make app-logs
```

### Open shell inside application container

```bash
make shell
```

### Install dependencies

```bash
make install
```

### Run development server

```bash
make dev
```

### Run production server

```bash
make prod
```

### Build NestJS application

```bash
make build-app
```

### Run tests

```bash
make test
```

### Run linter

```bash
make lint
```

### Format code

```bash
make format
```

### Remove containers and volumes

```bash
make clean
```

---

## Project Structure

```text
.
├── src
├── Dockerfile
├── docker-compose.yml
├── Makefile
├── .env.example
├── package.json
└── README.md
```

---

## Database Connection

The application connects to MySQL using the Docker service name:

```env
DB_HOST=mysql
```

Do not use:

```env
DB_HOST=localhost
```

because `localhost` inside Docker refers to the application container itself.

---

## Development Workflow

Start project:

```bash
make up
```

Check logs:

```bash
make logs
```

Open container shell:

```bash
make shell
```

Install package:

```bash
make install
```

Rebuild after Dockerfile changes:

```bash
make rebuild
```

Reset everything including database:

```bash
make reset
```

---

## License

MIT
