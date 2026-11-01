# Migration Plan: Kerala Migrant Health System (Node.js Express to Java Spring Boot)

## 1. Executive Summary & Objective

- **Source System:** Node.js (Express 5, SQLite3, Socket.IO, TypeScript) located in `d:\shiv\kerala-migrant-health-system\server`
- **Target System:** Java Spring Boot 3.3.x (Java 22, Spring Data JPA, H2/SQLite/PostgreSQL support, Netty-SocketIO, ZXing QR generation, Lombok) located in `d:\shiv\kerala-migrant-health-backend`
- **Frontend Target:** Existing React 19 + TypeScript + Vite frontend in `d:\shiv\kerala-migrant-health-system` connected seamlessly to the Spring Boot REST API & WebSocket without requiring frontend breaking changes.

---

## 2. Technology Stack Mapping

| Component | Node.js (Current) | Java Spring Boot (Target) |
| :--- | :--- | :--- |
| **Language & Runtime** | Node.js v20+ / TypeScript | Java 22 / Spring Boot 3.3.x |
| **Web Framework** | Express.js 5.x | Spring Web MVC (`@RestController`) |
| **ORM / Data Access** | Raw SQLite3 SQL queries | Spring Data JPA (Hibernate) |
| **Database** | SQLite (`database.sqlite`) | H2 Database (File-based persistent mode with zero-setup, configurable to PostgreSQL/MySQL/SQLite) |
| **Real-time WebSockets** | Socket.IO Server (`socket.io` 4.8.x) | `netty-socketio` (Maintains 100% protocol compatibility with React `socket.io-client`) |
| **QR Code Generation** | `qrcode` npm package | `com.google.zxing:core` & `javase` |
| **File Storage** | `multer` to local disk (`/uploads`) | Spring Multipart & custom `FileStorageService` (`/uploads`) |
| **Data Seeding** | Node.js script (`seed_demo.js`) | Spring `CommandLineRunner` (`DataSeeder.java`) |
| **Build & Dependency Tool** | npm / `package.json` | Apache Maven (`pom.xml` + Maven Wrapper `mvnw`) |

---

## 3. Architecture & Target Project Structure

```
d:\shiv\kerala-migrant-health-backend\
├── .mvn\
│   └── wrapper\
├── mvnw
├── mvnw.cmd
├── pom.xml
├── plan.md
└── src\
    ├── main\
    │   ├── java\
    │   │   └── com\
    │   │       └── kerala\
    │   │           └── dhms\
    │   │               ├── DhmsApplication.java
    │   │               ├── config\
    │   │               │   ├── CorsConfig.java
    │   │               │   ├── SocketIOConfig.java
    │   │               │   └── WebMvcConfig.java (Static /uploads serving)
    │   │               ├── controller\
    │   │               │   ├── AuthController.java
    │   │               │   ├── DashboardController.java
    │   │               │   ├── PatientController.java
    │   │               │   ├── VisitController.java
    │   │               │   └── VaccinationController.java
    │   │               ├── dto\
    │   │               │   ├── ApiResponse.java
    │   │               │   ├── AuthDtos.java (LoginRequest, LoginResponse, VerifyRequest, UserDto)
    │   │               │   ├── DashboardDtos.java (MetricsResponse, ChartDataResponse)
    │   │               │   ├── PatientDtos.java (PatientListResponse, PatientDetailResponse, CreatePatientRequest)
    │   │               │   └── VisitDtos.java (CreateVisitRequest, CompleteVaccinationRequest)
    │   │               ├── entity\
    │   │               │   ├── AbdmConsentRequest.java
    │   │               │   ├── DashboardMetric.java
    │   │               │   ├── HealthCondition.java
    │   │               │   ├── LabReport.java
    │   │               │   ├── Patient.java
    │   │               │   ├── PatientScheme.java
    │   │               │   ├── PatientVisit.java
    │   │               │   ├── Prescription.java
    │   │               │   ├── Referral.java
    │   │               │   ├── Vaccination.java
    │   │               │   └── VisitAttachment.java
    │   │               ├── repository\
    │   │               │   ├── AbdmConsentRepository.java
    │   │               │   ├── HealthConditionRepository.java
    │   │               │   ├── LabReportRepository.java
    │   │               │   ├── PatientRepository.java
    │   │               │   ├── PatientSchemeRepository.java
    │   │               │   ├── PatientVisitRepository.java
    │   │               │   ├── PrescriptionRepository.java
    │   │               │   ├── ReferralRepository.java
    │   │               │   ├── VaccinationRepository.java
    │   │               │   └── VisitAttachmentRepository.java
    │   │               ├── service\
    │   │               │   ├── AuthService.java
    │   │               │   ├── DashboardService.java
    │   │               │   ├── FileStorageService.java
    │   │               │   ├── PatientService.java
    │   │               │   ├── QrCodeService.java
    │   │               │   ├── SocketIOService.java
    │   │               │   ├── VaccinationService.java
    │   │               │   └── VisitService.java
    │   │               └── util\
    │   │                   └── DataSeeder.java (Populates realistic Kerala migrant worker data)
    │   └── resources\
    │       ├── application.yml
    │       └── schema.sql (optional / fallback DDL)
    └── uploads\ (Uploaded files directory)
```

