import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, size, style } = await request.json();

    // 画面で選ばれたサイズに応じた解像度設定（SDXLが破綻しない最低限のサイズを維持しつつ調整）
    const dimMap = {
      '16': 512,
      '32': 512,
      '64': 1024,
      '128': 1024,
    };
    const dimension = dimMap[size] || 512;

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: `cute ${prompt}, pixel art style, ${style}, retro 8-bit NES game sprite, single character, solid white background, flat background, no complex background, game asset`,
          negative_prompt: "complex background, scenery, realistic, photorealistic, 3d render, blurry, smooth, gradient, ugly, scary, creepy",
          width: dimension,
          height: dimension,
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
