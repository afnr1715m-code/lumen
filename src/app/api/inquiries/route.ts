import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { notifyNewInquiry } from "@/lib/notify";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, company, email, phone, projectType, budget, timeline, details } = body ?? {};

  if (!name || !email || !phone || !projectType || !details) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const { error } = await supabaseAdmin()
    .from("project_inquiries")
    .insert({
      name,
      company: company || null,
      email,
      phone,
      project_type: projectType,
      budget: budget || null,
      timeline: timeline || null,
      details,
    });

  if (error) {
    console.error("project_inquiries insert failed:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  await notifyNewInquiry({ name, company, email, phone, projectType, budget, timeline, details });

  return NextResponse.json({ ok: true });
}
