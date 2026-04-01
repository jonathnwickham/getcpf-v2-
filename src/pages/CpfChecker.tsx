import { useState } from "react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const validateCpfMod11 = (cpfStr: string): boolean => {
  const digits = cpfStr.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[10])) return false;
  return true;
};

const formatCpf = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

type CheckResult = "idle" | "valid" | "invalid" | "too-short";

const CpfChecker = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CheckResult>("idle");


  const handleCheck = () => {
    const digits = input.replace(/\D/g, "");
    if (digits.length !== 11) {
      setResult("too-short");
      return;
    }
    setResult(validateCpfMod11(digits) ? "valid" : "invalid");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(formatCpf(e.target.value));
    setResult("idle");
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Free CPF Number Checker — GET CPF" description="Check if a Brazilian CPF number is valid with our free tool. Instant Mod-11 checksum validation." path="/cpf-checker" />
      <Navbar />
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-[560px] mx-auto">
          <div className="text-center mb-10">
            <span className="text-4xl mb-4 block">🔍</span>
            <h1 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold tracking-tight leading-tight">
              Free CPF Number Checker
            </h1>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed max-w-md mx-auto">
              Enter a CPF number to verify if it's mathematically valid. This checks the Mod-11 checksum — the same algorithm Brazil's Receita Federal uses.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">CPF Number</label>
              <input
                type="text"
                value={input}
                onChange={handleChange}
                placeholder="000.000.000-00"
                maxLength={14}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3.5 text-lg font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary text-center"
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              />
            </div>
            <button
              onClick={handleCheck}
              disabled={input.replace(/\D/g, "").length === 0}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
            >
              Check CPF →
            </button>

            {result === "valid" && (
              <div className="bg-[hsl(142,70%,49%)]/10 border border-[hsl(142,70%,49%)]/20 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">✅</div>
                <p className="text-sm font-bold text-foreground">Valid CPF format</p>
                <p className="text-xs text-muted-foreground mt-1">This CPF number passes the Mod-11 checksum validation.</p>
              </div>
            )}
            {result === "invalid" && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">❌</div>
                <p className="text-sm font-bold text-foreground">Invalid CPF number</p>
                <p className="text-xs text-muted-foreground mt-1">This number doesn't pass the checksum validation. Double-check the digits.</p>
              </div>
            )}
            {result === "too-short" && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">⚠️</div>
                <p className="text-sm font-bold text-foreground">Incomplete number</p>
                <p className="text-xs text-muted-foreground mt-1">A CPF number has exactly 11 digits. Please enter the full number.</p>
              </div>
            )}
          </div>

          <div className="mt-6 bg-secondary/50 border border-border rounded-xl p-4 text-xs text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground mb-1">ℹ️ What this tool does</p>
            <p>This checker validates the mathematical format of a CPF number using the official Mod-11 algorithm. It does <strong className="text-foreground">not</strong> check registration status with the Receita Federal or verify the identity of the holder. No data is stored or transmitted.</p>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center bg-card border border-border rounded-2xl p-8">
            <h2 className="text-lg font-extrabold mb-2">Don't have a CPF yet?</h2>
            <p className="text-sm text-muted-foreground mb-4">We prepare everything you need to get your CPF on the first visit. AI-powered, $49 one-time payment.</p>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              Get my CPF Ready Pack — $49 →
            </Link>
          </div>

          {/* FAQ schema for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "How do I check if a CPF number is valid?",
                    acceptedAnswer: { "@type": "Answer", text: "Enter the 11-digit CPF number into the checker above. It validates the number using the official Mod-11 checksum algorithm used by Brazil's Receita Federal." },
                  },
                  {
                    "@type": "Question",
                    name: "What is the CPF Mod-11 algorithm?",
                    acceptedAnswer: { "@type": "Answer", text: "The Mod-11 algorithm is a mathematical checksum that verifies the last two digits of a CPF number. It ensures the number follows the official format used by the Brazilian tax authority." },
                  },
                  {
                    "@type": "Question",
                    name: "Can foreigners get a CPF in Brazil?",
                    acceptedAnswer: { "@type": "Answer", text: "Yes. Foreigners can apply for a CPF at any Receita Federal office in Brazil with their passport, proof of Brazilian address, and mother's full name. The process is free and usually completed the same day." },
                  },
                ],
              }),
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CpfChecker;
