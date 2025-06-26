import { sql } from '@/lib/db';

export const config = {
  api: { bodyParser: false }
};

let clients: any[] = [];

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  clients.push(res);

  const sendCandidates = async () => {
    const candidates = await sql`SELECT * FROM candidates`;
    res.write(`data: ${JSON.stringify(candidates)}\n\n`);
  };

  await sendCandidates();

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
    res.end();
  });
}

export async function notifyClients() {
  const candidates = await sql`SELECT * FROM candidates`;
  clients.forEach(res => {
    res.write(`data: ${JSON.stringify(candidates)}\n\n`);
  });
} 