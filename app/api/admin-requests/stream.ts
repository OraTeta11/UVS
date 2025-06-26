import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendRequests = async () => {
    const requests = await sql`
      SELECT 
        ar.id, ar.user_id, u.first_name, u.last_name, u.email, ar.title, ar.school, ar.department, ar.reason, ar.status, ar.created_at
      FROM admin_requests ar
      JOIN users u ON ar.user_id = u.id
      ORDER BY ar.created_at ASC
    `;
    res.write(`data: ${JSON.stringify(requests)}\n\n`);
  };

  await sendRequests(); // Send initial data

  const interval = setInterval(sendRequests, 10000); // Demo: update every 10s

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
} 