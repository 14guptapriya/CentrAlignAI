# CentrAlign AI

CentrAlign AI is a web application for creating and sharing forms. Users can register or sign in, describe a form in natural language, and use Google Gemini to generate a form schema. The frontend also includes a public form page and file-upload controls.

## Project structure

```text
backend/   Express API, MongoDB models, authentication, and AI integrations
frontend/  Next.js app for the dashboard, form generation, and public forms
```

## Requirements

- Node.js 18.18 or newer and npm
- A MongoDB database
- A Google Gemini API key for AI form generation
- Cloudinary credentials if you want to use file uploads

## Configuration

Create `backend/.env` and set the variables below. Keep this file private and do not commit it.

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=your_gemini_api_key

# Needed for file uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

The API defaults to `http://localhost:4000`. To use another API URL, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Run locally

Open two terminals from this project directory.

**Terminal 1 — backend**

```powershell
cd backend
npm install
npm run dev
```

The Express API listens on port `4000` by default.

**Terminal 2 — frontend**

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Next.js (usually `http://localhost:3000`).

## Main capabilities

- Account registration and login with JWT-based authentication
- AI form-schema generation from a text prompt
- A dashboard for viewing forms
- A public form page with text, email, number, select, textarea, and file fields
- Form submission storage in MongoDB
- File uploads through Cloudinary

## API routes

The backend mounts its routers at `/auth`, `/forms`, `/submit`, and `/upload`. The implemented routes include:

- `POST /auth/register` — create an account
- `POST /auth/login` — log in and receive a JWT
- `POST /forms/generate` — generate and save a form schema
- `POST /submit/:formId` — save a form submission
- `POST /upload` — upload a file to Cloudinary

## Available scripts

| Directory | Command | Description |
|---|---|---|
| `backend` | `npm run dev` | Start the API with Nodemon |
| `frontend` | `npm run dev` | Start the Next.js development server |
| `frontend` | `npm run build` | Build the frontend for production |
| `frontend` | `npm run start` | Serve the production frontend build |
| `frontend` | `npm run lint` | Run the Next.js linter |
