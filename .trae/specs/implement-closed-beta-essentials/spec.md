# Implement Closed Beta Essentials Spec

## Why
Before launching the SaaS product for a closed beta, several critical features are missing. These include actual credit deduction logic during chat, user profile management (to view credits, invite codes, and logout), basic rate limiting to prevent abuse, and Terms of Service for legal compliance.

## What Changes
- Implement actual credit deduction logic when users interact with the chat API.
- Create a User Profile UI in the frontend to display the user's current credits, invite code, and provide a logout button.
- Add a Terms of Service (ToS) checkbox to the registration modal.
- Implement basic rate limiting on the backend API using SlowAPI or a similar lightweight solution.

## Impact
- Affected specs: Authentication, Chat/Billing, User Management.
- Affected code: `backend/app/auth/router.py`, `backend/app/chat/router.py` (or equivalent), `frontend/src/components/AuthModal.tsx`, `frontend/src/components/Layout.tsx` (for profile/logout).

## ADDED Requirements
### Requirement: Credit Deduction
The system SHALL deduct credits from the user's account when they send a message or perform an analysis.
#### Scenario: Success case
- **WHEN** user sends a message in the chat
- **THEN** their credit balance is reduced by a predefined amount, and if insufficient, the request is rejected with a 402/403 error.

### Requirement: User Profile & Logout
The system SHALL provide a UI for logged-in users to view their details and log out.
#### Scenario: Success case
- **WHEN** user clicks on their avatar/profile in the layout
- **THEN** they see their `credits` and `invite_code`, and can click "Logout" to clear their session and return to the landing page.

### Requirement: Terms of Service
The system SHALL require users to agree to the Terms of Service during registration.

### Requirement: Rate Limiting
The system SHALL limit the number of requests a user can make to the API within a certain timeframe to prevent abuse.
