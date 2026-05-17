# Lifeline — IT Support for Healthcare

Internal IT support ticketing system for hospitals and healthcare staff. Doctors, nurses, and admin staff raise tickets when they hit IT issues (printer, network, login, hardware). A central IT team picks them up, comments back and forth, and marks them resolved.

Built with Spring Boot 3.3.5 (Java 21) on the backend, React 18 + Vite on the frontend, PostgreSQL 16 for persistence, Redis 7 for caching and rate-limiting, and Mailpit as a local SMTP catcher for testing emails.

---

## Quick start

### Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Java | 21 (LTS) | Required for Spring Boot 3.3.5 |
| Node.js | 18+ | For the frontend |
| Docker Desktop | latest | For PostgreSQL, Redis, Mailpit |
| Git | any recent | |

### Setup (one time)

1. **Clone the repo:**

   ```
   git clone https://github.com/TanmayNerurkar/Ticketing-System.git
   cd Ticketing-System
   ```

2. **Get the config files.**
   The repository does **not** check in environment-specific config. Ask Tanmay or Sahil for the following files and place them as shown:

   ```
   ticketing-backend/src/main/resources/application.properties
   ticketing-backend/src/main/resources/application-local.properties
   ticketing-backend/src/main/resources/application-azure.properties

   Ticketing-Service-FrontEnd/.env.local
   Ticketing-Service-FrontEnd/.env.development
   Ticketing-Service-FrontEnd/.env.production
   ```

3. **Verify Docker Compose credentials.**
   Open `ticketing-backend/docker-compose.yml` and confirm `POSTGRES_USER` / `POSTGRES_PASSWORD` match `spring.datasource.username` / `spring.datasource.password` in `application-local.properties`. They must be identical or the backend cannot connect to the database.

4. **Windows users only — stop any native PostgreSQL service.**
   If you have PostgreSQL installed natively on Windows, it will fight Docker for port 5432 and silently take over. Stop it before running the app:

   ```
   # Run PowerShell as Administrator
   Stop-Service -Name postgresql-x64-16
   Set-Service -Name postgresql-x64-16 -StartupType Manual
   ```

### Running the app

You need **three things running at once**: Docker containers, the backend, and the frontend. Use three terminal windows.

#### Terminal 1 — Start Docker containers

```
cd ticketing-backend
docker compose up -d
```

This starts PostgreSQL on `localhost:5432`, Redis on `localhost:6379`, Mailpit SMTP on `localhost:1025`, and the Mailpit web UI on `http://localhost:8025`.

#### Terminal 2 — Start the backend

```
cd ticketing-backend
```

**Windows:** the Docker PostgreSQL image rejects the legacy timezone name (`Asia/Calcutta`) that Windows reports by default, so set the JVM timezone explicitly first:

```
set JAVA_TOOL_OPTIONS=-Duser.timezone=Asia/Kolkata
.\mvnw.cmd spring-boot:run
```

**macOS / Linux:**

```
./mvnw spring-boot:run
```

Backend boots on `http://localhost:8080`. On first start, Flyway applies all migrations and a data initializer seeds the test users.

#### Terminal 3 — Start the frontend

```
cd Ticketing-Service-FrontEnd
npm install   # first time only
npm run dev
```

Frontend boots on `http://localhost:3000`.

Open `http://localhost:3000` in a browser and sign in as one of the test accounts below.

### Stopping the app

```
# Terminal 2 and 3: Ctrl+C, confirm Y if prompted
# Terminal 1:
docker compose stop
```

`docker compose stop` preserves the database volume. Use `docker compose down` only if you want to keep the container definitions but remove the running containers. **Never use `docker compose down -v`** unless you want to wipe all data — the `-v` flag deletes the database volume and you will lose every user, ticket, and comment.

---

## Test accounts

These accounts are seeded by `DataInitializer` on every backend startup. Passwords are reset to `password` on startup, so they are intentionally weak and must not be reused in any non-local environment.

| Email | Role | Password | Organisation |
|---|---|---|---|
| `priya@apollo.in` | Client | `password` | Apollo Hospital, Hyderabad |
| `rahul@remoteit.in` | Technician | `password` | — |
| `sunita@remoteit.in` | Technician | `password` | — |
| `admin@lifeline.local` | Admin | `password` | — |

> **Note:** `admin@lifeline.local` is added through a manual SQL insert when first setting up the dev environment, not by Flyway. If your database does not contain this user, run:
>
> ```
> docker exec ticketing-postgres psql -U tanmay -d ticketing -c \
>   "INSERT INTO users (email, full_name, password_hash, role) \
>    SELECT 'admin@lifeline.local', 'Lifeline Admin', password_hash, 'ADMIN' \
>    FROM users WHERE email = 'rahul@remoteit.in';"
> ```

---

## Project structure

