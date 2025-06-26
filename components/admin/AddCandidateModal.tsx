import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Candidate, User } from "@/types";
import { Trash2 } from 'lucide-react';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newCandidate: Partial<Candidate>) => void;
  positions: { id: number; title: string }[];
  initialValues?: Partial<Candidate>;
}

export function AddCandidateModal({ isOpen, onClose, onAdd, positions, initialValues }: AddCandidateModalProps) {
  console.log("Positions in modal:", positions);
  const [studentId, setStudentId] = useState(initialValues?.student_id || "");
  const [fullName, setFullName] = useState(initialValues?.full_name || "");
  const [department, setDepartment] = useState(initialValues?.department || "");
  const [gender, setGender] = useState(initialValues?.gender || "");
  const [positionId, setPositionId] = useState(initialValues?.position_id?.toString() || "");
  const [manifesto, setManifesto] = useState(initialValues?.manifesto || "");
  const [imageUrl, setImageUrl] = useState(initialValues?.image_url || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setStudentId(initialValues?.student_id || "");
    setFullName(initialValues?.full_name || "");
    setDepartment(initialValues?.department || "");
    setGender(initialValues?.gender || "");
    setPositionId(initialValues?.position_id?.toString() || "");
    setManifesto(initialValues?.manifesto || "");
    setImageUrl(initialValues?.image_url || "");
    setImageFile(null);
  }, [initialValues, isOpen]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
      setUploading(true);
      // Create FormData and append file
      const formData = new FormData();
      formData.append('image', file);
      try {
        // Upload the image
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }
        const data = await response.json();
        // Update the image URL with the real uploaded image path
        setImageUrl(data.url);
      } catch (error) {
        console.error('Error uploading image:', error);
        setImageUrl(initialValues?.image_url || '');
        setImageFile(null);
        alert(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDeleteImage = () => {
    setImageUrl('');
    setImageFile(null);
  };

  const handleSubmit = async () => {
    console.log("handleSubmit called", { imageUrl, studentId, fullName, department, gender, positionId, manifesto });
    if (uploading) {
      alert('Please wait for the image to finish uploading.');
      return;
    }
    if (!studentId || !fullName || !department || !gender || !positionId) {
      alert("Please fill in all required fields.");
      return;
    }
    // Only allow Cloudinary URLs or empty
    const isCloudinaryUrl = imageUrl.startsWith('http') && imageUrl.includes('cloudinary');
    const finalImageUrl = isCloudinaryUrl ? imageUrl : initialValues?.image_url || '';
    console.log('Saving candidate with image_url:', finalImageUrl);
    const newCandidate: any = {
      student_id: studentId,
      full_name: fullName,
      department,
      gender,
      position_id: parseInt(positionId, 10),
      manifesto,
      image_url: finalImageUrl,
      verified: initialValues?.verified || false
    };
    onAdd(newCandidate);
    onClose();
  };

  const departments = [
    "Computer Science",
    "Civil Engineering", 
    "Information Systems",
    "Information Technology",
    "Mechanical Engineering"
  ];
  const genders = ["Male", "Female"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialValues ? 'Edit Candidate' : 'Add New Candidate'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="studentId" className="text-right">Student ID</Label>
            <Input id="studentId" value={studentId} onChange={e => setStudentId(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">Full Name</Label>
            <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">Department</Label>
            <Input id="department" value={department} onChange={e => setDepartment(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">Gender</Label>
            <select 
              id="gender" 
              value={gender} 
              onChange={e => setGender(e.target.value)} 
              className="col-span-3 border rounded px-2 py-1" 
              required
            >
              <option value="">Select Gender</option>
              {genders.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">Position</Label>
            <select 
              id="position" 
              value={positionId} 
              onChange={e => setPositionId(e.target.value)} 
              className="col-span-3 border rounded px-2 py-1" 
              required
            >
              <option value="">Select Position</option>
              {positions.map(pos => (
                <option
                  key={pos.id || pos.position_id}
                  value={pos.id || pos.position_id}
                >
                  {pos.title || pos.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manifesto" className="text-right">Manifesto</Label>
            <Textarea
              id="manifesto"
              value={manifesto}
              onChange={(e) => setManifesto(e.target.value)}
              className="col-span-3"
              placeholder="Enter candidate's manifesto"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">Image</Label>
            <div className="col-span-3 flex items-center gap-2">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {imageUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="rounded w-20 h-20 object-cover" 
                  />
                  <button type="button" onClick={handleDeleteImage} title="Delete image" className="ml-2 text-red-500 hover:text-red-700">
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} style={{ background: '#003B71', color: 'white' }} disabled={uploading}>
            {uploading ? 'Uploading...' : (initialValues ? 'Save Changes' : 'Add Candidate')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 