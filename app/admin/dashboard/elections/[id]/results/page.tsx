"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Users, VoteIcon, Calendar } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import jsPDF from 'jspdf';

interface Candidate {
  id: number;
  name: string;
  position: string;
  votes: number;
  percentage: number;
}

interface ElectionResult {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  totalVotes: number;
  eligibleVoters: number;
  positions: string[];
  candidates: Candidate[];
}

export default function ElectionResultsPage() {
  const params = useParams();
  const id = params.id;
  const [results, setResults] = useState<ElectionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchElectionResults() {
      setLoading(true);
      const res = await fetch(`/api/elections/${id}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
      setLoading(false);
    }
    if (id) fetchElectionResults();
  }, [id]);

  const handleExportResults = () => {
    if (!results) return;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(results.title, 14, 16);

    doc.setFontSize(12);
    doc.text(`Description: ${results.description || ''}`, 14, 26);
    doc.text(`Period: ${new Date(results.startDate).toLocaleDateString()} - ${new Date(results.endDate).toLocaleDateString()}`, 14, 34);
    doc.text(`Total Voters: ${results.eligibleVoters}`, 14, 42);
    doc.text(`Votes Cast: ${results.totalVotes}`, 14, 50);

    let y = 60;
    results.positions.forEach((position) => {
      doc.setFontSize(14);
      doc.text(`Position: ${position}`, 14, y);
      y += 8;
      doc.setFontSize(12);
      results.candidates
        .filter((c) => c.position === position)
        .forEach((candidate) => {
          doc.text(
            `${candidate.name}: ${candidate.votes} votes (${candidate.percentage.toFixed(1)}%)`,
            18,
            y
          );
          y += 7;
        });
      y += 4;
    });

    doc.save(`${results.title.replace(/\s+/g, '_')}_results.pdf`);
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!results) return <div className="p-8">No results found.</div>;

  const participationRate = (results.totalVotes / results.eligibleVoters) * 100;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Elections
        </Button>
        <Button
          onClick={handleExportResults}
          className="flex items-center gap-2"
          style={{ background: '#003B71', color: 'white' }}
        >
          <Download className="h-4 w-4" />
          Export Results
        </Button>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[#003B71]">{results.title}</CardTitle>
            <CardDescription>{results.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-[#003B71]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Voters</p>
                  <p className="text-xl font-bold">{results.eligibleVoters}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <VoteIcon className="h-6 w-6 text-[#003B71]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Votes Cast</p>
                  <p className="text-xl font-bold">{results.totalVotes}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-[#003B71]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Election Period</p>
                  <p className="text-sm font-bold">
                    {(() => {
                      const start = results.startDate ? parseISO(results.startDate) : null;
                      const end = results.endDate ? parseISO(results.endDate) : null;
                      return `${
                        start && isValid(start) ? format(start, "MMM d, yyyy") : "N/A"
                      } - ${
                        end && isValid(end) ? format(end, "MMM d, yyyy") : "N/A"
                      }`;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={participationRate} className="h-2" />
              <p className="text-sm text-gray-600 text-right">
                {participationRate.toFixed(1)}% Participation
              </p>
            </div>
          </CardContent>
        </Card>

        {results.positions.map((position) => (
          <Card key={position}>
            <CardHeader>
              <CardTitle>{position}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.candidates
                  .filter((candidate) => candidate.position === position)
                  .map((candidate) => (
                    <div key={candidate.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{candidate.name}</span>
                        <span className="text-sm text-gray-600">
                          {candidate.votes} votes ({candidate.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={candidate.percentage} className="h-2" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 