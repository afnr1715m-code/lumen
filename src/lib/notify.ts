import { Resend } from "resend";

// Uses Resend's shared onboarding@resend.dev sender until Lumen verifies its
// own domain in Resend — that sender only delivers to the email address the
// Resend account itself was signed up with, which is exactly NOTIFY_EMAIL's
// role here (the business owner's inbox).
function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

async function sendNotification(subject: string, html: string) {
  const resend = getResend();
  const to = process.env.NOTIFY_EMAIL;
  if (!resend || !to) {
    console.warn("Notification skipped: RESEND_API_KEY or NOTIFY_EMAIL not configured.");
    return;
  }
  try {
    await resend.emails.send({
      from: "Lumen <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
  } catch (error) {
    // Never let a notification failure break the booking/inquiry flow itself.
    console.error("Failed to send notification email:", error);
  }
}

export async function notifyNewInquiry(data: {
  name: string;
  company?: string | null;
  email: string;
  phone: string;
  projectType: string;
  budget?: string | null;
  timeline?: string | null;
  details: string;
}) {
  await sendNotification(
    `طلب مشروع جديد — ${data.name}`,
    `
      <h2>طلب مشروع جديد</h2>
      <p><strong>الاسم:</strong> ${data.name}</p>
      ${data.company ? `<p><strong>الشركة:</strong> ${data.company}</p>` : ""}
      <p><strong>البريد:</strong> ${data.email}</p>
      <p><strong>الجوال:</strong> ${data.phone}</p>
      <p><strong>نوع المشروع:</strong> ${data.projectType}</p>
      ${data.budget ? `<p><strong>الميزانية:</strong> ${data.budget}</p>` : ""}
      ${data.timeline ? `<p><strong>الموعد المتوقع:</strong> ${data.timeline}</p>` : ""}
      <p><strong>التفاصيل:</strong><br/>${data.details.replace(/\n/g, "<br/>")}</p>
    `
  );
}

export async function notifyNewBooking(data: {
  reference: string;
  consultationTitle: string;
  isoDateTime: string;
  name: string;
  email: string;
  phone: string;
  notes?: string | null;
}) {
  const when = new Date(data.isoDateTime).toLocaleString("ar-SA", {
    timeZone: "Asia/Riyadh",
    dateStyle: "full",
    timeStyle: "short",
  });
  await sendNotification(
    `طلب حجز جديد بانتظار التحويل — ${data.consultationTitle}`,
    `
      <h2>طلب حجز استشارة جديد — بانتظار الدفع</h2>
      <p>يلزم الرد على العميل بالبريد الإلكتروني ببيانات التحويل البنكي، ثم تأكيد الحجز يدويًا في Supabase بعد استلام المبلغ.</p>
      <p><strong>رقم المرجع:</strong> ${data.reference}</p>
      <p><strong>نوع الاستشارة:</strong> ${data.consultationTitle}</p>
      <p><strong>الموعد المطلوب:</strong> ${when}</p>
      <p><strong>الاسم:</strong> ${data.name}</p>
      <p><strong>البريد:</strong> ${data.email}</p>
      <p><strong>الجوال:</strong> ${data.phone}</p>
      ${data.notes ? `<p><strong>ملاحظات:</strong><br/>${data.notes.replace(/\n/g, "<br/>")}</p>` : ""}
    `
  );
}

export async function notifyMilestonePaymentClaimed(data: {
  projectName: string;
  clientName: string;
  milestoneName: string;
  amountLabel: string;
  proposalId: string;
}) {
  await sendNotification(
    `تحويل مُرسَل لمرحلة دفع — ${data.projectName}`,
    `
      <h2>عميل يقول إنه أرسل تحويلًا لمرحلة دفع</h2>
      <p>تحقق من استلام المبلغ، ثم أكّد المرحلة يدويًا في Supabase (project_milestones → status = paid).</p>
      <p><strong>المشروع:</strong> ${data.projectName}</p>
      <p><strong>العميل:</strong> ${data.clientName}</p>
      <p><strong>المرحلة:</strong> ${data.milestoneName}</p>
      <p><strong>المبلغ:</strong> ${data.amountLabel}</p>
      <p><strong>رقم المقترح:</strong> ${data.proposalId}</p>
    `
  );
}
