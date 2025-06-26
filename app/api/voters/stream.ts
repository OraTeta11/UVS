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

  const sendVoters = async () => {
    const voters = await sql`SELECT * FROM users WHERE role = 'Student' OR role = 'Voter'`;
    res.write(`data: ${JSON.stringify(voters)}\n\n`);
  };

  await sendVoters();

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
    res.end();
  });
}

export async function notifyClients() {
  const voters = await sql`SELECT * FROM users WHERE role = 'Student' OR role = 'Voter'`;
  clients.forEach(res => {
    res.write(`data: ${JSON.stringify(voters)}\n\n`);
  });
} 