import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, size, style } = await request.json();

    // ドット絵専用モデルの仕様に合わせて解像度を最適化
    const dimMap = {
      '16': 512,
      '32': 512,
      '64': 512,
      '128': 1024,
    };
    const dimension = dimMap[size] || 512;

    // ドット絵・ゲームスプライト専用に開発された安定版モデルを使用
    const output = await replicate.run(
      "retro-diffusion/rd-plus:latest",
      {
        input: {
          prompt: `retro 8-bit game sprite of ${prompt}, ${style}, clean pixel art, grid-aligned, solid white background`,
          negative_prompt: "blurry, smooth, gradient, photorealistic, 3d render, complex background",
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
