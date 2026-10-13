import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, size, style } = await request.json();

    // 画面で選ばれたサイズ（32, 64, 128など）を数値に変換
    // ※SDXLは小さすぎる解像度が苦手なため、比率を保つか標準サイズにしつつ、
    //   プロンプトやアスペクト比でドット絵感を調整します
    const dimension = Number(size) >= 64 ? 1024 : 512;

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: `cute ${prompt}, pixel art style, ${style}, retro 8-bit game sprite, vibrant colors, clean pixels, masterpiece`,
          negative_prompt: "scary, creepy, realistic, photorealistic, 3d render, blurry, smooth, gradient, ugly",
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
