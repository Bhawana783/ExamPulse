# ExamPulse Backend

Production-ready Express + MongoDB API for exam discovery, registration-deadline tracking, and user notifications.

## Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:

```bash
npm install
```

3. Start MongoDB locally or use a cloud URI.
4. Run server:

```bash
npm run dev
```

5. (Optional) seed sample exams:

```bash
npm run seed
```

## API Endpoints

- `POST /api/auth/register` register user and get JWT token
- `POST /api/auth/login` login and get JWT token
- `GET /api/auth/me` get logged-in profile
- `GET /api/exams` search/filter exams with pagination
- `GET /api/exams/featured` latest featured exam cards
- `GET /api/exams/search/live?q=<query>` real-time workspace search with eligibility/syllabus/deadlines/official links + live web updates
- `GET /api/exams/:id` full exam details
- `POST /api/exams/:id/subscribe` subscribe to deadline notifications (auth)
- `POST /api/exams/:id/unsubscribe` unsubscribe exam tracking (auth)
- `GET /api/exams/subscriptions/me` tracked exams (auth)
- `GET /api/exams/deadlines/upcoming` upcoming tracked deadlines (auth)
- `GET /api/students/me` profile with tracked exams (auth)
- `PUT /api/students/me/preferences` update category/level/country preferences (auth)
- `GET /api/students/me/notifications` notification feed (auth)
- `POST /api/students/me/notifications/generate-deadline-reminders` create due reminders from tracked exams (auth)
- `PATCH /api/students/me/notifications/:id/read` mark one notification as read (auth)
- `PATCH /api/students/me/notifications/read-all` mark all notifications as read (auth)

## Auth

Send token as:

```http
Authorization: Bearer <jwt>
```

Admin-only endpoints:

- `POST /api/exams`
- `PUT /api/exams/:id`
- `DELETE /api/exams/:id`