---

## 4. Database Schema & JPA Entity Mapping (11 Tables)

All tables from `server/db/schema.sql` are mapped to JPA entities:

1. **`Patient` (`patients`)**:
   - `id` (Long, PK, Auto-increment)
   - `patientId` (String, Unique, e.g. "KDH-2025-001234")
   - `fullName`, `age`, `gender`, `bloodGroup`, `dateOfBirth`
   - `mobile`, `email`, `abhaId`, `abdmLinked`, `abdmLinkedAt`, `abdmReferenceId`
   - `originState`, `originDistrict`, `currentLocation` (Kerala District), `currentAddress`
   - `accommodationType`, `roomOccupancy`, `hasCleanWater`, `toiletAccess`
   - `emergencyContactName`, `emergencyContactPhone`, `emergencyContactRelation`
   - `registeredBy`, `registeredAt`, `lastUpdated`, `isActive`
   - Relations: OneToMany to `HealthCondition`, `Vaccination`, `PatientVisit`, `PatientScheme`, `LabReport`, `Prescription`, `Referral`, `AbdmConsentRequest`

2. **`HealthCondition` (`health_conditions`)**:
   - `id`, `patientId`, `conditionName`, `icdCode`, `severity`, `diagnosedDate`, `isActive`, `notes`

3. **`Vaccination` (`vaccinations`)**:
   - `id`, `patientId`, `vaccineName`, `doseNumber`, `status` ("Completed", "Pending"), `administeredDate`, `nextDueDate`, `batchNumber`, `administratorName`, `certificateUrl`, `administeredBy`

4. **`PatientVisit` (`patient_visits`)**:
   - `id`, `patientId`, `visitDate`, `facility`, `chiefComplaint`, `vitals` (JSON/Text), `diagnosis`, `treatmentNotes`, `followUpRequired`, `followUpDate`, `visitedBy`, `createdAt`
   - Relation: OneToMany to `VisitAttachment`

5. **`VisitAttachment` (`visit_attachments`)**:
   - `id`, `visitId`, `filename`, `fileType`, `fileUrl`, `fileSize`, `uploadedAt`

6. **`PatientScheme` (`patient_schemes`)**:
   - `id`, `patientId`, `schemeName`, `enrollmentStatus`, `policyId`, `coverageAmount`, `validUntil`, `claimsUsed`

7. **`AbdmConsentRequest` (`abdm_consent_requests`)**:
   - `id`, `patientId`, `requesterFacilityId`, `purpose`, `dataTypes` (JSON string), `status`, `validFrom`, `validUntil`, `consentId`, `createdAt`

8. **`LabReport` (`lab_reports`)**:
   - `id`, `patientId`, `visitId`, `testName`, `testDate`, `result`, `referenceRange`, `status`, `fileUrl`, `facility`

9. **`Prescription` (`prescriptions`)**:
   - `id`, `patientId`, `visitId`, `medicineName`, `dosage`, `frequency`, `duration`, `instructions`, `prescribedDate`

10. **`Referral` (`referrals`)**:
    - `id`, `patientId`, `visitId`, `toFacility`, `reason`, `priority`, `status`, `referralDate`

