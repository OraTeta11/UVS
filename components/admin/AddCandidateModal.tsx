import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Candidate, User } from "@/types";

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newCandidate: Partial<Candidate>) => void;
  positions: { id: number; title: string }[];
  users: User[]; // Assuming you have a list of users to select from
}

export function AddCandidateModal({ isOpen, onClose, onAdd, positions, users }: AddCandidateModalProps) {
  const [userId, setUserId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [manifesto, setManifesto] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = () => {
    if (!userId || !positionId) {
      alert("Please select a user and a position.");
      return;
    }

    const newCandidate: Partial<Candidate> = {
      userId: userId,
      positionId: parseInt(positionId),
      manifesto: manifesto,
      imageUrl: imageUrl || '/placeholder.svg?height=100&width=100',
      verified: false, // Default to unverified
      voteCount: 0, // Default vote count
    };
    onAdd(newCandidate);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user" className="text-right">User</Label>
            <Select onValueChange={setUserId} value={userId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>{`${user.firstName} ${user.lastName} (${user.studentId})`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">Position</Label>
            <Select onValueChange={setPositionId} value={positionId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>
              <SelectContent>
                {positions.map(pos => (
                  <SelectItem key={pos.id} value={pos.id.toString()}>{pos.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manifesto" className="text-right">Manifesto</Label>
            <Textarea
              id="manifesto"
              value={manifesto}
              onChange={(e) => setManifesto(e.target.value)}
              className="col-span-3"
              placeholder="Enter candidate's manifesto"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="col-span-3"
              placeholder="Enter image URL (optional)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} style={{ background: '#003B71', color: 'white' }}>Add Candidate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 