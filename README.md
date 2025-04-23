# sRecipe Generator

A modern recipe generator application built with React that creates recipes based on available ingredients using the Gemini AI API.

## Features

- Add and manage pantry items
- Search through available ingredients
- Generate recipes based on selected ingredients
- View recipe history with expandable details
- Clean and modern UI with Tailwind CSS
- Powered by Google's Gemini AI

## Setup

1. Clone the repository
```bash
git clone [repository-url]
cd recipe-generator-app
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Gemini API key:
```
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm start
```

## Deployment

This project can be deployed on Render. Follow these steps:

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the following settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `serve -s build`
4. Add your environment variables in Render's dashboard

## Technologies Used

- React
- Tailwind CSS
- Google Gemini AI
- React Hot Toast
- Poppins Font
