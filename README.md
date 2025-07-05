# Gemini 16-Bit Image Generator

Testing Google's Gemini AI creating 16-bit pixel art images for fun. This project allows users to create retro-style pixel art by providing text prompts to the Gemini AI model.

## Features

- 🎨 Generate 16-bit pixel art images from text prompts
- 🤖 Powered by Google's Gemini AI

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Generative AI (Gemini)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gemini-16-bit-image-generator.git
cd gemini-16-bit-image-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your API key:
```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Enter a text prompt describing the image you want to generate
2. Click "Generate" to create your 16-bit pixel art

## API Routes

- `/api/generate-image` - Generate images using Gemini AI

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run start:backend` - Start backend server

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Gemini AI for image generation capabilities
- Next.js team for the amazing framework
