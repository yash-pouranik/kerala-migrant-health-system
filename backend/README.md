# Kerala Migrant Health System (DHMS) - Spring Boot Backend

Production-ready Java Spring Boot backend for the Kerala Digital Health Management System for Migrant Workers. Migrated from the Node.js Express/SQLite server to a robust, scalable Spring Boot 3 enterprise application.

---

## 🚀 Features

- **Spring Boot 3.3.5 & Java 22:** High-performance, reactive-capable microservice architecture.
- **RESTful Endpoints:** 100% compatible with the DHMS React frontend (`port 5000`).
- **Database (H2 File Persistent):** Zero external installation needed. All data persists to `./data/dhms.mv.db`.
- **Automatic Data Seeding:** Populates 25 realistic migrant workers, health conditions, vaccination histories, visits, and insurance schemes on initial launch.
- **Real-time WebSockets (Socket.IO):** Native Engine.IO & Socket.IO server directly embedded into Tomcat, maintaining complete compatibility with `socket.io-client`.
- **ABHA QR Generation:** QR Codes generated dynamically using Google ZXing in Base64 format.
- **File Uploads:** Multipart attachment and certificate storage serving via `/uploads/**`.

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Framework** | Spring Boot 3.3.5 |
| **Language** | Java 22 (LTS bytecode target: 21) |
| **ORM / Data Access** | Spring Data JPA (Hibernate) |
| **Database** | H2 (File Persistent) / SQLite / MySQL / PostgreSQL ready |
| **Real-time** | `io.socket:socket.io-server` & `io.socket:engine.io-server` |
| **QR Code** | `com.google.zxing:core` & `javase` |
| **Build Tool** | Apache Maven with Maven Wrapper (`mvnw.cmd`) |

---

## 📂 Project Structure

```
d:\shiv\kerala-migrant-health-backend\
├── src/main/java/com/kerala/dhms/
│   ├── DhmsApplication.java         # Spring Boot entry point
│   ├── config/                      # CORS, File Upload, Socket.IO config
│   ├── controller/                  # REST Controllers (Auth, Patients, Visits, Vax, Dashboard)
│   ├── dto/                         # Request and Response DTOs
│   ├── entity/                      # 11 JPA Entities (Patients, Visits, Vaccinations, etc.)
│   ├── repository/                  # Spring Data JPA Repositories
│   ├── service/                     # Business Logic, QR Code, Storage, SocketIO
│   └── util/                        # DataSeeder (25 realistic migrant profiles)
├── src/main/resources/
│   └── application.yml              # Port 5000, Datasource & JPA configuration
├── pom.xml                          # Maven build dependencies
├── mvnw & mvnw.cmd                  # Maven wrappers
└── plan.md                          # Detailed architecture & migration plan
```

---

## 🏃 Quick Start Guide

### 1. Build the Application
```powershell
cd d:\shiv\kerala-migrant-health-backend
.\mvnw.cmd clean package -DskipTests
```

### 2. Run the Application
```powershell
# Option A: Using Maven wrapper
.\mvnw.cmd spring-boot:run

# Option B: Run packaged JAR directly
java -jar target/dhms-1.0.0.jar
```

The backend starts on **`http://localhost:5000`**.

---

## 🔑 Demo Login Credentials

| Username | Password | Role | District |
|---|---|---|---|
| `admin@kerala.gov` | `admin` | Super Admin | All |
| `wayanad@kerala.gov` | `district` | District Admin | Wayanad |
| `worker` | `worker` | Field Worker | Wayanad |
| `phc` | `phc` | PHC Staff | Wayanad |

---

## 🌐 API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Authenticate with username & password or OAuth
- `POST /api/auth/verify` - Verify auth session token
- `GET /api/auth/google` - Initiate Google OAuth URL
- `GET /api/auth/callback/google` - OAuth code exchange & redirect

### Patient Records
- `GET /api/patients` - Paginated migrant list with search, filters (`location`, `disease`)
- `GET /api/patients/{id}` - Comprehensive medical dossier (conditions, vaccines, visits, schemes)
- `POST /api/patients` - Register new migrant worker
- `GET /api/patients/{id}/abha/qr` - Generate dynamic ABHA QR code
- `POST /api/patients/{id}/abha/link` - Link ABHA ID with SMS simulation

### Clinical Management
- `GET /api/patients/{id}/visits` - Clinical encounters and vitals
- `POST /api/patients/{id}/visits` - Record encounter with file attachments (Multipart)
- `GET /api/patients/{id}/vaccinations` - Vaccination schedule
- `POST /api/patients/{id}/vaccinations/{vaccineId}/complete` - Mark completed with certificate upload (Multipart)
- `GET /api/patients/{id}/labs` - Diagnostic laboratory reports
- `GET /api/patients/{id}/prescriptions` - Medications prescribed
- `GET /api/patients/{id}/referrals` - Hospital referrals
- `GET /api/patients/{id}/consents` - ABDM electronic consent logs

### Analytics & Real-Time
- `GET /api/dashboard/metrics` - High-level metrics (total migrants, vax coverage, alerts)
- `GET /api/dashboard/charts` - District distribution, vaccination rates, disease trends
- `GET /socket.io/` - Engine.IO / Socket.IO real-time event pipeline

### H2 Database Console
- URL: `http://localhost:5000/h2-console`
- JDBC URL: `jdbc:h2:file:./data/dhms`
- Username: `sa`
- Password: *(leave blank)*
