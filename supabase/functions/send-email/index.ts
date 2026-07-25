import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

serve(async (req) => {
  try {
    const payload = await req.json();
    
    // We expect a Database Webhook payload from `reservations`
    if (payload.type !== "INSERT" && payload.type !== "UPDATE") {
      return new Response("Not an INSERT or UPDATE", { status: 200 });
    }

    const record = payload.record;
    if (!record) {
      return new Response("No record found", { status: 400 });
    }

    // Determine email type and idempotency key
    let emailType = "";
    let idempotencyKey = "";

    if (payload.type === "INSERT") {
      emailType = "reservation_created";
      idempotencyKey = `res_created_${record.id}`;
    } else if (payload.type === "UPDATE") {
      if (payload.old_record.status !== "rescheduled" && record.status === "rescheduled") {
        emailType = "reservation_rescheduled";
        idempotencyKey = `res_rescheduled_${record.id}_${Date.now()}`;
      } else if (payload.old_record.status !== "cancelled" && record.status === "cancelled") {
        emailType = "reservation_cancelled";
        idempotencyKey = `res_cancelled_${record.id}`;
      } else if (payload.old_record.status !== "confirmed" && record.status === "confirmed") {
        emailType = "reservation_confirmed";
        idempotencyKey = `res_confirmed_${record.id}`;
      } else {
        return new Response("No email trigger for this update", { status: 200 });
      }
    }

    // 1. Check & insert into email_logs idempotently
    const { data: logEntry, error: insertError } = await supabase
      .from("email_logs")
      .insert({
        idempotency_key: idempotencyKey,
        type: emailType,
        to_email: record.contact_email,
        related_id: record.id,
        status: "queued"
      })
      .select()
      .single();

    if (insertError) {
      // If it's a unique constraint violation, it means it's already queued/sent. 
      // We absorb the retry gracefully.
      if (insertError.code === "23505") {
        return new Response("Already processing this event (idempotency key exists).", { status: 200 });
      }
      throw insertError;
    }

    // 2. Prepare email content
    let subject = "";
    let htmlContent = "";

    if (emailType === "reservation_created") {
      subject = "Demande de rendez-vous reçue";
      htmlContent = `
        <h1>Bonjour ${record.contact_name},</h1>
        <p>Nous avons bien reçu votre demande de rendez-vous pour le <strong>${record.slot_date}</strong> à <strong>${record.slot_time}</strong>.</p>
        <p>Nous reviendrons vers vous très vite pour confirmer la rencontre.</p>
        <p>L'équipe Corex</p>
      `;
    } else if (emailType === "reservation_confirmed") {
      subject = "Rendez-vous confirmé";
      htmlContent = `
        <h1>Bonjour ${record.contact_name},</h1>
        <p>Votre rendez-vous du <strong>${record.slot_date}</strong> à <strong>${record.slot_time}</strong> a été confirmé par notre équipe.</p>
        <p>À très bientôt !</p>
      `;
    } else if (emailType === "reservation_cancelled") {
      subject = "Annulation de votre rendez-vous";
      htmlContent = `
        <h1>Bonjour ${record.contact_name},</h1>
        <p>Votre rendez-vous a été annulé par notre équipe.</p>
        <p>Si vous aviez demandé une replanification, vous devriez avoir reçu un lien unique pour cela.</p>
      `;
    } else if (emailType === "reservation_rescheduled") {
      subject = "Rendez-vous replanifié";
      htmlContent = `
        <h1>Bonjour ${record.contact_name},</h1>
        <p>Votre rendez-vous a bien été replanifié pour le <strong>${record.slot_date}</strong> à <strong>${record.slot_time}</strong>.</p>
      `;
    }

    // 3. Send email via Resend
    if (!RESEND_API_KEY) {
      console.warn("No RESEND_API_KEY found, simulating email send.");
      // Mark as sent
      await supabase.from("email_logs").update({ status: "sent", attempts: 1 }).eq("id", logEntry.id);
      return new Response("Simulated email send successfully.", { status: 200 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Corex Agency <hello@corex.agency>",
        to: [record.contact_email],
        subject: subject,
        html: htmlContent,
      }),
    });

    const resData = await res.json();

    if (res.ok) {
      // 4. Mark as sent
      await supabase
        .from("email_logs")
        .update({ status: "sent", attempts: 1 })
        .eq("id", logEntry.id);
      return new Response(JSON.stringify(resData), { status: 200 });
    } else {
      // 5. Mark as failed
      await supabase
        .from("email_logs")
        .update({ status: "failed", attempts: 1, error_msg: resData.message })
        .eq("id", logEntry.id);
      return new Response(JSON.stringify(resData), { status: 500 });
    }

  } catch (err) {
    console.error(err);
    const msg = err instanceof Error ? err.message : String(err)
    return new Response(msg, { status: 500 });
  }
});
