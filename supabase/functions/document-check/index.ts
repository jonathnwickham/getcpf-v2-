import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, fileName, mimeType } = await req.json();
    
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image data provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a CPF application document reviewer for foreigners applying for a Brazilian CPF (Cadastro de Pessoas Físicas). 

Analyze the uploaded document image and check it against the CPF application requirements. Return a JSON response using the provided tool.

Document requirements to check:
1. PASSPORT BIO PAGE: Clear photo, name visible, passport number visible, nationality visible, date of birth visible, expiry date visible
2. PASSPORT VISA/STAMP PAGE: Brazilian entry stamp or visa visible, date of entry visible
3. PROOF OF ADDRESS: Shows a Brazilian address, shows the person's name or host's name, is recent (utility bill, hotel booking, rental contract, or host declaration)
4. CPF APPLICATION FORM (FCPF): Filled out correctly, all required fields completed, signed

For each document you can identify, rate it as:
- "pass" = clearly meets requirements
- "warning" = partially meets requirements or quality could be better  
- "fail" = does not meet requirements or cannot be verified

Be thorough but fair. If text is clearly readable and all required info is visible, mark it as pass.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please analyze this document (filename: ${fileName || "unknown"}). Identify what type of CPF-related document this is and check if it meets the requirements.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "document_review",
              description: "Return the document review results",
              parameters: {
                type: "object",
                properties: {
                  documentType: {
                    type: "string",
                    enum: ["passport_bio", "passport_visa", "proof_of_address", "cpf_form", "host_declaration", "other", "unknown"],
                    description: "The type of document identified",
                  },
                  overallStatus: {
                    type: "string",
                    enum: ["pass", "warning", "fail"],
                    description: "Overall assessment of the document",
                  },
                  summary: {
                    type: "string",
                    description: "A brief 1-2 sentence summary of what was found",
                  },
                  checks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        item: { type: "string", description: "What was checked" },
                        status: { type: "string", enum: ["pass", "warning", "fail"] },
                        note: { type: "string", description: "Details about this check" },
                      },
                      required: ["item", "status", "note"],
                    },
                  },
                  recommendations: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of recommendations to improve or fix issues",
                  },
                },
                required: ["documentType", "overallStatus", "summary", "checks", "recommendations"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "document_review" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "Failed to analyze document" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const review = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(review), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback if no tool call
    return new Response(JSON.stringify({
      documentType: "unknown",
      overallStatus: "warning",
      summary: "Could not fully analyze the document. Please ensure it's a clear, well-lit image.",
      checks: [],
      recommendations: ["Try uploading a clearer image", "Make sure the entire document is visible"],
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("document-check error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
