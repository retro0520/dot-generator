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

    // 安定して動作する代表的なドット絵生成モデルの最新バージョンIDを指定
    const output = await replicate.run(
      "lucataco/pixel-art-xl:b433e072f10d6e19cd914a51ebc5cddf571b058a9e0839e5e6e39257e84cc240",
      {
        input: {
          prompt: `pixel art, ${prompt}, ${style}, retro game sprite, centered, isolated on solid white background`,
          negative_prompt: "blurry, realistic, 3d, complex background, scenery, photorealistic",
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
