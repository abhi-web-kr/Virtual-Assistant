# AI Virtual Assistant

An intelligent voice-controlled assistant built with React and Node.js, powered by Google's Gemini AI. Create your own personalized AI companion that responds to voice commands and performs various web tasks.

## Overview

This project allows users to build their own virtual assistant with a custom name and appearance. The assistant listens continuously for its name followed by commands, processes them using Gemini AI, and responds with both voice and actions.

## What It Does

Your personalized assistant can:

- **Respond to voice commands** in natural language
- **Open websites** like Facebook, Instagram, YouTube
- **Perform searches** on Google and YouTube
- **Provide information** about time, date, weather
- **Answer questions** using AI-powered conversation
- **Remember your interactions** with conversation history
- **Speak responses** using text-to-speech in Hindi

## Technology

**Frontend:**

- React with Vite for fast development
- Tailwind CSS for modern styling
- Web Speech API for voice recognition and synthesis
- React Router for navigation
- Axios for API communication

**Backend:**

- Express.js REST API
- MongoDB database with Mongoose
- JWT authentication with secure cookies
- Cloudinary for image storage
- Google Gemini AI for natural language understanding

## Getting Started

### Requirements

- Node.js installed on your system
- MongoDB running locally or cloud instance
- Cloudinary account for image uploads
- Google Gemini API key

### Setup Backend

1. Navigate to backend directory:

```bash
cd backend
npm install
```

2. Create `.env` file with these variables:

```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
API_KAY_2=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

3. Start the server:

```bash
npm run dev
```

### Setup Frontend

1. Navigate to frontend directory:

```bash
cd frontend
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open browser at `http://localhost:5173`

## How to Use

### First Time Setup

1. **Create Account** - Sign up with your name, email, and password
2. **Choose Avatar** - Select from gallery or upload your own image
3. **Name Your Assistant** - Give your assistant a unique name
4. **Grant Permissions** - Allow microphone access when prompted

### Talking to Your Assistant

Simply say your assistant's name followed by your command:

```
"Jarvis, search for React tutorials"
"Friday, what time is it?"
"Alex, open YouTube"
"Luna, play some music"
```

The assistant will process your request and respond with voice feedback.

### Supported Commands

| Command Type | Example                                      |
| ------------ | -------------------------------------------- |
| Web Search   | "search JavaScript on Google"                |
| YouTube      | "play Coldplay on YouTube"                   |
| Social Media | "open Facebook" / "open Instagram"           |
| Weather      | "what's the weather"                         |
| Time & Date  | "what time is it" / "what's today's date"    |
| Calculator   | "open calculator"                            |
| Questions    | "who created you" / ask any factual question |

## Project Architecture

```
├── backend/
│   ├── config/          # Database, Cloudinary, JWT setup
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth and file upload
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── gemini.js        # AI integration
│   └── index.js         # Server initialization
│
├── frontend/
│   ├── src/
│   │   ├── assets/      # Images and media
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Global state management
│   │   ├── pages/       # Application screens
│   │   ├── App.jsx      # Main app with routing
│   │   └── main.jsx     # Entry point
│   └── index.html
```

## API Documentation

### Auth Routes

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/logout` - Clear session

### User Routes

- `GET /api/user/current` - Fetch logged-in user data
- `PUT /api/user/update-assistant` - Update assistant name/image
- `POST /api/user/askToAssistant` - Process voice command

## Features in Detail

### Continuous Voice Recognition

The app maintains an active listening state, automatically restarting recognition after:

- Assistant finishes speaking
- No speech detected
- Recognition errors occur
- User command is processed

### Smart Command Processing

Commands are sent to Gemini AI which determines:

- **Intent type** (search, time, weather, etc.)
- **Extracted data** (search terms, video names)
- **Response text** (natural language reply)

The frontend then executes the appropriate action (open URL, display info, etc.)

### Conversation Memory

Every command you speak is stored in your history, visible in the sidebar menu for reference.

## Browser Compatibility

Works best in **Google Chrome** or **Microsoft Edge**. These browsers have the most reliable Web Speech API implementation.

## Troubleshooting

**Voice not recognized?**

- Check microphone permissions in browser settings
- Speak clearly and include assistant's name
- Ensure you're in a quiet environment

**Assistant not responding?**

- Verify backend server is running
- Check console for API errors
- Confirm Gemini API key is valid

**Images not uploading?**

- Verify Cloudinary credentials
- Check image file size (keep under 5MB)

## Development

Built by ❤️ Abhishek as a full-stack demonstration of modern web technologies and AI integration.

