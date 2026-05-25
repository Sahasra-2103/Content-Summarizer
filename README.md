# AI-Powered Content Summarizer

A complete production-ready full-stack application that intelligently summarizes content using AI.

## Features
- Custom summaries (Brief, Bullet Points, Detailed, Key Highlights, etc.)
- Length selection (Very Short, Short, Medium, Long, Detailed)
- Custom instructions for AI
- Light/Dark mode themes
- History and Analytics dashboard
- Copy, Export functionality

## Tech Stack
- Frontend: React.js, Vite, Vanilla CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- AI: Grok API

## Setup Instructions
1. Run `npm run install-all` from the root directory.
2. Setup environment variables in the `.env` file inside the `server/` directory:
   \`\`\`
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   GROK_API_KEY=your_grok_api_key
   GROK_MODEL=grok-4
   AI_PROVIDER=grok
   \`\`\`
3. Run `npm run dev` from the root directory to start both the frontend and backend.

## Deployment (Vercel)
- Make sure to add the environment variables in Vercel project settings.
- Import the project into Vercel, it uses `vercel.json` for deployment configuration.
