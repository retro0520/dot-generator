import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, size, style } = await request.json();

    // 選択された解像度（16, 32など）をそのまま反映し、ドットの粒を粗くする
    const dimMap = {
      '16': 256,
      '32': 512,
      '64': 512,
      '128': 1024,
    };
    const dimension = dimMap[size] || 512;

    // ファミコン（NES）やレトロゲームのような、極限までシンプルで荒いドット絵を狙うプロンプト
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: `authentic 8-bit NES retro video game sprite of ${prompt}, minimal pixel art, harsh pixels, limited color palette, 16-bit retro game asset, centered on solid pure white background`,
          negative_prompt: "smooth, high resolution, detailed shading, gradient, anti-aliasing, modern digital art, 3d render, photorealistic, blurry, complex background, multiple characters, frame, border",
          width: dimension,
          height: dimension,
          guidance_scale: 7.5,
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
