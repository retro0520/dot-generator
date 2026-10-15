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

    // 現在確実に稼働が保証されている安定版のハッシュを使用
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: `pixel art, ${prompt}, ${style}, retro 8-bit game character, solid white background`,
          negative_prompt: "blurry, realistic, 3d, complex background",
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
