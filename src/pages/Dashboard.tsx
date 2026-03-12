import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllComplaints, updateComplaintStatus, type Status } from "@/lib/complaints";
import { AlertTriangle, Clock, CheckCircle, FileText } from "lucide-react";

export default function Dashboard() {
  const [complaints, setComplaints] = useState(getAllComplaints);

  const stats = useMemo(() => ({
    total: complaints.length,
    high: complaints.filter(c => c.priority === "High").length,
    pending: complaints.filter(c => c.status === "Pending").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
  }), [complaints]);

  const handleStatusChange = (id: number, status: Status) => {
    updateComplaintStatus(id, status);
    setComplaints(getAllComplaints());
  };

  const statCards = [
    { label: "Total Complaints", value: stats.total, icon: FileText, color: "text-info" },
    { label: "High Priority", value: stats.high, icon: AlertTriangle, color: "text-destructive" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-warning" },
    { label: "Resolved", value: stats.resolved, icon: CheckCircle, color: "text-success" },
  ];

  return (
    <div className="container py-10">
      <h1 className="mb-8 font-display text-3xl font-bold">Admin Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-display">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">All Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          {complaints.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No complaints yet. Submit one to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Complaint</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.sort((a, b) => b.id - a.id).map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">#{c.id}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{c.text}</TableCell>
                      <TableCell>{c.location}</TableCell>
                      <TableCell><Badge variant="secondary">{c.department}</Badge></TableCell>
                      <TableCell>
                        <Badge className={c.priority === "High" ? "bg-destructive text-destructive-foreground" : c.priority === "Medium" ? "bg-warning text-warning-foreground" : "bg-secondary text-secondary-foreground"}>
                          {c.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select value={c.status} onValueChange={(v) => handleStatusChange(c.id, v as Status)}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{new Date(c.timestamp).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
