import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, size, style } = await request.json();

    const dimMap = {
      '16': 512,
      '32': 512,
      '64': 1024,
      '128': 1024,
    };
    const dimension = dimMap[size] || 512;

    // 公式モデルを「stability-ai/sdxl」の形式で指定し、バージョン切れエラーを完全に防止する
    const output = await replicate.run(
      "stability-ai/sdxl",
      {
        input: {
          prompt: `retro 8-bit pixel art of ${prompt}, ${style}, single video game character sprite, crisp pixels, centered, isolated on solid white background, flat background`,
          negative_prompt: "complex background, scenery, map, UI, frame, border, 3d render, photorealistic, blurry, smooth, gradient, realistic photo",
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
