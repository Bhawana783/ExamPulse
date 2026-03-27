# ExamPulse

ExamPulse is now upgraded to a real-world exam platform with:

- secure JWT authentication
- role-aware backend APIs
- global exam catalog (national + international)
- complete exam data model:
  - eligibility criteria
  - syllabus sections
  - registration deadlines
  - exam dates
  - official links
- subscription-based deadline tracking
- user notification center
- modern responsive UI connected to real APIs

## Tech Stack

- Frontend: React + Vite + Tailwind + Framer Motion
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: bcrypt + JWT

## Project Structure

- `client/` React frontend
- `backend/` Express REST API

## Local Run

## 0) One-Command Full Stack Run

From project root:

```bash
npm install
npm run install:all
npm run dev
```

This starts both backend and frontend together.

## 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

If you want initial sample exams:

```bash
npm run seed
```

## 2) Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`
Backend default URL: `http://localhost:5000`

## What Users Can Do

- Register and login securely
- Explore national and international exams
- Search and filter by category and level
- View exam eligibility and syllabus sections
- Open official registration links
- Track exams and get deadline notifications
- Review and mark notifications as read

## Notes

- Seeding requires a running MongoDB connection.
- Firebase push service is optional and can be configured later using `FIREBASE_SERVICE_ACCOUNT_PATH`.
