import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/types";

interface AddVoterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newUser: Partial<User>) => void;
}

export function AddVoterModal({ isOpen, onClose, onAdd }: AddVoterModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState<User['department'] | "">("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = () => {
    if (!firstName || !lastName || !email || !studentId || !department || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    const newUser: Partial<User> = {
      firstName,
      lastName,
      email,
      studentId,
      department,
      password,
      imageUrl: imageUrl || undefined, // Allow empty string to be undefined
      role: "voter", // Default role
      verified: false, // Default verification status
    };
    onAdd(newUser);
    onClose();
  };

  const faculties = ["IS", "IT", "CS", "CSE"]; // Departments/Faculties

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Voter</DialogTitle>
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
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="studentId" className="text-right">Student ID</Label>
            <Input id="studentId" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">Department</Label>
            <Select onValueChange={(value: User['department']) => setDepartment(value)} value={department}>
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
            <Label htmlFor="password" className="text-right">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
            <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="col-span-3" placeholder="Optional" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} style={{ background: '#003B71', color: 'white' }}>Add Voter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 