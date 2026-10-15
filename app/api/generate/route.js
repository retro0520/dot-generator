import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, size, style } = await request.json();

    // 選択された解像度（16, 32など）をそのままピクセルサイズとして指定
    const pixelSize = parseInt(size, 10) || 16;

    // 本物のドット絵・ゲームスプライト専用モデル（Retro Diffusion RD Plus）を使用
    const output = await replicate.run(
      "retro-diffusion/rd-plus",
      {
        input: {
          prompt: `retro 8-bit NES game character sprite of ${prompt}, style: ${style}, clean pixel art, grid-aligned, solid white background`,
          negative_prompt: "blurry, smooth, gradient, photorealistic, 3d render, complex background",
          width: pixelSize <= 16 ? 256 : pixelSize <= 32 ? 512 : 512,
          height: pixelSize <= 16 ? 256 : pixelSize <= 32 ? 512 : 512,
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
