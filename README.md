# RBAC-FinProcessor

Finance operations platform with:
- Django REST backend (RBAC + audit logging + analytics)
- React frontend (protected routes + role-aware UI + dashboard charts)

This README is intentionally written as an engineering handoff document.

## 1. Backend Design

### Service boundaries
- `accounts`: custom user model, auth, profile endpoint, admin-only user management.
- `records`: financial records CRUD + soft delete/hard delete policy + audit logs.
- `dashboard`: aggregated financial summary with range-based trend timelines.

### API architecture
- Django REST Framework with `ModelViewSet` and `APIView`.
- JWT-based authentication (`rest_framework_simplejwt`).
- OpenAPI + Swagger via `drf-spectacular`.
- Filtering/search/order using `django-filter` + DRF filters.

### Authentication flow
1. `POST /api/auth/login/` returns `access` token.
2. Backend writes refresh token cookie (`refresh_token`) as `HttpOnly`.
3. Frontend attaches `Authorization: Bearer <access>` for protected APIs.
4. On `401`, frontend auto-calls `/api/auth/token/refresh/`.

### Authorization model (RBAC)
Roles used in system:
- `Admin`
- `Analyst`
- `Viewer`
- `User`

Authorization is enforced at:
- Route-level permissions (`permission_classes`).
- Record-level logic in `records.views.FinancialRecordViewSet`.

## 2. Logical Thinking

### Why soft delete + hard delete split exists
- Admin deletion is **hard delete** to support true administrative cleanup.
- Normal `User` deletion is **soft delete** (`is_deleted`, `deleted_at`) to preserve accountability and accidental-delete recovery window.
- `Analyst` and `Viewer` cannot mutate data.

### Data visibility logic
- `User` sees only own records.
- `Admin`, `Analyst`, `Viewer` can view full record set.
- Audit logs are admin-only to avoid exposing sensitive activity history.

### Dashboard aggregation thinking
- Summary is per type: `Income`, `Expense`, `Investment`.
- Supports ranges (`1h`, `1d`, `1w`, `1m`, `1y`, `5y`, `all`).
- Bucket strategy adapts by range:
  - hourly buckets for short windows (`1h`, `1d`)
  - date buckets for weekly/monthly
  - monthly/yearly buckets for larger windows

## 3. Functionality

### Backend functionality

#### Auth + users
- `POST /api/auth/register/`: public registration (restricted to `User`/`Viewer`).
- `POST /api/auth/login/`: JWT login + refresh cookie.
- `POST /api/auth/logout/`: refresh cookie clear.
- `GET /api/auth/me/`: current user profile.
- `/api/auth/users/`: admin-only user management endpoints.

#### Records
- `GET /api/records/data/`: list with filters/search/order.
- `POST /api/records/data/`: create record (Admin/User allowed).
- `GET/PUT/PATCH/DELETE /api/records/data/{id}/`: detail and mutations with ownership checks.
- `GET /api/records/logs/`: admin-only audit trail.

#### Dashboard
- `GET /api/dashboard/summary/`: net balance + per-type totals + categories + timeline.

### Frontend functionality

- Public pages: landing, login, register, contact, 404, unauthorized.
- Protected app shell with sidebar + header.
- Role-aware route guards via `ProtectedRoute`.
- User Management pages (`/users`, `/users/new`, `/users/:id`) for admins.
- Records pages (`/records`, `/records/new`, `/records/:id`) with record ownership-aware actions.
- Dashboard with:
  - stock-style trend charts (Income/Expense/Investment)
  - expense category pie chart
  - range toggles (`1D`, `1H`, `1W`, `1M`, `1Y`, `5Y`)

## 4. Database and Data Modeling

### Core entities

| Model | Purpose | Key Fields | Notes |
|---|---|---|---|
| `CustomUser` | Authentication + RBAC identity | `email` (unique), `role`, `is_active`, `is_staff` | Email-based login (`USERNAME_FIELD = email`) |
| `FinancialRecord` | Finance transactions | `amount`, `type`, `category`, `custom_category`, `date`, `created_by`, `is_deleted`, `deleted_at` | Soft delete support + ownership tracking |
| `AuditLog` | Immutable action trail | `user`, `action`, `module`, `details`, `timestamp` | Generated on create/update/delete paths |

