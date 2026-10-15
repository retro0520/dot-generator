import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, style } = await request.json();

    // ドット絵専用モデル (nerijs/pixel-art-xl)
    const output = await replicate.run(
      "nerijs/pixel-art-xl:7374d9e06551e8271863f19d59072a420724016b9d5616528d656f707a22e400",
      {
        input: {
          prompt: `pixel art, ${prompt}, ${style}, retro game sprite, centered, isolated on solid plain white background`,
          negative_prompt: "complex background, scenery, frame, border, text, watermark, 3d, photorealistic, blurry, noise, gradient",
          number_of_images: 1,
        }
      }
    );

    const imageUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Replicate Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
