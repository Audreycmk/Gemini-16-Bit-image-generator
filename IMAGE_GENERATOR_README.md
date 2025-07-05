# 16x16 Image Generator

A Next.js application that generates pixel art using Gemini AI. Users can describe what they want to create, and the AI will place colored pixels on a 16x16 grid to build the image progressively.

## Features

- 16x16 pixel grid canvas
- Text input for describing what to create
- Gemini AI integration for intelligent pixel placement
- Real-time pixel generation
- Clear canvas functionality
- Responsive design

## Setup

1. **Get a Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

2. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Image Generator**
   Navigate to `http://localhost:3000/image-generator`

## How to Use

1. Type a description in the text box (e.g., "a yellow duck", "red apple", "blue sky")
2. Press Enter or click "Generate Pixel"
3. The AI will place a colored pixel at a strategic location
4. Continue adding pixels to build your image
5. Use the "Clear" button to start over

## How It Works

- The application sends your text description to Gemini AI
- Gemini analyzes the description and returns:
  - A hex color code that best represents the described object/color
  - A specific position (column and row) on the 16x16 grid
- The pixel is placed at that exact location with the chosen color
- Each pixel builds upon the previous ones to create the final image

## Technical Details

- Built with Next.js 15 and TypeScript
- Uses Tailwind CSS for styling
- Gemini AI integration via `@google/generative-ai`
- 16x16 grid implemented with CSS Grid
- Real-time state management with React hooks

## API Endpoint

The `/api/generate-pixel` endpoint:
- Accepts POST requests with a `prompt` field
- Returns JSON with `hexCode`, `column`, and `row` values
- Handles error cases and validates responses
- Ensures pixel positions are within the 16x16 bounds 