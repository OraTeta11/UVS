import { useState } from "react";
import { Candidate, Election } from "@/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface VoteModalContentProps {
  election: Election;
  candidates: Candidate[];
  onVote: (candidateId: string, position: string) => Promise<void>;
  onCancel: () => void;
}

export default function VoteModalContent({ election, candidates, onVote, onCancel }: VoteModalContentProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedCandidate) {
      setError("Please select a candidate.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const candidate = candidates.find(c => c.id.toString() === selectedCandidate);
      await onVote(selectedCandidate, candidate?.position || "");
    } catch (err) {
      setError("Failed to submit vote.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{election.title}</h3>
      <div className="space-y-2 mb-4">
        {candidates.map(candidate => (
          <div
            key={candidate.id}
            className={`flex items-center p-2 border rounded cursor-pointer ${selectedCandidate === candidate.id.toString() ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}
            onClick={() => setSelectedCandidate(candidate.id.toString())}
          >
            <input
              type="radio"
              checked={selectedCandidate === candidate.id.toString()}
              onChange={() => setSelectedCandidate(candidate.id.toString())}
              className="mr-2"
            />
            <Image 
              src={candidate.image_url || "/placeholder.svg"} 
              alt={candidate.full_name + "'s photo"}
              width={64} 
              height={64} 
              className="rounded-full mr-4 border border-gray-300 object-cover" 
            />
            <div>
              <div className="font-medium text-base">{candidate.full_name}</div>
              <div className="text-xs text-gray-500 mb-1">
                <span>ID: {candidate.student_id}</span> | <span>{candidate.department}</span> | <span>{candidate.gender}</span>
              </div>
              {candidate.manifesto && <div className="text-xs text-gray-600 mt-1">{candidate.manifesto}</div>}
            </div>
          </div>
        ))}
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting || !selectedCandidate}>
          {submitting ? "Submitting..." : "Submit Vote"}
        </Button>
      </div>
    </div>
  );
} 