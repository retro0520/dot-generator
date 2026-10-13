import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, size, style } = await request.json();

    // Replicateのドット絵生成モデルを呼び出し
    const output = await replicate.run(
      "lucataco/pixel-art-xl:50a996b8641a995e929f07a7183e8fa2990d0b2e", 
      {
        input: {
          prompt: `${prompt}, pixel art style, ${style}`,
          width: Number(size),
          height: Number(size),
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
