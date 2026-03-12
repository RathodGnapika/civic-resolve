export type Department = "Sanitation" | "Electricity" | "Public Works" | "Water Dept" | "General";
export type Priority = "High" | "Medium" | "Low";
export type Status = "Pending" | "In Progress" | "Resolved";

export interface Complaint {
  id: number;
  name: string;
  location: string;
  text: string;
  department: Department;
  priority: Priority;
  status: Status;
  timestamp: string;
  imageUrl?: string;
}

const DEPARTMENT_KEYWORDS: Record<Department, string[]> = {
  Sanitation: ["garbage", "waste", "trash", "dump", "litter", "sewage", "dirty", "smell", "stink", "rubbish", "debris", "cleaning", "sweeping", "sanitation"],
  Electricity: ["light", "streetlight", "power", "electric", "wire", "pole", "outage", "blackout", "voltage", "transformer", "bulb", "lamp"],
  "Public Works": ["road", "pothole", "bridge", "crack", "pavement", "footpath", "sidewalk", "construction", "drain", "manhole", "speed bump", "sign"],
  "Water Dept": ["water", "pipe", "leakage", "leak", "supply", "tap", "flood", "drainage", "waterlogging", "pipeline", "tank", "borewell"],
  General: [],
};

const PRIORITY_KEYWORDS: Record<Priority, string[]> = {
  High: ["accident", "danger", "emergency", "urgent", "collapse", "fire", "flood", "death", "injury", "risk", "hazard", "critical", "immediate", "broken bridge", "open manhole"],
  Medium: ["leak", "overflow", "damage", "broken", "not working", "complaint", "problem", "issue", "faulty"],
  Low: ["minor", "cosmetic", "paint", "dim", "slow", "suggestion", "request", "improvement"],
};

export function classifyDepartment(text: string): Department {
  const lower = text.toLowerCase();
  let bestDept: Department = "General";
  let bestScore = 0;

  for (const [dept, keywords] of Object.entries(DEPARTMENT_KEYWORDS) as [Department, string[]][]) {
    if (dept === "General") continue;
    const score = keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestDept = dept;
    }
  }
  return bestDept;
}

export function detectPriority(text: string): Priority {
  const lower = text.toLowerCase();
  for (const priority of ["High", "Medium", "Low"] as Priority[]) {
    if (PRIORITY_KEYWORDS[priority].some(kw => lower.includes(kw))) {
      return priority;
    }
  }
  return "Medium";
}

const STORAGE_KEY = "civicai_complaints";
let nextId = 100;

function loadComplaints(): Complaint[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const complaints = JSON.parse(data) as Complaint[];
      if (complaints.length > 0) {
        nextId = Math.max(...complaints.map(c => c.id)) + 1;
      }
      return complaints;
    }
  } catch {}
  return [];
}

function saveComplaints(complaints: Complaint[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

export function getAllComplaints(): Complaint[] {
  return loadComplaints();
}

export function getComplaintById(id: number): Complaint | undefined {
  return loadComplaints().find(c => c.id === id);
}

export function submitComplaint(name: string, location: string, text: string, imageUrl?: string): Complaint {
  const complaints = loadComplaints();
  const complaint: Complaint = {
    id: nextId++,
    name,
    location,
    text,
    department: classifyDepartment(text),
    priority: detectPriority(text),
    status: "Pending",
    timestamp: new Date().toISOString(),
    imageUrl,
  };
  complaints.push(complaint);
  saveComplaints(complaints);
  return complaint;
}

export function updateComplaintStatus(id: number, status: Status): Complaint | undefined {
  const complaints = loadComplaints();
  const complaint = complaints.find(c => c.id === id);
  if (complaint) {
    complaint.status = status;
    saveComplaints(complaints);
  }
  return complaint;
}
