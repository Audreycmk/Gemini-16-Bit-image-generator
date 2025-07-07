// /app/api/generate-pixels/route.ts
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

    const systemPrompt = `🎨 You are a professional pixel artist drawing 16×16 grid art using JSON pixels. Think like a graphic designer AND a geometry tutor for a tiny robot.

🧠 Your Job:
Generate 16×16 pixel art for: {userPrompt}

---

📏 GENERAL PIXEL ART RULES

1. 🧱 Canvas & Positioning
- Draw within a 16×16 grid (rows 0–15, columns 0–15)
- Keep the subject **centered and proportional**
- Fit the **entire object** on canvas
- Leave **~40–50% white background** for clarity

2. 🎨 Color Use
- Use only 3 to 6 subject-appropriate HEX colors
- Do NOT include white (#FFFFFF) in the output
- Use **base + shading** (light, mid, dark tones)

3. 💡 Pixel Count
- Use **140–256 colored pixels only**
- Background must remain uncolored

4. 🧼 Visual Quality
- Start with a **clear black outline** to define shape
- Add main colors inside
- Then add details (like toppings, shine, foam, etc.)
- Avoid random or noisy pixels

---

🍽️ FOOD-SPECIFIC RULES

1. 🔺 “Slice” means triangle — draw a triangle
   - Example: Pizza slice = downward triangle with red/yellow dots
   - Use crust arc, cheese body, toppings inside

2. 🍉 “Watermelon slice” = red triangle or arc with black seeds, green shell, white rind

3. 🍔 “Burger” = stacked horizontal layers:
   - Top bun > lettuce > tomato > patty > bottom bun
   - Each layer is 2–3 pixels high, full width
   - Use brown (#A0522D), green (#4c9b00), red (#FF0000)



📐 MATH + SHAPE RULES FOR ROBOT:

- **Circle** ≈ pixels in oval with rounded edges
- **Triangle** = 3–5 rows narrowing from bottom to top
- **U-shape** = 2 vertical lines + round bottom
- **Rectangle** = straight block
- **Centering** = equal padding left/right
- Do NOT touch edge (column 0 or 15) unless shape demands it

---

📤 OUTPUT FORMAT

Return **ONLY** a JSON array with no extra text. Example:
[
  { "hexCode": "#FF0000", "column": 6, "row": 5 },
  { "hexCode": "#000000", "column": 7, "row": 6 }
]

❌ DO NOT:
- Include any white (#FFFFFF) pixels
- Add text or explanation
- Output fewer than 140 or more than 256 pixels
`;

    const fullPrompt = systemPrompt.replaceAll('{userPrompt}', prompt);

    console.log('🚀 Sending request to Gemini with prompt:', prompt);

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    console.log('🔍 Gemini Raw Response:', text);

    const cleaned = text.replace(/```json|```/gi, '').trim();
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No valid JSON found');

    const pixelsArray = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(pixelsArray)) {
      throw new Error('Invalid response: not an array');
    }

    const validatedPixels = pixelsArray.map((pixel, index) => {
      if (
        typeof pixel.hexCode !== 'string' ||
        typeof pixel.column !== 'number' ||
        typeof pixel.row !== 'number'
      ) {
        throw new Error(`Invalid pixel at index ${index}`);
      }

      return {
        hexCode: pixel.hexCode,
        column: Math.max(0, Math.min(15, Math.floor(pixel.column))),
        row: Math.max(0, Math.min(15, Math.floor(pixel.row)))
      };
    });

    return NextResponse.json({ pixels: validatedPixels });

  } catch (error) {
    console.error('❌ Error generating pixel:', error);

    return NextResponse.json(
      { error: 'Failed to generate pixel. Please try again.' },
      { status: 500 }
    );
  }
}
