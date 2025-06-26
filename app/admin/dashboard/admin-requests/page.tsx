"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Download, CheckCircle2, XCircle, Edit, Trash2, Clock } from "lucide-react"

interface AdminRequest {
  id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  title: string;
  school: string;
  department: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin-requests');
      if (!response.ok) throw new Error('Failed to fetch requests.');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      toast.error('Failed to fetch admin requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(); // initial fetch
    const es = new EventSource('/api/admin-requests/stream');
    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRequests(data);
    };
    return () => es.close();
  }, []);

  const handleUpdateRequest = async (requestId, userId, status) => {
    try {
      const response = await fetch('/api/admin-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, userId, status }),
      });
      if (!response.ok) throw new Error('Failed to update request');
      toast.success(`Request ${status}`);
      fetchRequests(); // Instantly update UI
    } catch (err) {
      toast.error('Could not update request');
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin-requests/export')
      if (!response.ok) throw new Error('Export failed')
      
      // Get the blob from the response
      const blob = await response.blob()
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'admin-requests.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success("Admin requests exported successfully")
    } catch (error) {
      toast.error("Failed to export admin requests")
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Admin Requests</h2>
        <Button 
          onClick={handleExport}
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Registration Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading requests...</p>
          ) : requests.length === 0 ? (
            <p>No pending admin requests.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{`${req.first_name} ${req.last_name}`}</TableCell>
                    <TableCell>{req.email}</TableCell>
                    <TableCell>{req.title}</TableCell>
                    <TableCell>{req.department}</TableCell>
                    <TableCell>{req.reason}</TableCell>
                    <TableCell>
                      {req.status === 'pending' && (
                        <Clock className="text-blue-600" title="Pending" />
                      )}
                      {req.status === 'approved' && (
                        <CheckCircle2 className="text-green-500" title="Approved" />
                      )}
                      {req.status === 'rejected' && (
                        <XCircle className="text-red-500" title="Rejected" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateRequest(req.id, req.user_id, 'approved')}
                          disabled={req.status !== 'pending'}
                          className="icon-btn"
                          title="Approve"
                        >
                          <Edit className={req.status === 'pending' ? 'text-blue-600' : 'text-gray-400'} />
                        </button>
                        <button
                          onClick={() => handleUpdateRequest(req.id, req.user_id, 'rejected')}
                          disabled={req.status !== 'pending'}
                          className="icon-btn"
                          title="Reject"
                        >
                          <Trash2 className={req.status === 'pending' ? 'text-red-500' : 'text-gray-400'} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/*
.icon-btn {
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
}
.icon-btn:hover:not(:disabled) {
  background: #f3f4f6;
}
.icon-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
*/ 