# PDF Perfect 🎯

![PDF Perfect](https://img.shields.io/badge/PDF-Perfect-purple?style=for-the-badge)
![Fastify](https://img.shields.io/badge/Fastify-Backend-black?style=for-the-badge&logo=fastify)
![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)
![Redis](https://img.shields.io/badge/Redis-Queue-red?style=for-the-badge&logo=redis)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)

**Enterprise-grade Scalable PDF Processing SaaS.**

PDF Perfect implements a robust full-stack architecture capable of handling heavy workloads. It features a distributed backend, background job processing, and cloud storage integration.

## ✨ Architecture

- **Backend**: Fastify Connect (Node.js) for high-performance API.
- **Queue System**: BullMQ + Redis for reliable background job processing and scalability.
- **Storage**: S3-compatible object storage (MinIO locally, AWS S3 via config).
- **Load Balancing**: NGINX configured for horizontal scaling.
- **Worker Nodes**: Dedicated microservices for CPU-intensive PDF operations.

## ✨ Features

- **Merge PDF**: Combine multiple files into one.
- **Split PDF**: Extract specific pages or split documents.
- **Compress PDF**: Reduce file size while maintaining quality.
- **Convert to PDF**: Support for Word, Excel, PowerPoint, and Images.
- **PDF to Images**: Convert PDF pages to high-quality images.
- **Security**: Password protect and Unlock PDFs.
- **Edit & Organize**: Add watermarks, page numbers, rotate/delete pages, and edit metadata.
- **Advanced Tools**: Flatten forms, Extract text, and OCR scanning.
- **Signature**: Sign PDFs digitally.

## 🚀 Deployment

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)

### Quick Start (Docker)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Indrajithinna/PDF-Perfect.git
   cd PDF-Perfect
   ```

2. **Start the stack**
   ```bash
   docker-compose up --build -d
   ```

   This will spin up:
   - **Nginx** (Load Balancer): http://localhost:8080
   - **API Services** (Replicas: 3): Internal port 3000
   - **Worker Services** (Replicas: 2): Background processing
   - **Redis**: Queue storage
   - **MinIO**: S3 Storage (Console: http://localhost:9001)

3. **Verify Status**
   ```bash
   docker-compose ps
   ```

### Local Development

If you want to run services individually without Docker (not recommended for full stack testing):

1. **Start Redis & MinIO** (using Docker is easiest for infra)
   ```bash
   docker-compose up -d redis minio createbuckets
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start Worker**
   ```bash
   cd worker
   npm install
   npm run dev
   ```

4. **Start Frontend**
   ```bash
   # From root
   npm install
   npm run dev
   # Access at http://localhost:5173
   ```

## 🛠️ API Endpoints

- `POST /api/upload`: Upload PDF and image assets. Triggers a background job.
- `GET /api/status/:jobId`: Poll job status. Returns progress and download URL when complete.
- `WS /ws/status/:jobId`: Real-time WebSocket status updates.

## 🧪 Stress Testing

We provide an `autocannon` script to verify performance targets.

```bash
npm install -g autocannon
autocannon -c 100 -d 10 http://localhost:8080
```

To test the full upload flow under load, use the custom script provided in `scripts/stress-test.js`.

## 🔒 Security

- Basic JWT Authentication (Configurable)
- Rate Limiting enabled (Fastify Rate Limit)
- S3 Presigned URLs for secure file access

## 📝 License

MIT License
