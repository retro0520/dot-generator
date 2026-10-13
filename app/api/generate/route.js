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
      "fofr/sdxl-pixel-art:d70b72a0d92233f06fcbe5fc9cfdd348827fa6d7a5b3a4a7541d441113e3b3e6", 
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