```
Ticketing-System/
├── ticketing-backend/                Spring Boot 3.3.5 application
│   ├── src/main/java/com/lifeline/ticketing/
│   │   ├── auth/                     Sign in, change password, forgot/reset password
│   │   ├── user/                     User entity, repository, CRUD endpoints
│   │   ├── ticket/                   Ticket entity, lifecycle, comments
│   │   ├── organization/             Organisations (hospitals)
│   │   ├── assignment/               Technician assignment logic
│   │   ├── category/                 Ticket categories
│   │   ├── audit/                    Ticket history
│   │   └── config/                   Security, data init, JWT
│   ├── src/main/resources/db/migration/   Flyway SQL migrations
│   └── docker-compose.yml            Postgres + Redis + Mailpit
│
├── Ticketing-Service-FrontEnd/       React 18 + Vite + Tailwind
│   ├── src/
│   │   ├── api/                      API client modules
│   │   ├── components/               Reusable UI components
│   │   ├── hooks/queries/            React Query hooks
│   │   ├── pages/                    Top-level route components
│   │   └── App.jsx                   Routes + auth guards
│   └── vite.config.js
│
└── docs/                             Progress reports and design docs
```

---

## Features

### For clients
- Sign in with email + password.
- Submit a new ticket with category, sub-category, description, urgency, contact preferences, and a follow-up date.
- See a list of their own tickets with status and priority.
- Open a ticket and read its resolution once a technician has fixed it.
- Add comments on a ticket (back-and-forth conversation with the technician).
- Change their own password while signed in.

### For technicians
- See tickets assigned to them on a queue dashboard.
- Pick up unassigned tickets from the queue.
- Comment on tickets and have a conversation with the reporter.
- Mark tickets resolved with a resolution note.
- See the full ticket history including all comments.

### For admins
- See every user in the system, with search and a role filter.
- Create new user accounts (Client, Technician, Manager, or Admin).
- Edit a user's name, role, and organisation.
- Reset any user's password (generates a temporary password to share with the user).
- Deactivate and reactivate users.
- See all tickets across all organisations.

### Authentication
- JWT-based, stateless API.
- BCrypt password hashing.
- Self-service Change password while signed in.
- Forgot password sends a reset link by email; the link expires in 30 minutes, is single-use, and is rate-limited (3 requests per 15 minutes per email).
- There is no public sign-up. New users are always created by an admin.

---

## Configuration reference

Local development reads from `application-local.properties`. Key settings:

| Property | Purpose |
|---|---|
| `spring.datasource.url` | PostgreSQL connection string |
| `spring.datasource.username` / `password` | Must match docker-compose Postgres credentials |
| `spring.data.redis.host` / `port` | Redis connection (default `localhost:6379`) |
| `spring.mail.host` / `port` | SMTP for outbound mail (default Mailpit `localhost:1025`) |
| `app.frontend-base-url` | Used to build links inside reset emails (default `http://localhost:3000`) |
| `app.password-reset.expiry-minutes` | Password reset token validity window (default `30`) |
| `app.password-reset.rate-limit.max` | Max forgot-password requests per window (default `3`) |
| `app.password-reset.rate-limit.window-minutes` | Rate-limit window length (default `15`) |
| `app.jwt.secret` | HMAC secret for signing JWTs |
| `app.jwt.expiration-hours` | JWT validity (default `8`) |

---

## Database

Schema is managed by Flyway. Migrations live in `ticketing-backend/src/main/resources/db/migration/`:

| Migration | Description |
|---|---|
| `V1__initial_schema.sql` | Users, organisations, tickets, comments, categories, ticket history |
| `V2__seed_data.sql` | Test users, sample organisations, default categories |
| `V3__password_reset_tokens.sql` | Password reset tokens table for forgot-password flow |

`DataInitializer` runs after migrations and ensures the seeded test users have a valid bcrypt hash for the password `password`. This makes development convenient but means a manually changed password on a seeded user will not survive a backend restart.

---

## Useful endpoints (manual testing)

- API base: `http://localhost:8080`
- Health check: `GET /actuator/health`
- Sign in: `POST /auth/login` with `{ "email": "...", "password": "..." }`
- Change password: `POST /auth/change-password` (authenticated)
- Forgot password: `POST /auth/forgot-password` with `{ "email": "..." }`
- Reset with token: `POST /auth/reset-password` with `{ "token": "...", "newPassword": "..." }`
- List users (admin): `GET /users`
- Create user (admin): `POST /users` with full user payload
- Mailpit web UI (view sent emails): `http://localhost:8025`

---

## Known gaps and TODO

Tracked from the v0.1 progress report:

- [ ] `GET /users` returns an empty list for non-admins. Should return HTTP 403.
- [ ] `DataInitializer` resets seeded test user passwords on every backend startup. Either disable in non-local profiles or make it opt-in.
- [ ] No real SMTP configured. Password reset emails go only to Mailpit. Configure a production SMTP provider before going live.
- [ ] No audit log UI for admins to see who created, modified, or deactivated which users.
- [ ] Manager role exists in the data model but has no dedicated dashboard yet.
- [ ] Move environment config out of separately-shared files into version-controlled `.env.example` templates plus a documented secrets-management approach.

See `docs/Lifeline-Progress-Report-v0.1.docx` for the full progress report.

---

## Deployment

Target environment is Azure App Service. The `azure` Spring profile uses `application-azure.properties` which is not in this repository.

---

## Contributors

- Tanmay Nerurkar — original developer
- Sahil Sawant — admin features, auth flows (change password, forgot password, role-based route protection)
