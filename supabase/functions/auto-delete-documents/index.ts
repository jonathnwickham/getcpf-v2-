import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

// Auto-delete passport images 30 days after CPF is issued
// Deploy: npx supabase functions deploy auto-delete-documents --no-verify-jwt
// Schedule: call via cron (Supabase pg_cron or external scheduler) daily

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find applications with CPF issued more than 30 days ago that still have document URLs
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: apps, error } = await supabase
      .from("applications")
      .select("id, user_id, passport_photo_url, selfie_url, address_proof_url, status")
      .in("status", ["cpf_issued"])
      .lt("updated_at", thirtyDaysAgo)
      .or("passport_photo_url.neq.,selfie_url.neq.,address_proof_url.neq.");

    if (error) {
      console.error("Query error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let deletedCount = 0;

    for (const app of apps || []) {
      const filesToDelete: string[] = [];

      // Collect file paths from URLs
      for (const url of [app.passport_photo_url, app.selfie_url, app.address_proof_url]) {
        if (url && url.includes("/documents/")) {
          const path = url.split("/documents/")[1];
          if (path) filesToDelete.push(decodeURIComponent(path));
        }
      }

      // Delete files from storage
      if (filesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("documents")
          .remove(filesToDelete);
        if (storageError) {
          console.error(`Storage delete error for app ${app.id}:`, storageError);
          continue;
        }
      }

      // Clear URLs from the application record
      await supabase
        .from("applications")
        .update({
          passport_photo_url: null,
          selfie_url: null,
          address_proof_url: null,
        })
        .eq("id", app.id);

      deletedCount++;
      console.log(`Deleted documents for application ${app.id} (user: ${app.user_id})`);
    }

    return new Response(
      JSON.stringify({ deleted: deletedCount, checked: apps?.length || 0 }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("auto-delete-documents error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
