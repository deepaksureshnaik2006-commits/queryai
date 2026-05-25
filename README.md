# QueryAI - AI-Powered SQL Query Optimizer

QueryAI is a full-stack web application that allows users to instantly optimize their SQL queries using Google's Gemini 2.5 Flash API. The app supports authentication, saves a history of query optimizations, and provides detailed performance analysis including index suggestions and issue detection.

## 🚀 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS (v3)
- **Backend**: Node.js + Express
- **AI Integration**: Gemini API (`gemini-2.5-flash`)
- **Database & Auth**: Supabase
- **Hosting**: Designed for Vercel (Frontend) and Render/Railway (Backend)

## 📁 Project Structure

```
queryai/
├── frontend/                  # React app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── lib/               # Supabase client & API wrappers
│   │   ├── context/           # Auth context
│   │   ├── App.jsx            # Routing setup
│   │   └── main.jsx           # Entry point
│   ├── .env                   # Frontend env variables
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                   # Node.js Express API
│   ├── routes/
│   │   ├── optimize.js        # Gemini API endpoint
│   │   └── history.js         # Supabase history endpoints
│   ├── middleware/
│   │   └── auth.js            # Supabase JWT verification
│   ├── lib/
│   │   └── supabase.js        # Supabase admin client
│   ├── index.js               # Express entry point
│   ├── .env                   # Backend env variables
│   └── package.json
│
├── supabase_schema.sql        # SQL to create tables in Supabase
└── README.md
```

## 🛠️ Local Setup

### 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor in your Supabase dashboard and run the contents of `supabase_schema.sql` to create the `query_history` table and set up Row Level Security.
3. Obtain your Project URL, anon key, and service role key from Project Settings > API.

### 2. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Copy the environment file: `cp .env.example .env`
4. Update the `.env` file with your credentials:
   - `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_KEY`: Your Supabase service role key (for backend admin tasks)
5. Start the server: `npm run dev` (Runs on http://localhost:5000)

### 3. Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Copy the environment file: `cp .env.example .env`
4. Update the `.env` file:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `VITE_API_URL`: `http://localhost:5000/api`
5. Start the Vite dev server: `npm run dev`

## 🌍 Deployment

### Backend (Render.com - Free Tier)
1. Push your code to a GitHub repository.
2. Go to Render and create a new "Web Service".
3. Connect your repository and set the **Root Directory** to `backend`.
4. Build command: `npm install`
5. Start command: `node index.js`
6. Add your environment variables in the Render dashboard.

### Frontend (Vercel - Free Tier)
1. Go to Vercel and import your GitHub repository.
2. Set the **Root Directory** to `frontend`.
3. Framework preset should automatically detect "Vite".
4. Build command: `npm run build`
5. Add your environment variables in the Vercel dashboard. Note: Update `VITE_API_URL` to point to your new Render backend URL (e.g., `https://your-backend.onrender.com/api`).
