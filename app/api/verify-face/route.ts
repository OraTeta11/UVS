import { sql } from "@/lib/db";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

async function getImageFromS3(s3Key: string): Promise<string> {
  try {
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET) {
      throw new Error("Missing AWS configuration for S3 get. Please check Vercel environment variables.");
    }

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

  const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
    Key: s3Key,
  });
  const response = await s3.send(command);
  const stream = response.Body as NodeJS.ReadableStream;
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  const base64 = Buffer.concat(chunks).toString("base64");
  console.log('getImageFromS3: s3Key', s3Key, 'base64 length', base64.length, 'sample', base64.slice(0, 30));
  return base64;
  } catch (error) {
    console.error('Error getting image from S3:', error);
    throw new Error(`Failed to retrieve image from S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function stripBase64Prefix(data: string): string {
  // Remove data:image/jpeg;base64, or similar prefix
  return data.replace(/^data:image\/\w+;base64,?/, '').replace(/^dataimage\/[a-zA-Z]+base64,?/, '');
}

export async function POST(req: Request) {
  try {
  const { studentId, imageData } = await req.json();

    if (!studentId || !imageData) {
      return new Response(JSON.stringify({ error: "Missing required fields: studentId and imageData" }), { status: 400 });
    }

  // Get S3 key from DB
  const user = await sql`SELECT face_image_s3_key FROM users WHERE student_id = ${studentId}`;
    
    if (!user || user.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

  const s3Key = user[0]?.face_image_s3_key;
  if (!s3Key) {
    return new Response(JSON.stringify({ error: "No stored face for user" }), { status: 404 });
    }

  // Download stored image from S3 and convert to base64
  const storedImageBase64 = await getImageFromS3(s3Key);
  console.log('verify-face: imageData length', imageData.length, 'sample', imageData.slice(0, 30));
  console.log('verify-face: storedImageBase64 length', storedImageBase64.length, 'sample', storedImageBase64.slice(0, 30));

  // Strip base64 prefix from both images
  const cleanSource = stripBase64Prefix(imageData);
  const cleanTarget = stripBase64Prefix(storedImageBase64);

  // Call Rekognition compare-faces API (use absolute URL)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const rekognitionRes = await fetch(`${baseUrl}/api/rekognition/compare-faces`, {
    method: "POST",
      headers: { "Content-Type": "json" },
    body: JSON.stringify({
      sourceImageBytes: cleanSource,
      targetImageBytes: cleanTarget,
    }),
  });

    if (!rekognitionRes.ok) {
      const errorData = await rekognitionRes.json();
      console.error('Rekognition API error:', errorData);
      return new Response(JSON.stringify({ error: "Face comparison failed", details: errorData }), { status: rekognitionRes.status });
    }

  const rekognitionData = await rekognitionRes.json();
  const verified = rekognitionData.FaceMatches && rekognitionData.FaceMatches.length > 0 && rekognitionData.FaceMatches[0].Similarity > 90;

  return new Response(JSON.stringify({ verified }), { status: 200 });
  } catch (error) {
    console.error('Error in verify-face API:', error);
    return new Response(JSON.stringify({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }), { status: 500 });
  }
} 