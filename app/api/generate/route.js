import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, size, style } = await request.json();

    // Replicate公式の安定したStable Diffusionモデルを使用
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: `${prompt}, pixel art style, ${style}, 8-bit, 16-bit, retro game graphics, detailed pixelated art`,
          negative_prompt: "photorealistic, 3d render, blurry, smooth, gradient, realistic photo",
          width: 1024,
          height: 1024,
          num_outputs: 1,
        }
      }
    );

    // 生成された画像のURLを取得
    const imageUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Replicate Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
