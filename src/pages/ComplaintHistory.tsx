import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data - replace this with an API call later
const mockComplaints = [
  { id: "CMP-1024", category: "Water Leakage", status: "Resolved", date: "2024-03-20" },
  { id: "CMP-1089", category: "Street Light", status: "Pending", date: "2024-04-01" },
];

const ComplaintHistory = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Complaint History</h1>
      <div className="grid gap-4">
        {mockComplaints.map((complaint) => (
          <Card key={complaint.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>ID: {complaint.id}</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {complaint.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Category:</strong> {complaint.category}</p>
              <p className="text-sm text-gray-500 text-muted-foreground">Submitted on: {complaint.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ComplaintHistory;