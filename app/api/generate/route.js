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
      '64': 512,
      '128': 1024,
    };
    const dimension = dimMap[size] || 512;

    // SDXLではなく、本物のドット絵特化型モデル（Latent Consistency Pixel Art）に切り替え
    const output = await replicate.run(
      "fofr/latent-consistency-model-pixel-art:94d137bc449339a04a60f9eb1453aa0d93540b9550b0f796cc9a1f2b6e174780",
      {
        input: {
          prompt: `pixel art style, 8-bit NES game sprite of ${prompt}, ${style}, sharp chunky pixels, solid white background, flat colors, limited color palette`,
          negative_prompt: "smooth gradients, anti-aliasing, blurry, high resolution, 3d render, photorealistic, complex background, multiple characters, grid lines",
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
