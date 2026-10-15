import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, size, style } = await request.json();

    // 選択されたサイズ（16x16, 32x32など）に応じて出力サイズを綺麗に調整
    // ※AIモデルが破綻しない最小ピクセルサイズ（512pxなど）をベースにしつつ、ドット感を出します
    const dimMap = {
      '16': 512,
      '32': 512,
      '64': 512,
      '128': 1024,
    };
    const dimension = dimMap[size] || 512;

    // 安定稼働しているモデルを使用し、グリッド線や余計な枠が入らない洗練されたプロンプトを指定
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: `retro 8-bit pixel art of ${prompt}, style: ${style}, single game sprite character, sharp edges, clean pixels, centered, solid white background, no grid lines, no UI frame`,
          negative_prompt: "blurry, grid lines, graph paper, blueprint, frame, border, photorealistic, 3d render, complex background, scenery, text, watermark",
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
