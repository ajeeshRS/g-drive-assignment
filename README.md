# G-Drive Assignment

This is a full-stack application with a Next.js frontend and Node.js/Express backend.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (for the backend database)
- Google Cloud Platform account (for OAuth)

## Project Structure

```
.
├── frontend/          # Next.js frontend application
└── backend/          # Node.js/Express backend application
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_SECRET=your_session_secret
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the frontend directory with the following variable:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5001
   ```

## Running the Application

### Development Mode

1. Start the backend server (from the backend directory):
   ```bash
   npm run dev
   ```

2. In a new terminal, start the frontend development server (from the frontend directory):
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001 (or the port specified in your backend configuration)

### Production Mode

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start the frontend production server:
   ```bash
   npm start
   ```

3. Build and start the backend:
   ```bash
   cd backend
   npm run build
   npm start
   ```

## Deployment Instructions

### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth Client ID
5. Select "Web application"
6. Add authorized JavaScript origins:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
7. Add authorized redirect URIs:
   - Development: `http://localhost:5000/auth/google/callback`
   - Production: `https://your-api-domain.com/auth/google/callback`
8. Copy the Client ID and Client Secret to your backend `.env` file

### Database Configuration

1. Set up a MongoDB database:
   - Local: Install MongoDB locally
   - Cloud: Use MongoDB Atlas or similar service
2. Get the connection string and add it to your backend `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   ```

### Production Deployment

1. Backend Deployment:
   - Choose a hosting provider (e.g., Heroku, DigitalOcean, AWS)
   - Set up environment variables
   - Deploy the built application
   - Configure SSL/TLS

2. Frontend Deployment:
   - Choose a hosting provider (e.g., Vercel, Netlify)
   - Set up environment variables
   - Configure build settings
   - Set up custom domain and SSL

3. Update Environment Variables:
   - Backend `.env`:
     ```
     MONGODB_URI=your_production_mongodb_uri
     GOOGLE_CLIENT_ID=your_production_client_id
     GOOGLE_CLIENT_SECRET=your_production_client_secret
     SESSION_SECRET=your_production_session_secret
     ```
   - Frontend `.env.local`:
     ```
     NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
     ```

## Features

- Google OAuth authentication
- File upload and management
- PDF viewer
- Modern UI with Tailwind CSS
- TypeScript support

## Technologies Used

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn components
- Axios for API calls

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Passport.js for authentication
- Multer for file uploads

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 