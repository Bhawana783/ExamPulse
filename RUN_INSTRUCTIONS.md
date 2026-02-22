# How to Run ExamPulse

Follow these steps to get the ExamPulse application up and running on your local machine.

## Prerequisites
1.  **Node.js**: Ensure you have Node.js installed (v16+ recommended).
2.  **MongoDB**: You need a running MongoDB instance. By default, the app looks for `mongodb://localhost:27017/exampulse`.
    *   If you use a different URI, update it in `backend/.env`.

---

## Step 1: Backend Setup
1.  Open a terminal and navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the backend server:
    ```bash
    npm start
    ```
    The server should now be running at `http://localhost:5000`.

---

## Step 2: Frontend Setup
1.  Open a **new** terminal and navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser to the URL shown in the terminal (usually `http://localhost:5173`).

---

## Step 3: (Optional) Data Pipeline
To populate your database with real exam data, you can run the scraper or RSS parser scripts manually:
- **Scraper**: `node src/scripts/scraper.js`
- **RSS Parser**: `node src/scripts/rssParser.js`

> [!TIP]
> Make sure the backend server is NOT running when you execute these scripts if you want to avoid port conflicts, or simply run them in a separate terminal.

---

## Troubleshooting
- **Database Connection Error**: Ensure MongoDB is running locally or check the `MONGO_URI` in `backend/.env`.
- **Firebase Warnings**: The app will show warnings if Firebase credentials are missing, but it will fall back to "Mock" mode so you can still test the UI.
