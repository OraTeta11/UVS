import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vote } from "@/types";

interface AddVoterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (updatedVote: Partial<Vote>) => void;
  initialValues?: any; // Vote data from the table
}

export function AddVoterModal({ isOpen, onClose, onAdd, initialValues }: AddVoterModalProps) {
  const [firstName, setFirstName] = useState(initialValues?.first_name || "");
  const [lastName, setLastName] = useState(initialValues?.last_name || "");
  const [studentId, setStudentId] = useState(initialValues?.student_id || "");
  const [department, setDepartment] = useState(initialValues?.department || "");
  const [candidateName, setCandidateName] = useState(initialValues?.candidate_name || "");
  const [positionTitle, setPositionTitle] = useState(initialValues?.position_title || "");

  useEffect(() => {
    setFirstName(initialValues?.first_name || "");
    setLastName(initialValues?.last_name || "");
    setStudentId(initialValues?.student_id || "");
    setDepartment(initialValues?.department || "");
    setCandidateName(initialValues?.candidate_name || "");
    setPositionTitle(initialValues?.position_title || "");
  }, [initialValues, isOpen]);

  const handleSubmit = () => {
    if (!firstName || !lastName || !studentId || !department) {
      alert("Please fill in all required fields.");
      return;
    }

    const updatedVote = {
      first_name: firstName,
      last_name: lastName,
      student_id: studentId,
      department,
      candidate_name: candidateName,
      position_title: positionTitle,
    };
    onAdd(updatedVote);
    onClose();
  };

  const faculties = ["IS", "IT", "CS", "CSE"]; // Departments/Faculties

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Vote Information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">First Name</Label>
            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">Last Name</Label>
            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="studentId" className="text-right">Student ID</Label>
            <Input id="studentId" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">Department</Label>
            <Select onValueChange={(value) => setDepartment(value)} value={department}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((fac) => (
                  <SelectItem key={fac} value={fac}>{fac}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="candidateName" className="text-right">Voted For</Label>
            <Input id="candidateName" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="positionTitle" className="text-right">Position</Label>
            <Input id="positionTitle" value={positionTitle} onChange={(e) => setPositionTitle(e.target.value)} className="col-span-3" readOnly />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} style={{ background: '#003B71', color: 'white' }}>Update Vote</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 