"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Hourglass } from 'lucide-react';

export default function PendingRequestPage() {
  const { logout } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-yellow-100 rounded-full p-3 w-fit">
            <Hourglass className="h-8 w-8 text-yellow-500" />
          </div>
          <CardTitle className="mt-4">Request Submitted</CardTitle>
          <CardDescription>
            Your request for admin access has been submitted and is pending approval.
            You will be notified once your request has been reviewed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => logout()} className="w-full">
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 