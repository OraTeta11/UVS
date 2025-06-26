import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Clock, Users } from "lucide-react";
import Link from "next/link";

interface ElectionCardProps {
  id: string | number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  positions: Array<string | { title: string }>;
  status: "active" | "upcoming" | "completed" | string;
  hasVoted?: boolean;
  daysLeft?: number;
  showDaysLeft?: boolean;
  actionButton?: React.ReactNode;
  onCardClick?: () => void;
  onViewCandidates?: () => void;
  onViewResults?: () => void;
  showViewCandidates?: boolean;
  showViewResults?: boolean;
  className?: string;
}

export const ElectionCard: React.FC<ElectionCardProps> = ({
  id,
  title,
  description,
  startDate,
  endDate,
  positions,
  status,
  hasVoted,
  daysLeft,
  showDaysLeft,
  actionButton,
  onCardClick,
  onViewCandidates,
  onViewResults,
  showViewCandidates = false,
  showViewResults = false,
  className = "",
}) => {
  // Fix positions display
  const positionsString = Array.isArray(positions)
    ? positions.map((p: any) => typeof p === "string" ? p : p.title).join(", ")
    : "";

  // Status badge
  const statusBadge = hasVoted
    ? <span className="ml-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Voted</span>
    : <span className="ml-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Not Voted</span>;

  return (
    <Card className={`rounded-xl shadow-sm border border-gray-200 ${className}`} onClick={onCardClick}>
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-lg font-bold text-[#003B71]">{title}</CardTitle>
          {description && <CardDescription className="text-sm text-gray-500 mt-1">{description}</CardDescription>}
        </div>
        <div className="flex items-center">{statusBadge}</div>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="flex items-center text-xs text-gray-600 mb-1">
          <Clock className="mr-1 h-4 w-4 text-gray-400" />
          <span>{new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-xs text-gray-600 mb-1">
          <Users className="mr-1 h-4 w-4 text-gray-400" />
          <span>Positions: {positionsString}</span>
        </div>
        {showDaysLeft && daysLeft !== undefined && daysLeft > 0 && (
          <div className="text-xs text-red-600 font-semibold mb-2">{daysLeft} day{daysLeft !== 1 ? 's' : ''} left</div>
        )}
        {actionButton}
        <div className="flex flex-col gap-2 mt-2">
          {showViewCandidates && (
            <Button variant="outline" className="w-full" onClick={onViewCandidates}>
              View Candidates
            </Button>
          )}
          {showViewResults && (
            <Button variant="outline" className="w-full" onClick={onViewResults}>
              View Detailed Results
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 