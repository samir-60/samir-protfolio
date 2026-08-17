# 🛡️ Samir Qureshi Portfolio — High-Security Django REST API

Enterprise-grade, hardened Django REST Framework backend service for handling high-security contact dispatching, anti-spam throttling, XSS sanitization, and dual Gmail SMTP delivery.

## 🔒 Cybersecurity Hardening Features
- **Rate Limiting / Anti-Spam Throttling**: Restricts contact requests to maximum 5 requests/minute per IP to prevent spam and DoS attacks.
- **XSS & Injection Protection**: HTML sanitization and entity escaping on all user-submitted fields (`name`, `subject`, `message`).
- **Strict Headers & Armor**: `X-Frame-Options: DENY`, `SECURE_CONTENT_TYPE_NOSNIFF`, `SECURE_BROWSER_XSS_FILTER`.
- **Dual Encrypted Gmail SMTP Delivery**:
  - Direct alert dispatched to `qureshsamir145@gmail.com` with sender details and reply-to headers.
  - Branded automatic confirmation receipt delivered to the visitor.

---

## 🚀 Running Django Backend Independently

### 1. Activate Environment & Run Migrations
```bash
# Windows PowerShell
.\django_backend\.venv\Scripts\Activate.ps1
python django_backend\manage.py migrate
```

### 2. Start Django Secure Server
```bash
python django_backend\manage.py runserver 8000
```

### 3. API Endpoints
- `GET /api/health/`: Real-time system health and security status probe.
- `POST /api/contact/`: Secure contact dispatch endpoint.
