export async function GET() {
  const envCheck = {
    hasAwsAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
    hasAwsSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
    hasAwsRegion: !!process.env.AWS_REGION,
    hasAwsS3Bucket: !!process.env.AWS_S3_BUCKET,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasNextPublicBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  };

  return new Response(JSON.stringify({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: envCheck,
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 