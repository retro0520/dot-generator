import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, size, style } = await request.json();

    const pixelSize = parseInt(size, 10) || 16;

    // Retro Diffusion専用のパラメータを付与し、3D感を完全に排除して強制的にドット絵化します
    const output = await replicate.run(
      "retro-diffusion/rd-plus",
      {
        input: {
          prompt: `pixel art, 8-bit NES sprite of ${prompt}, style: ${style}, flat colors, sharp hard pixels, 2D game asset, solid white background`,
          negative_prompt: "3d render, photorealistic, smooth, gradients, soft shading, blurry, modern art",
          width: 512,
          height: 512,
          // モデル側でピクセル感を強めるための設定
          upscale: false,
          grid: true,
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
