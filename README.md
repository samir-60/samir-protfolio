<div align="center">

# ⚡ Samir Qureshi — Enterprise Developer & Cyber Portfolio

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Django](https://img.shields.io/badge/Django-6.1-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Security](https://img.shields.io/badge/Cybersecurity-Hardened-0ea5e9?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/samir-60/samir-protfolio)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <strong>Computer Science & Engineering Undergraduate at Metropolitan University, Sylhet</strong><br />
  <em>Full-Stack Web Developer • Cybersecurity Specialist • Tech Entrepreneur</em>
</p>

[**🌐 Explore Live Portfolio**](https://github.com/samir-60/samir-protfolio) • [**📱 WhatsApp Contact**](https://wa.me/8801725198663) • [**📧 Direct Email**](mailto:qureshsamir145@gmail.com)

---

</div>

## 🌟 Executive Overview

A modern, high-performance, and **enterprise cybersecurity-hardened portfolio web platform** built for **Samir Qureshi**. Featuring a high-fidelity 3D Three.js interactive canvas, an ultra-dynamic IP & country-wise sliding telemetry HUD capsule, authentic venture UI mockups, real-time GitHub repository auto-synchronization, and a fully decoupled **High-Security Django REST Framework API** with authenticated Google Gmail SMTP mailers.

---

## 🚀 Key Architectural Features

### 1. 🛡️ High-Security Django REST Backend (`django_backend/`)
- **Scoped Anti-Spam Throttling**: Restricts contact requests to **5 requests/minute** per IP (`ScopedRateThrottle`) to mitigate botnet spam and DoS attempts.
- **XSS & Injection Protection**: HTML sanitization and entity escaping on all user-submitted fields (`name`, `subject`, `message`).
- **Strict Security Armor**: Enforces `X-Frame-Options: DENY`, `SECURE_CONTENT_TYPE_NOSNIFF`, and `SECURE_BROWSER_XSS_FILTER`.
- **Dual Encrypted Gmail SMTP Delivery**:
  - Encrypted TLS alert dispatched directly to `qureshsamir145@gmail.com` with `reply-to` set to visitor.
  - Branded automatic confirmation receipt returned to the sender.

### 2. 🕒 Live IP & Country-Wise Sliding Telemetry HUD Capsule
- **Dynamic Geo-Detection**: Auto-detects visitor IP, City, Country, Flag, and local Timezone.
- **3D Horizontal Sliding Capsule**:
  - 🕒 **Slide 1 — Live Local Clock**: Real-time ticking seconds formatted for visitor's exact timezone.
  - 📅 **Slide 2 — Live Date & Day**: Full calendar day and date (`Monday, Aug 17, 2026`).
  - 🌍 **Slide 3 — Visitor Geolocation & IP**: Flag + `[City], [Country]` + `IP: [Visitor IP]`.
  - 🛡️ **Slide 4 — Secure Node Telemetry**: `Sylhet Edge Node • Latency: 12ms • TLS 1.3 Active`.
- Interactive `‹` / `›` controls, glowing progress pill, and pause-on-hover.

### 3. 🖼️ Authentic Humanly Crafted Project UI Mockups
Tailored high-resolution product screenshots designed specifically for each venture:
- **🌟 Samir Portfolio**: High-end dark mode developer interface with cyber telemetry.
- **🛍️ Softyx Clothing**: Luxury streetwear e-commerce storefront with 3D virtual try-on and body scanner UI.
- **✨ Profix & Shine UK**: British commercial cleaning platform with instant quotation calculator.
- **📚 BiblioDrop**: Digital peer-to-peer library and book exchange web hub.
- **🛡️ Softyx Fraud Radar**: Cybersecurity transaction threat analysis dashboard.
- **🎓 StudySync**: Student productivity workspace with Pomodoro focus timer.

### 4. 💻 Interactive CLI Cyber Terminal
- Fully functional embedded command-line interface supporting commands:
  `help`, `skills`, `projects`, `contact`, `whoami`, `security`, `clear`.

### 5. 📱 100% Responsive Glassmorphism Design
- Mobile-first fluid scaling across all devices (320px — 768px+), zero horizontal overflow, touch gesture sliders, and sound effects engine.

---

## 📁 Repository Structure

```
samir-protfolio/
│
├── 🛡️ django_backend/                 # HIGH-SECURITY DJANGO REST API
│   ├── .venv/                        # Isolated Python Virtual Environment
│   ├── .env.example                  # Environment template
│   ├── manage.py                     # Django management script
│   ├── requirements.txt              # Python dependencies (Django 6.1, DRF 3.18, CORS)
│   ├── core/                         # Django Core Settings & Security Headers
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── api/                          # High-Security API Application
│       ├── serializers.py            # Input validation & XSS sanitization
│       ├── views.py                  # Contact & Health endpoints with Throttling
│       └── urls.py
│
├── 🛡️ backend/                        # ALTERNATIVE NODE.JS EXPRESS BACKEND
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── 🎨 src/                           # FRONTEND SOURCE (VITE SINGLE-PAGE APP)
│   ├── components/                   # Three.js Canvas, GeoTelemetryTicker, Terminal, Modals
│   ├── data/                         # Projects & Experience datasets
│   ├── services/                     # Real-time GitHub auto-sync service
│   ├── main.js                       # Frontend bootstrap & API connector
│   └── style.css                     # Glassmorphism & Cyber styling system
│
├── 🖼️ public/assets/projects/        # Authentic project UI mockups
├── index.html                        # Single Page App Shell
├── vite.config.js                    # Vite configuration with proxy to Django
├── .gitignore                        # Strict secrets & venv protection
└── package.json                      # Unified & independent runner scripts
```

---

## ⚡ Quick Start & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/samir-60/samir-protfolio.git
cd samir-protfolio
```

### 2. Configure Environment Variables
Create `django_backend/.env`:
```env
SECRET_KEY=your-django-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
PORT=8001
GMAIL_USER=qureshsamir145@gmail.com
GMAIL_APP_PASSWORD=your-google-app-password
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 3. Install Dependencies
```bash
# Frontend
npm install

# Backend (Python Virtual Environment)
cd django_backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
cd ..
```

### 4. Run Locally
```bash
# Run Full Stack (Django + Vite SPA concurrently)
npm run dev

# Or run independently:
npm run django   # Starts Django on http://127.0.0.1:8001
npm run client   # Starts Frontend on http://localhost:3000
```

---

## 🔌 API Documentation

| Method | Endpoint | Description | Rate Limit |
|---|---|---|---|
| `GET` | `/api/health/` | Real-time system health & security probe | Unlimited |
| `POST` | `/api/contact/` | Contact message dispatch via Gmail SMTP | 5 req / min |

### Sample Contact Request:
```json
POST /api/contact/
Content-Type: application/json

{
  "name": "Alex Bennett",
  "email": "alex@example.com",
  "subject": "Project Collaboration",
  "message": "Hello Samir, I would like to discuss a cybersecurity project."
}
```

---

## 📬 Contact & Connect

- **Portfolio Author**: Samir Qureshi
- **University**: Metropolitan University, Sylhet (B.Sc. in CSE)
- **GitHub**: [@samir-60](https://github.com/samir-60)
- **WhatsApp**: [+880 1725-198663](https://wa.me/8801725198663)
- **Email**: [qureshsamir145@gmail.com](mailto:qureshsamir145@gmail.com)

---

<div align="center">
  <sub>Built with modern standards, extreme cybersecurity, and passion by Samir Qureshi. © 2026 All Rights Reserved.</sub>
</div>
