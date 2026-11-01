# Kerala Migrant Health System (DHMS)

A comprehensive, bilingual (English & regional languages) **Digital Health Management System** designed for migrant workers in Kerala. Features electronic medical records, ABHA integration, disease surveillance, and vaccination tracking.

---

## 🏗️ Architecture & Monorepo Structure

```
kerala-migrant-health-system/
├── backend/                  # Java 22 + Spring Boot 3.3.5 Backend (Port 5000)
│   ├── src/                  # Controllers, Entities, Repositories, Services, DTOs
│   ├── pom.xml               # Maven configuration
│   ├── mvnw & mvnw.cmd       # Maven Wrapper
│   ├── README.md             # Detailed Backend documentation
│   └── plan.md               # Migration & Architecture plan
│
├── frontend/                 # React 19 + TypeScript + Vite + Tailwind CSS (Port 5173)
│   ├── src/                  # React Components, Pages, Context, i18n
│   ├── public/               # Public assets & localization files
│   ├── package.json          # Dependencies & npm scripts
│   └── vite.config.ts        # Vite configuration
│
└── README.md                 # Root fullstack documentation
```

---

## ⚡ Quick Start Guide

### 1. Start the Backend (Spring Boot - Port 5000)

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
*(On initial launch, the backend automatically seeds 25 realistic migrant profiles and clinical histories into the persistent H2 database).*

### 2. Start the Frontend (React - Port 5173)

Open a new terminal:
```powershell
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Login Credentials

| Username | Password | Role | District Scope |
|---|---|---|---|
| `admin@kerala.gov` | `admin` | Super Admin | State-wide (All) |
| `wayanad@kerala.gov` | `district` | District Admin | Wayanad District |
| `worker` | `worker` | Field Worker | Wayanad Field Operations |
| `phc` | `phc` | PHC Staff | Primary Health Centre |

---

## 🌟 Key Features

1. **Digital Health Card & ABHA ID:**
   - Real-time generation of QR codes for migrant health verification using ZXing.
   - ABHA ID linking simulation with ABDM compliance.

2. **Real-time Synchronization:**
   - Embedded Socket.IO pipeline between React and Spring Boot.
   - Real-time notification of patient registrations and updates across active sessions.

3. **Clinical Management:**
   - Medical history recording with vital signs monitoring.
   - Multipart clinical attachments and vaccination certificates storage (`/uploads/**`).
   - Prescription logging, lab reports tracking, and tertiary hospital referrals.

4. **Public Health Surveillance:**
   - District-level aggregation and disease trend monitoring.
   - Vaccination coverage analytics and critical health alerts.

5. **Multi-language Support (i18n):**
   - English, Hindi, Malayalam, Bengali, and Assamese translations for field workers and migrants.

---

## 🗄️ Database Console

The backend runs a persistent H2 database with a web-accessible console:
- **URL:** `http://localhost:5000/h2-console`
- **JDBC URL:** `jdbc:h2:file:./data/dhms`
- **Username:** `sa`
- **Password:** *(leave blank)*
