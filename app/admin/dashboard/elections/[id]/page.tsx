"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ElectionDetailsPage() {
  const { id } = useParams();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchElection() {
      setLoading(true);
      const res = await fetch(`/api/elections/${id}`);
      if (res.ok) {
        const data = await res.json();
        setElection(data);
      }
      setLoading(false);
    }
    if (id) fetchElection();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!election) return <div className="p-8">Election not found.</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{election.title}</h1>
      <p className="mb-4 text-gray-600">{election.description}</p>
      <div className="mb-2">
        <span className="font-semibold">Status:</span> {election.status}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Start:</span> {new Date(election.startDate).toLocaleString()}
      </div>
      <div className="mb-2">
        <span className="font-semibold">End:</span> {new Date(election.endDate).toLocaleString()}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Positions:</span>
        <ul className="list-disc ml-6">
          {election.positions && election.positions.length > 0 ? (
            election.positions.map((pos) => (
              <li key={pos.id}>{pos.title}</li>
            ))
          ) : (
            <li>No positions found.</li>
          )}
        </ul>
      </div>
      {/* You can add more details here, such as vote counts, candidates, etc. */}
    </div>
  );
} 