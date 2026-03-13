// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { supabase } from "@/integrations/supabase/client";

export type Complaint = {
  id: string;
  name: string;
  location: string;
  complaint_text: string;
  department: string;
  priority: string;
  status: string;
  created_at?: string;
  latitude?: number;
  longitude?: number;
};

function classifyDepartment(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("garbage") || t.includes("waste") || t.includes("trash")) return "Sanitation";
  if (t.includes("light") || t.includes("electricity") || t.includes("power")) return "Electricity";
  if (t.includes("pothole") || t.includes("road") || t.includes("street")) return "Public Works";
  if (t.includes("water") || t.includes("pipe") || t.includes("drain")) return "Water Dept";
  return "General";
}

function detectPriority(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("accident") || t.includes("danger") || t.includes("urgent") || t.includes("emergency")) return "high";
  if (t.includes("leakage") || t.includes("broken") || t.includes("damage")) return "medium";
  return "low";
}

export async function submitComplaint(
  name: string,
  location: string,
  text: string
): Promise<Complaint> {
  const department = classifyDepartment(text);
  const priority = detectPriority(text);

  console.log("Inserting:", { name, location, complaint_text: text, department, priority });

  const { data, error } = await (supabase as any)
    .from("complaints")
    .insert([{ name, location, complaint_text: text, department, priority, status: "pending" }])
    .select()
    .single();

  console.log("Result - data:", data, "error:", error);

  if (error) throw new Error(JSON.stringify(error));
  return data as Complaint;
}

export async function getComplaints(): Promise<Complaint[]> {
  const { data, error } = await (supabase as any)
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Complaint[];
}

export async function getComplaintById(id: string): Promise<Complaint | null> {
  const { data, error } = await (supabase as any)
    .from("complaints")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Complaint;
}