11. **`DashboardMetric` (`dashboard_metrics`)**:
    - `id`, `metricType`, `district`, `metricValue`, `calculatedAt`

---

## 5. API Endpoints Specification & Full Compatibility

The Spring Boot backend will run on **Port 5000** (matching Node.js default) with identical paths and JSON structure:

### 5.1 Authentication (`/api/auth`)
- `POST /api/auth/login`
  - Input: `{ "username": "admin@kerala.gov", "password": "admin", "provider": "..." }`
  - Output: `{ "success": true, "token": "<base64_token>", "user": { "id": 1, "username": "...", "role": "Super Admin", "name": "Dr. Arun Kumar", "district": "All" } }`
  - Supports default mock users:
    - `admin@kerala.gov` / `admin` (Super Admin)
    - `wayanad@kerala.gov` / `district` (District Admin)
    - `worker` / `worker` (Field Worker)
    - `phc` / `phc` (PHC Staff)
- `POST /api/auth/verify`
  - Input: `{ "token": "..." }`
  - Output: `{ "success": true, "user": { ... } }`
- `GET /api/auth/google` & `GET /api/auth/callback/google`
  - OAuth initiation and token exchange endpoints matching existing frontend flow.

### 5.2 Patient Management (`/api/patients`)
- `GET /api/patients?search=...&location=...&disease=...&role=...&userLocation=...&page=1&limit=20`
  - Returns paginated migrant patients with computed counts (`conditions_count`, `vaccines_completed`).
  - Output: `{ "success": true, "data": { "patients": [...], "total": 25, "page": 1, "totalPages": 2 } }`
- `GET /api/patients/{id}`
  - Searches by internal numeric ID or alphanumeric string `patient_id` (e.g. `KDH-2025-001234`).
  - Returns complete medical dossier: patient details, `health_conditions`, `vaccinations`, `schemes`, and latest `visits`.
- `POST /api/patients`
  - Creates a new migrant worker record and broadcasts real-time update.

### 5.3 Visit Management (`/api/patients/{patientId}/visits`)
- `GET /api/patients/{patientId}/visits`
  - Returns all clinical encounters for the patient along with attachments and parsed vitals.
- `POST /api/patients/{patientId}/visits`
  - Multipart request: accepts visit fields (`visitDate`, `facility`, `chiefComplaint`, `vitals`, `diagnosis`, `treatmentNotes`, `followUpRequired`, `followUpDate`) and attachment files (`MultipartFile[] attachments`).
  - Saves files to `./uploads/` and returns populated visit object.
  - Broadcasts `visit:added` and `health_data_update` events.

### 5.4 Vaccination Tracking (`/api/patients/{patientId}/vaccinations`)
- `GET /api/patients/{patientId}/vaccinations`
  - Returns vaccination list sorted by status (`Pending` first, then `Completed`).
- `POST /api/patients/{patientId}/vaccinations/{vaccineId}/complete`
  - Multipart request with certificate file upload (`MultipartFile certificate`) and vaccination meta (`administeredDate`, `batchNumber`, `administratorName`, `nextDueDate`).
  - Broadcasts `vaccination:updated` and `health_data_update`.

### 5.5 ABHA Integration (`/api/patients/{patientId}/abha`)
- `GET /api/patients/{patientId}/abha/qr`
  - Generates Base64 data URL PNG QR Code using ZXing containing patient ABHA details.
- `POST /api/patients/{patientId}/abha/link`
  - Links ABHA ID to patient and triggers mock SMS notification.

### 5.6 Ancillary Clinical Data
- `GET /api/patients/{patientId}/labs`
- `GET /api/patients/{patientId}/prescriptions`
- `GET /api/patients/{patientId}/referrals`
- `GET /api/patients/{patientId}/consents`

### 5.7 Dashboard Analytics (`/api/dashboard`)
- `GET /api/dashboard/metrics`
  - Returns aggregate stats: `totalMigrants`, `vaccinationCoverage` %, `uniqueLocations`, `activeAlerts`.
- `GET /api/dashboard/charts`
  - Returns distribution datasets: `locationData` (counts by Kerala districts), `vaccinationData`, `diseaseTrends`.

