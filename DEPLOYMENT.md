# Deployment Guide for Netflix Clone

This guide will help you deploy the Netflix Clone application on different platforms.

## Prerequisites

- GitHub account
- MongoDB Atlas account (or any MongoDB provider)
- Node.js v18+ installed locally for testing

## Environment Variables

Before deploying, you need to set up the following environment variables:

- `DATABASE_URL`: Your MongoDB connection string
- `SESSION_SECRET`: A random string for session encryption
- `ALLOWED_ORIGINS`: In production, a comma-separated list of allowed frontend origins
- `NODE_ENV`: Set to 'production' in production environments

## Deployment Options

### 1. Vercel Deployment (Recommended)

Vercel offers one of the easiest ways to deploy full-stack applications from GitHub.

1. Push your code to GitHub
2. Sign up for Vercel and connect your GitHub repository
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add the environment variables listed above in the Vercel dashboard
5. Deploy!

### 2. Netlify Deployment

1. Push your code to GitHub
2. Sign up for Netlify and connect your GitHub repository
3. Configure the build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Add environment variables in the Netlify dashboard
5. Set up Netlify Functions for the backend API

### 3. Railway Deployment

1. Create an account on Railway
2. Connect your GitHub repository
3. Configure environment variables
4. Railway will automatically build and deploy your app

### 4. Separation of Frontend and Backend

If you prefer to deploy frontend and backend separately:

#### Frontend (GitHub Pages, Vercel, Netlify):
1. Update API URLs to point to your backend
2. Build and deploy only the frontend

#### Backend (Heroku, Render, Digital Ocean):
1. Deploy only the server code
2. Set environment variables including CORS settings
3. Make sure your MongoDB instance is accessible from the backend server

## Handling CORS

This application is already configured to handle CORS for cross-origin requests. In production:

1. Make sure `ALLOWED_ORIGINS` is set to the actual domain of your frontend
2. The session cookie is configured to work across origins with `sameSite: 'none'`

## Database Considerations

1. Your MongoDB Atlas cluster must allow connections from your deployment platform
2. For MongoDB Atlas:
   - Go to Network Access in your Atlas dashboard
   - Add the IP address of your hosting provider or use 0.0.0.0/0 (allow from anywhere)

## Troubleshooting

- **Session/Authentication Issues**: Check cookie settings and CORS configuration
- **Database Connection Errors**: Verify MongoDB connection string and network access
- **API Errors**: Check environment variables and make sure backend routes are accessible

## Local Development After Deployment

To continue development locally:

1. Clone the repository
2. Create a `.env` file based on `.env.example`
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`