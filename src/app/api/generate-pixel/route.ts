// app/api/generate-pixels/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `🎨 You are a professional pixel artist generating 16x16 pixel art based on user prompts.

🧠 Your Task:
1. Create a pixelated image on a 16x16 grid based on the prompt (e.g., "Super Mario", "tree", "yellow duck").
2. The subject must:
   - Fit entirely within the 16x16 canvas.
   - Be centered and proportional.
   - Maximize use of the canvas — try to fill as much of the space as possible.
   - Begin with a clear shape outline, then add internal details.
3. Use between 140 and 256 non-white pixels to form a clear, recognizable, and detailed image.

📐 Layout Rules:
- Use 0-based coordinates:
  - row: 0–15 (top to bottom)
  - column: 0–15 (left to right)
- Background (empty spaces) should remain white (#FFFFFF) and should not be included in output.

🎨 Color Guidelines:
- Use realistic, subject-appropriate colors.
- For characters:
  - Prioritize the face, eyes, lips, body, and signature accessories.
- For objects:
  - Use shading and highlights (light, mid, dark tones) to create depth.
  - Outline and silhouette clarity is most important.

📤 Output Format:
- Return a JSON array only, with no explanation or extra text.
- Each entry must include:
  - hexCode (e.g. "#A8E6CF")
  - column (0–15)
  - row (0–15)

Example Prompt: "Purple Circle"
- Goal: A purple circle that fills most of the canvas, centered and shaded for depth.
- Output:
[
  { "hexCode": "#D1B3FF", "column": 6, "row": 3 },
  { "hexCode": "#C084FC", "column": 7, "row": 3 },
  { "hexCode": "#9333EA", "column": 8, "row": 3 },
  ...
  { "hexCode": "#D1B3FF", "column": 6, "row": 12 },
  { "hexCode": "#C084FC", "column": 7, "row": 12 },
  { "hexCode": "#9333EA", "column": 8, "row": 12 }
]
- Uses three shades of purple for depth:
  - Light: #D1B3FF
  - Mid: #C084FC
  - Dark: #9333EA
- Circle is centered and fills most of the grid for maximum visual impact.

Do NOT:
- Include white pixels in the output.
- Add any text outside the JSON.
- Output fewer than 140 or more than 256 pixels.
`;

    console.log(' Sending request to Gemini with prompt:', prompt);
    
    const result = await model.generateContent([
      systemPrompt,
      `Generate a complete pixel art image for: "${prompt}"`
    ]);

    const response = await result.response;
    const text = response.text();
    
    console.log('🔍 Gemini Response:', text);
    console.log('📝 Raw text length:', text.length);
    
    // Remove code block markers if present
    const cleaned = text.replace(/```json|```/gi, '').trim();
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log('❌ No JSON array found in response');
      throw new Error('Invalid response format from Gemini');
    }

    console.log('🎯 Extracted JSON:', jsonMatch[0]);
    const pixelsArray = JSON.parse(jsonMatch[0]);
    console.log('✅ Parsed pixels array:', pixelsArray);
    
    // Validate the response
    if (!Array.isArray(pixelsArray)) {
      console.log('❌ Response is not an array:', pixelsArray);
      throw new Error('Invalid response format - expected array');
    }

    // Validate each pixel and ensure values are within bounds
    const validatedPixels = pixelsArray.map((pixel, index) => {
      if (!pixel.hexCode || typeof pixel.column !== 'number' || typeof pixel.row !== 'number') {
        console.log(`❌ Invalid pixel at index ${index}:`, pixel);
        throw new Error(`Invalid pixel data at index ${index}`);
      }
      
      return {
        hexCode: pixel.hexCode,
        column: Math.max(0, Math.min(15, Math.floor(pixel.column))),
        row: Math.max(0, Math.min(15, Math.floor(pixel.row)))
      };
    });
    
    console.log('🎨 Final validated pixels:', validatedPixels);
    console.log('📊 Total pixels generated:', validatedPixels.length);
    return NextResponse.json({ pixels: validatedPixels });
  } catch (error) {
    console.error('Error generating pixel:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid or missing Gemini API key. Please check your .env.local file.' },
          { status: 500 }
        );
      }
      if (error.message.includes('404')) {
        return NextResponse.json(
          { error: 'Gemini API model not found. Please check the model name.' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate pixel. Please try again.' },
      { status: 500 }
    );
  }
}
