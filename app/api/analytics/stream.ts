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

  const sendAnalytics = async () => {
    const elections = await sql`SELECT * FROM elections`;
    const keyMetrics = {
      totalVoters: elections.reduce((sum, e) => sum + (e.vote_count || 0), 0),
      activeVoters: elections.filter(e => e.status === 'active').reduce((sum, e) => sum + (e.vote_count || 0), 0),
      averageTurnout: elections.length ? Number((elections.reduce((sum, e) => sum + (e.vote_count || 0), 0) / elections.length).toFixed(1)) : 0,
      topFaculty: '',
      topFacultyRate: 0,
      lowestFaculty: '',
      lowestFacultyRate: 0,
    };
    // Faculties by vote_count
    const faculties = {};
    elections.forEach(e => {
      if (!faculties[e.department]) faculties[e.department] = 0;
      faculties[e.department] += e.vote_count || 0;
    });
    const sortedFaculties = Object.entries(faculties).sort((a, b) => b[1] - a[1]);
    keyMetrics.topFaculty = sortedFaculties[0]?.[0] || '';
    keyMetrics.topFacultyRate = sortedFaculties[0]?.[1] || 0;
    keyMetrics.lowestFaculty = sortedFaculties[sortedFaculties.length - 1]?.[0] || '';
    keyMetrics.lowestFacultyRate = sortedFaculties[sortedFaculties.length - 1]?.[1] || 0;
    const analyticsElections = elections.map(e => ({
      id: e.id,
      title: e.title,
      date: e.startDate,
      turnout: e.vote_count,
      maleVotes: 0,
      femaleVotes: 0,
    }));
    res.write(`data: ${JSON.stringify({ keyMetrics, analyticsElections })}\n\n`);
  };

  await sendAnalytics();

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
    res.end();
  });
}

export async function notifyClients() {
  const elections = await sql`SELECT * FROM elections`;
  const keyMetrics = {
    totalVoters: elections.reduce((sum, e) => sum + (e.vote_count || 0), 0),
    activeVoters: elections.filter(e => e.status === 'active').reduce((sum, e) => sum + (e.vote_count || 0), 0),
    averageTurnout: elections.length ? Number((elections.reduce((sum, e) => sum + (e.vote_count || 0), 0) / elections.length).toFixed(1)) : 0,
    topFaculty: '',
    topFacultyRate: 0,
    lowestFaculty: '',
    lowestFacultyRate: 0,
  };
  const faculties = {};
  elections.forEach(e => {
    if (!faculties[e.department]) faculties[e.department] = 0;
    faculties[e.department] += e.vote_count || 0;
  });
  const sortedFaculties = Object.entries(faculties).sort((a, b) => b[1] - a[1]);
  keyMetrics.topFaculty = sortedFaculties[0]?.[0] || '';
  keyMetrics.topFacultyRate = sortedFaculties[0]?.[1] || 0;
  keyMetrics.lowestFaculty = sortedFaculties[sortedFaculties.length - 1]?.[0] || '';
  keyMetrics.lowestFacultyRate = sortedFaculties[sortedFaculties.length - 1]?.[1] || 0;
  const analyticsElections = elections.map(e => ({
    id: e.id,
    title: e.title,
    date: e.startDate,
    turnout: e.vote_count,
    maleVotes: 0,
    femaleVotes: 0,
  }));
  clients.forEach(res => {
    res.write(`data: ${JSON.stringify({ keyMetrics, analyticsElections })}\n\n`);
  });
} 