### Relationship summary
- `CustomUser` 1 -> many `FinancialRecord` (`created_by`)
- `CustomUser` 1 -> many `AuditLog` (`user`)

### Data modeling choices
- Enumerated choices on `role`, `type`, `category`, `action` reduce invalid states.
- `custom_category` supports extensibility without schema migration for every new category.
- Soft delete fields avoid physical loss for user-initiated deletes.

## 5. Validation and Reliability

### Validation safeguards
- Registration blocks creation of `Admin`/`Analyst` via public endpoint.
- Record serializer rule:
  - if `category = Other`, `custom_category` is required
  - otherwise `custom_category` is nulled.
- PermissionDenied checks for mutation operations by role/ownership.

### Reliability practices
- Token refresh retry in API client (single retry pattern on `401`).
- AbortController usage in data-heavy pages to avoid race updates.
- Deferred search (`useDeferredValue`) to reduce rapid request churn.
- Uniform API error extraction (`ApiError`) for user-readable feedback.
- Audit logging for mutating record operations.

### Automated tests present
- Auth and user-management access tests.
- Record permissions, validation, soft/hard delete tests.
- Dashboard response structure and arithmetic checks.

Run backend tests:
```bash
cd backend
python manage.py test
```

## 6. Documentation

### Setup process

### Prerequisites
- Python 3.12+ recommended
- Node.js 20+ recommended
- MySQL server

### Backend setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:
```env
SECRET_KEY=replace-me
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

DB_NAME=rbac_finprocessor
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=127.0.0.1
```

Then:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs on `http://127.0.0.1:8000`.

### Frontend setup
```bash
cd frontend
npm install
```

Create `frontend/.env` (optional when using Vite proxy):
```env
VITE_BACKEND_ORIGIN=http://127.0.0.1:8000
# Optional direct base URL override for fetch client:
VITE_API_BASE_URL=
```

Start frontend:
```bash
npm run dev
```

Frontend runs on `http://127.0.0.1:5173`.

### API explanation

Base URL: `http://127.0.0.1:8000`

#### Auth
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/token/refresh/`
- `POST /api/auth/logout/`
- `GET /api/auth/me/`
- `GET/POST/PUT/PATCH/DELETE /api/auth/users/...` (admin-only)

#### Records
- `GET/POST /api/records/data/`
- `GET/PUT/PATCH/DELETE /api/records/data/{id}/`
- `GET /api/records/logs/` and `GET /api/records/logs/{id}/` (admin-only)

#### Dashboard
- `GET /api/dashboard/summary/?income_range=1d&expense_range=1d&investment_range=1d`

### API documentation endpoints
- Swagger UI: `/api/docs/`
- OpenAPI schema: `/api/schema/`

Postman tip:
- Import directly from `/api/schema/` URL for stable cloud usage.

### Assumptions made
- MySQL is the primary DB backend.
- Role strings are case-sensitive in backend (`Admin`, `Analyst`, `Viewer`, `User`).
- Frontend normalizes role to lowercase for UI route checks.
- Local development uses Vite proxy (`/api` -> Django).

### Tradeoffs considered
- Refresh token support includes both cookie-path and body-token fallback in frontend:
  - improves compatibility
  - increases token handling complexity.
- Soft delete is implemented only for `FinancialRecord` user deletes, not all models.
- Aggregation in dashboard is computed on request-time for freshness over caching simplicity.
- Current UI exposes record edit view to analysts/users based on route + ownership logic, while backend remains ultimate authority.

## 7. Additional Thoughtfulness

### UX and product polish
- Premium visual system with consistent tokens and components.
- Reusable UI primitives (`DataTable`, `Modal`, `FeedbackToast`, `StatsCard`).
- Friendly fallback pages (`Unauthorized`, `NotFound`) and loading states.
- Contact page + landing-page section anchors (`Features`, `Our Mission`, `Contact`).

### Engineering clarity
- Consistent API wrapper layer (`frontend/src/api/*`) instead of direct fetch calls in pages.
- Centralized auth/session state in context.
- Modular backend apps aligned to business capability.
- Swagger annotations for non-generic APIViews in auth/dashboard where needed.

### Suggested next improvements
- Add `.env.example` files for backend/frontend.
- Add CI pipeline (lint + test + build).
- Add DB indexes on frequently filtered fields (`date`, `type`, `category`, `timestamp`).
- Add more endpoint-level tests for user management create/update edge cases.
