# Samir Qureshi Portfolio — Standalone Backend API

Standalone Express + Nodemailer REST API service for handling contact form dispatches and automated email notifications with authenticated Google Gmail SMTP.

## 📁 Directory Structure
```
backend/
├── .env                # Private SMTP Credentials
├── package.json        # Backend dependencies & start scripts
├── server.js           # Main Express server & email router
└── README.md           # Backend documentation
```

## 🚀 Running Independently

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables (`backend/.env`)
```env
PORT=5000
GMAIL_USER=qureshsamir145@gmail.com
GMAIL_APP_PASSWORD=zhlxkzojpdlxkxtx
```

### 3. Start the Server
```bash
npm start
# Server listens on http://localhost:5000
```

## 🔌 API Endpoints
- `GET /api/health`: Healthcheck & SMTP status.
- `POST /api/contact`: Dispatches notification email to Samir and sends automated confirmation to the sender.
