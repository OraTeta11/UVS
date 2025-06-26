import { RekognitionClient, CompareFacesCommand } from "@aws-sdk/client-rekognition";

export async function POST(req: Request) {
  try {
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("Missing AWS credentials for Rekognition. Please check Vercel environment variables.");
    }

    const client = new RekognitionClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const { sourceImageBytes, targetImageBytes } = await req.json();
    console.log('Rekognition API: Received payload', {
      sourceImageBytesLength: sourceImageBytes?.length,
      targetImageBytesLength: targetImageBytes?.length,
      sourceImageBytesSample: sourceImageBytes?.slice(0, 30),
      targetImageBytesSample: targetImageBytes?.slice(0, 30),
    });
    const sourceBuffer = Buffer.from(sourceImageBytes, "base64");
    const targetBuffer = Buffer.from(targetImageBytes, "base64");
    console.log('Rekognition API: Buffer lengths', {
      sourceBuffer: sourceBuffer.length,
      targetBuffer: targetBuffer.length,
    });
    const command = new CompareFacesCommand({
      SourceImage: { Bytes: sourceBuffer },
      TargetImage: { Bytes: targetBuffer },
      SimilarityThreshold: 90,
    });
    const response = await client.send(command);
    console.log('Rekognition API: Success', response);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error: any) {
    console.error('Rekognition API: Error', error);
    return new Response(JSON.stringify({ error: error.message, details: error }), { status: 500 });
  }
}