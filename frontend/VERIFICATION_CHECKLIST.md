# Frontend Verification Checklist (Step 12)

## Automated checks

- [x] `npm run lint`
- [x] `npm run build`

## Pre-conditions

- Backend running on `http://127.0.0.1:8000`
- Frontend running via `npm run dev`
- Browser cache cleared or hard refresh after latest changes
- Ensure Vite proxy is active (`/api/*` should forward to backend)

## Auth flow

1. Open `/register`
2. Register a new `User` role account
3. Expected: success toast + redirect to `/login`
4. Login from `/login` with valid credentials
5. Expected: redirect to `/dashboard`
6. Refresh browser on protected route
7. Expected: session remains valid (if token refresh flow succeeds)
8. Click logout in header
9. Expected: redirect to `/login` and protected pages become inaccessible

## Routing & fallback flow

1. Open `/` while logged out
2. Expected: guest landing page with Login/Register CTA
3. Open `/` while logged in
4. Expected: auto-redirect to `/dashboard`
5. Open an invalid route like `/something-random`
6. Expected: `NotFound` page
7. Open restricted route with insufficient role (e.g. `/users` as Analyst)
8. Expected: redirect to `/unauthorized`

## RBAC access matrix

- `Admin`:
  - Can access: `/dashboard`, `/users`, `/users/new`, `/users/:id`, `/records`, `/records/new`, `/records/:id`, `/logs`
  - Can create/update/delete users and records
- `Analyst`:
  - Can access: `/dashboard`, `/records`, `/records/:id`
  - Cannot access: `/users`, `/logs`, `/records/new`
  - Record detail should be read-only (no successful mutation)
- `Viewer` / `User`:
  - Can access: `/dashboard` only
  - Cannot access: `/users`, `/records`, `/logs`

## Users module checks

1. Open `/users` as Admin
2. Test search, role filter, status filter, and pagination controls
3. Click `Add User`, submit form
4. Expected: user created and redirected back to list
5. Click `Edit` for a user, test both PATCH and PUT update modes
6. Expected: update succeeds with toast and return to list
7. Delete a user from modal
8. Expected: row removed and success toast

## Records module checks

1. Open `/records` as Admin
2. Test search, type/category filters, sort options, pagination
3. Add record from `/records/new`
4. Edit record from `/records/:id` using PATCH and PUT modes
5. Delete record from list modal
6. Expected: create/update/delete all succeed for Admin
7. Open `/records` as Analyst
8. Expected: list visible, record detail view allowed, create/delete/update blocked

## Dashboard checks

1. Open `/dashboard`
2. Change Income/Expense/Investment ranges
3. Expected: cards and category panels reload
4. Click refresh button
5. Expected: summary re-fetch with latest server data

## Audit logs checks

1. Open `/logs` as Admin
2. Test search, action filter, user-id filter, pagination
3. Expected: logs are read-only and render timestamp/action/user/module/details correctly

## Known environment-sensitive items

- If register/login shows `404`, restart frontend and confirm Vite proxy config.
- If token refresh fails, inspect backend `/api/auth/token/refresh/` request mode (cookie vs body).
- If Swagger/docs schema warnings reappear, run backend from active virtualenv and regenerate schema.
