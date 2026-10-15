import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, size, style } = await request.json();

    // 選択された解像度（size）に応じて出力サイズを制御
    const dimMap = {
      '16': 512,
      '32': 512,
      '64': 512,
      '128': 1024,
    };
    const dimension = dimMap[size] || 512;

    // ドット絵特化のLoRA/専用モデルの実行設定
    const output = await replicate.run(
      "lucataco/pixel-art-xl:b433e072f10d6e19cd914a51ebc5cddf571b058a9e0839e5e6e39257e84cc240",
      {
        input: {
          prompt: `pixel art, single game sprite of ${prompt}, ${style}, retro 8-bit character, sharp pixelated edges, centered, isolated on solid plain white background, flat color`,
          negative_prompt: "blurry, smooth gradients, anti-aliasing, photorealistic, 3d render, complex background, scenery, multiple characters, double, split screen, grid lines, frame, border, text, watermark",
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
