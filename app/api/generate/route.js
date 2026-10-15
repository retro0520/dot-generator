import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, size, style } = await request.json();

    // 16x16選択時は解像度を思い切り小さくし、大きなドットの塊を強制します
    const dimMap = {
      '16': 256,
      '32': 256,
      '64': 512,
      '128': 1024,
    };
    const dimension = dimMap[size] || 512;

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: `16-bit retro video game sprite of ${prompt}, style: ${style}, low resolution pixel art, chunky pixels, sharp hard edges, solid white background, flat color, no gradients`,
          negative_prompt: "high resolution, smooth gradients, anti-aliasing, modern digital art, 3d render, photorealistic, blurry, sprite sheet, multiple characters, complex background, grid lines, frame, border",
          width: dimension,
          height: dimension,
          guidance_scale: 8.0,
          num_outputs: 1,
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
