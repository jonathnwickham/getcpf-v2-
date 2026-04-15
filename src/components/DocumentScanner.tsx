import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CheckItem {
  item: string;
  status: "pass" | "warning" | "fail";
  note: string;
}

interface ReviewResult {
  documentType: string;
  overallStatus: "pass" | "warning" | "fail";
  summary: string;
  checks: CheckItem[];
  recommendations: string[];
}

const DOC_TYPE_LABELS: Record<string, string> = {
  passport_bio: "Passport Bio Page",
  passport_visa: "Passport Visa/Entry Stamp",
  proof_of_address: "Proof of Address",
  cpf_form: "CPF Application Form",
  host_declaration: "Host Declaration Letter",
  other: "Other Document",
  unknown: "Unknown Document",
};

const STATUS_STYLES = {
  pass: { bg: "bg-green-800/10", text: "text-green-800", icon: "✓", label: "Pass" },
  warning: { bg: "bg-amber-100", text: "text-amber-700", icon: "⚠", label: "Needs attention" },
  fail: { bg: "bg-destructive/10", text: "text-destructive", icon: "✕", label: "Issue found" },
};

const DocumentScanner = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setResult(null);
    setFileName(file.name);

    // Create preview
    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      setIsAnalyzing(true);

      try {
        const { data, error: fnError } = await supabase.functions.invoke("document-check", {
          body: { imageBase64: base64, fileName: file.name, mimeType: file.type },
        });

        if (fnError) throw new Error(fnError.message);
        if (data?.error) throw new Error(data.error);
        setResult(data as ReviewResult);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to analyze document");
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const overallStyle = result ? STATUS_STYLES[result.overallStatus] : null;

  return (
    <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h2 className="font-bold">🤖 AI Document Scanner</h2>
        <p className="text-xs text-gray-500 mt-1">
          Upload a photo or scan of your documents. our AI checks if they meet CPF requirements
        </p>
      </div>
      <div className="p-6">
        {/* Upload zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-100 rounded-xl p-8 text-center cursor-pointer hover:border-green-800/40 hover:bg-green-800/5 transition-all"
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
          <div className="text-3xl mb-2">📄</div>
          <p className="text-sm font-semibold">Drop a document here or tap to upload</p>
          <p className="text-xs text-gray-500 mt-1">
            Passport page, proof of address, CPF form. any document for your application
          </p>
          <p className="text-[10px] text-gray-500 mt-2">JPG, PNG, or PDF • Max 20MB</p>
        </div>

        {/* Analyzing state */}
        {isAnalyzing && (
          <div className="mt-6 text-center py-8">
            <div className="inline-flex items-center gap-3 bg-green-800/10 text-green-800 px-5 py-3 rounded-xl">
              <div className="w-4 h-4 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-semibold">Analyzing {fileName}…</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">Our AI is checking your document against CPF requirements</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-xl p-4">
            <p className="text-sm text-destructive font-semibold">{error}</p>
            <button
              onClick={() => { setError(null); setResult(null); }}
              className="text-xs text-destructive/70 mt-1 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {result && overallStyle && (
          <div className="mt-6 space-y-4 animate-slide-in">
            {/* Header */}
            <div className={`flex items-center gap-3 ${overallStyle.bg} rounded-xl p-4`}>
              {preview && (
                <img src={preview} alt="Document" className="w-16 h-16 object-cover rounded-lg border border-gray-100" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-lg ${overallStyle.text}`}>{overallStyle.icon}</span>
                  <span className={`font-bold text-sm ${overallStyle.text}`}>{overallStyle.label}</span>
                  <span className="text-xs bg-white border border-gray-100 px-2 py-0.5 rounded font-medium">
                    {DOC_TYPE_LABELS[result.documentType] || result.documentType}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{result.summary}</p>
              </div>
            </div>

            {/* Checklist */}
            {result.checks.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Checklist</p>
                {result.checks.map((check, i) => {
                  const s = STATUS_STYLES[check.status];
                  return (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${s.bg} ${s.text}`}>
                        {s.icon}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{check.item}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{check.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-wider mb-2">💡 Recommendations</p>
                <ul className="space-y-1">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-gray-500 flex items-start gap-2">
                      <span className="shrink-0">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Scan another */}
            <button
              onClick={() => { setResult(null); setFileName(null); setPreview(null); fileRef.current?.click(); }}
              className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all"
            >
              📄 Scan another document
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DocumentScanner;
