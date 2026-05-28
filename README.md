# QueryAI - AI-Powered SQL Query Optimizer

QueryAI is a full-stack web application that allows users to instantly optimize their SQL queries using the Groq API. The app supports authentication, saves a history of query optimizations, and provides detailed performance analysis including index suggestions and issue detection.

## 🚀 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS (v3)
- **Backend**: Node.js + Express
- **AI Integration**: Groq API (`llama-3.3-70b-versatile`)
- **Database & Auth**: Supabase

## 🛠️ Local Setup

### 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Obtain your Project URL, anon key, and service role key from Project Settings > API.

### 2. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Copy the environment file: `cp .env.example .env` (or create a `.env` file)
4. Update the `.env` file with your credentials:
   - `GROQ_API_KEY`: Your Groq API key
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_KEY`: Your Supabase service role key (for backend admin tasks)
5. Start the server: `npm run dev` (Runs on http://localhost:5000)

### 3. Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Copy the environment file: `cp .env.example .env` (or create a `.env` file)
4. Update the `.env` file:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `VITE_API_URL`: `http://localhost:5000/api`
5. Start the Vite dev server: `npm run dev`
