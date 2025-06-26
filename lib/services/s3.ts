import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadToS3(base64Image: string, key: string): Promise<string> {
  if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET) {
    throw new Error("Missing AWS configuration for S3 upload. Please check Vercel environment variables.");
  }

  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const buffer = Buffer.from(base64Image, "base64");
  const s3Key = `faces/${key}.jpg`;

  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: s3Key,
    Body: buffer,
    ContentType: "image/jpeg",
    ACL: "private",
  }));

  return s3Key;
}
