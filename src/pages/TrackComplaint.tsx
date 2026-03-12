import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getComplaintById, type Complaint } from "@/lib/complaints";
import { Search, AlertCircle } from "lucide-react";

export default function TrackComplaint() {
  const [idInput, setIdInput] = useState("");
  const [result, setResult] = useState<Complaint | null | "not_found">(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(idInput);
    if (isNaN(id)) return;
    const complaint = getComplaintById(id);
    setResult(complaint || "not_found");
  };

  return (
    <div className="container max-w-lg py-16">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Track Your Complaint</CardTitle>
          <CardDescription>Enter your Complaint ID to check the current status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input placeholder="Enter Complaint ID (e.g., 100)" value={idInput} onChange={e => setIdInput(e.target.value)} className="flex-1" />
            <Button type="submit" className="bg-primary text-primary-foreground"><Search className="mr-1.5 h-4 w-4" /> Search</Button>
          </form>

          {result === "not_found" && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> No complaint found with that ID.
            </div>
          )}

          {result && result !== "not_found" && (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3 text-sm animate-fade-in">
              <div className="flex justify-between"><span className="text-muted-foreground">Complaint ID</span><span className="font-semibold">#{result.id}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span>{result.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span>{result.location}</span></div>
              <div className="flex justify-between items-start"><span className="text-muted-foreground">Description</span><span className="text-right max-w-[200px]">{result.text}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Department</span><Badge variant="secondary">{result.department}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Priority</span>
                <Badge className={result.priority === "High" ? "bg-destructive text-destructive-foreground" : result.priority === "Medium" ? "bg-warning text-warning-foreground" : "bg-secondary text-secondary-foreground"}>
                  {result.priority}
                </Badge>
              </div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span>
                <Badge className={result.status === "Resolved" ? "bg-success text-success-foreground" : result.status === "In Progress" ? "bg-info text-info-foreground" : "bg-secondary text-secondary-foreground"}>
                  {result.status}
                </Badge>
              </div>
              <div className="flex justify-between"><span className="text-muted-foreground">Submitted</span><span>{new Date(result.timestamp).toLocaleDateString()}</span></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
