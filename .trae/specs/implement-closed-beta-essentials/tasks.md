# Tasks

- [x] Task 1: Add Terms of Service and Logout to Frontend
  - [x] SubTask 1.1: Add "I agree to Terms of Service" checkbox in `frontend/src/components/AuthModal.tsx` for the register view.
  - [x] SubTask 1.2: Add a User Profile menu/button in the `frontend/src/components/Layout.tsx` or `Navbar.tsx` that displays the user's `credits` and `invite_code`, and provides a `Logout` button.
  - [x] SubTask 1.3: Ensure the `logout` function from `useAuthStore.ts` correctly redirects the user to the landing page (`/`).

- [x] Task 2: Implement Backend Rate Limiting
  - [x] SubTask 2.1: Add `slowapi` to `backend/pyproject.toml` (if using FastAPI).
  - [x] SubTask 2.2: Configure a global rate limiter in `backend/app/main.py` or `app/gateway/server.py` (e.g., 60 requests per minute per IP).

- [x] Task 3: Implement Real Credit Deduction
  - [x] SubTask 3.1: Locate the main chat endpoint (`backend/app/gateway/routers/threads.py` or similar).
  - [x] SubTask 3.2: Add logic to check if `user.credits > 0`. If not, raise `HTTPException(402, "Insufficient credits")`.
  - [x] SubTask 3.3: Deduct credits (e.g., -1 per message) from the database `User` model after a successful chat interaction and commit the transaction.
