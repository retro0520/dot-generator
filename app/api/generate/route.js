import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, size, style } = await request.json();

    // Retro Diffusionの制限（最大384以下）に合わせた解像度設定
    const dimMap = {
      '16': 256,
      '32': 320,
      '64': 384,
      '128': 384,
    };
    const dimension = dimMap[size] || 256;

    const output = await replicate.run(
      "retro-diffusion/rd-plus",
      {
        input: {
          prompt: `pixel art, 8-bit NES retro game character sprite of ${prompt}, style: ${style}, flat colors, sharp hard pixels, 2D game asset, solid white background`,
          negative_prompt: "3d render, photorealistic, smooth, gradients, soft shading, blurry, modern art",
          width: dimension,
          height: dimension,
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