### 5.8 Static File Serving
- `GET /uploads/{filename}` serves stored attachments and vaccination certificates.

---

## 6. Real-time Socket.IO Compatibility

- The React frontend uses `import { io } from 'socket.io-client'` connecting to `http://localhost:5000`.
- We integrate **`com.corundumstudio.socketio:netty-socketio`** in Spring Boot.
- Events handled:
  - Client -> Server: `new_patient` (auto-saves patient to DB and emits broadcast)
  - Server -> Client: `health_data_update`, `visit:added`, `vaccination:updated`
- This ensures 100% zero changes required in `RealtimeContext.tsx` and `RegistrationForm.tsx`.

---

## 7. Realistic Demo Data Seeding (`DataSeeder.java`)

On initial startup, `DataSeeder` checks if the patient table is empty. If empty, it automatically populates:
1. 25 realistic migrant patient profiles with Indian migrant states (Bihar, Jharkhand, West Bengal, Odisha, Assam, UP, Rajasthan) and Kerala destination districts (Wayanad, Ernakulam, Kozhikode, Palakkad, etc.).
2. Associated health conditions (Hypertension, Type 2 Diabetes, Bronchitis, Malaria, Dermatitis).
3. Realistic vaccination records (COVID-19 Dose 1/2/Booster, Tetanus, Hepatitis B, Influenza).
4. Patient visits with vitals (BP, Pulse, SpO2, Temperature).
5. Government health insurance schemes (Ayushman Bharat, Karunya Arogya Suraksha Padhathi - KASP).
6. Prescriptions, lab reports, referrals, and ABDM consent entries.

---

## 8. Step-by-Step Implementation Roadmap

- [ ] **Step 1:** Setup Spring Boot project directory, `pom.xml` with dependencies (Spring Web, Spring Data JPA, H2, Netty-SocketIO, ZXing, Lombok, Jakarta Validation), and Maven Wrapper (`mvnw.cmd` / `mvnw`).
- [ ] **Step 2:** Implement `application.yml` with port `5000`, H2 file-persistence, JPA hibernate auto-ddl, and multipart file upload size limits.
- [ ] **Step 3:** Implement all 11 JPA Entities and Enums in `com.kerala.dhms.entity`.
- [ ] **Step 4:** Implement Spring Data JPA Repositories in `com.kerala.dhms.repository` with custom query methods for search, filtering, and metrics.
- [ ] **Step 5:** Implement DTO classes in `com.kerala.dhms.dto` for clean API contract responses matching the Node.js API format.
- [ ] **Step 6:** Implement Service Layer in `com.kerala.dhms.service`:
  - `AuthService`
  - `PatientService`
  - `VisitService`
  - `VaccinationService`
  - `DashboardService`
  - `QrCodeService` (ZXing Base64 image generator)
  - `FileStorageService` (Uploads handler)
  - `SocketIOService` (Real-time broadcaster)
- [ ] **Step 7:** Implement REST Controllers in `com.kerala.dhms.controller` with `@CrossOrigin(origins = "*")` and `/uploads` static resource mapping.
- [ ] **Step 8:** Implement Netty-SocketIO configuration and event listeners.
- [ ] **Step 9:** Implement `DataSeeder.java` to seed all 25 migrant workers and medical history on first run.
- [ ] **Step 10:** Compile, package, test with Java 22, verify all REST endpoints via automated calls, and test integration with the React frontend.

---

## 9. Verification & Acceptance Criteria

1. `mvnw.cmd clean package` compiles with 0 errors.
2. Spring Boot server starts cleanly on port `5000`.
3. `POST /api/auth/login` returns valid session token and user info.
4. `GET /api/patients` returns seeded migrant workers with pagination and search.
5. `GET /api/patients/{id}` returns complete patient medical history.
6. `POST /api/patients/{id}/visits` accepts file uploads and records clinical encounter.
7. `POST /api/patients/{id}/vaccinations/{vaccineId}/complete` uploads certificate and updates status.
8. `GET /api/patients/{id}/abha/qr` returns scannable base64 QR code image.
9. `GET /api/dashboard/metrics` and `/api/dashboard/charts` return dashboard statistics.
10. Socket.IO connection is accepted, and `new_patient` broadcasts `health_data_update`.
