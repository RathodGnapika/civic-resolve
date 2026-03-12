import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { submitComplaint, type Complaint } from "@/lib/complaints";
import { CheckCircle, MapPin, User, FileText } from "lucide-react";

export default function SubmitComplaint() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState<Complaint | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim() || !text.trim()) return;
    const complaint = submitComplaint(name, location, text);
    setSubmitted(complaint);
  };

  if (submitted) {
    return (
      <div className="container max-w-lg py-16">
        <Card className="border-success/30 animate-fade-in">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto mb-2 h-12 w-12 text-success" />
            <CardTitle className="font-display text-2xl">Complaint Submitted!</CardTitle>
            <CardDescription>Your complaint has been registered and classified by AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Complaint ID</span><span className="font-semibold">#{submitted.id}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span>{submitted.location}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Department</span><Badge variant="secondary">{submitted.department}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Priority</span>
                <Badge className={submitted.priority === "High" ? "bg-destructive text-destructive-foreground" : submitted.priority === "Medium" ? "bg-warning text-warning-foreground" : "bg-secondary text-secondary-foreground"}>
                  {submitted.priority}
                </Badge>
              </div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant="outline">{submitted.status}</Badge></div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={() => { setSubmitted(null); setName(""); setLocation(""); setText(""); }} variant="outline" className="flex-1">Submit Another</Button>
              <Button onClick={() => navigate("/track")} className="flex-1 bg-primary text-primary-foreground">Track Status</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-lg py-16">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Report a Civic Issue</CardTitle>
          <CardDescription>Describe your complaint. AI will automatically categorize and prioritize it.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Your Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Location</Label>
              <Input id="location" placeholder="Market Road, Sector 5" value={location} onChange={e => setLocation(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text" className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Complaint Description</Label>
              <Textarea id="text" placeholder="Describe the issue in detail..." rows={4} value={text} onChange={e => setText(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
              Submit Complaint
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
