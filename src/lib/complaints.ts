// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { supabase } from "@/integrations/supabase/client";

export type Complaint = {
  id: string;
  tracking_id: string;
  user_id?: string;
  user_email?: string;
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

function generateTrackingId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CMP-${num}`;
}

// Submit complaint — now saves tracking_id, user_id, user_email
export async function submitComplaint(
  name: string,
  location: string,
  text: string
): Promise<Complaint> {
  const department = classifyDepartment(text);
  const priority = detectPriority(text);
  const tracking_id = generateTrackingId();

  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;

  const { data, error } = await (supabase as any)
    .from("complaints")
    .insert([{
      tracking_id,
      user_id: session?.user?.id ?? null,
      user_email: session?.user?.email ?? null,
      name,
      location,
      complaint_text: text,
      department,
      priority,
      status: "pending",
    }])
    .select()
    .single();

  if (error) throw new Error(JSON.stringify(error));
  return data as Complaint;
}

// Get complaints for the currently logged-in user only
export async function getUserComplaints(): Promise<Complaint[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) return [];

  const { data, error } = await (supabase as any)
    .from("complaints")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Complaint[];
}

// Track a complaint by tracking_id (user must own it)
export async function getComplaintByTrackingId(trackingId: string): Promise<Complaint | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) return null;

  const { data, error } = await (supabase as any)
    .from("complaints")
    .select("*")
    .eq("tracking_id", trackingId.trim().toUpperCase())
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data as Complaint;
}

// Admin: get ALL complaints
export async function getComplaints(): Promise<Complaint[]> {
  const { data, error } = await (supabase as any)
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Complaint[];
}

// Admin: get one complaint by UUID
export async function getComplaintById(id: string): Promise<Complaint | null> {
  const { data, error } = await (supabase as any)
    .from("complaints")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Complaint;
}

// Admin: update status
export async function updateComplaintStatus(
  id: string,
  status: string
): Promise<void> {
  const { error } = await (supabase as any)
    .from("complaints")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
}