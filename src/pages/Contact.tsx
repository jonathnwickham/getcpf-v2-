import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // spam trap
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Rate limiting: max 3 submissions per 10 minutes
  const RATE_LIMIT_MAX = 3;
  const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

  const isRateLimited = (): boolean => {
    const key = "contact_form_timestamps";
    const now = Date.now();
    const stored = JSON.parse(localStorage.getItem(key) || "[]") as number[];
    const recent = stored.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= RATE_LIMIT_MAX) return true;
    recent.push(now);
    localStorage.setItem(key, JSON.stringify(recent));
    return false;
  };

  // Page meta
  useEffect(() => {
    document.title = "Contact Us — GET CPF";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Have a question about getting your Brazilian CPF? Contact the GET CPF team — we respond within 24 hours.");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check — bots fill hidden fields
    if (honeypot) return;

    if (isRateLimited()) {
      toast({ title: "Too many messages", description: "Please wait a few minutes before trying again.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-form-confirmation",
          recipientEmail: email,
          idempotencyKey: `contact-confirm-${email}-${Date.now()}`,
          templateData: { name },
        },
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to send contact confirmation email:", err);
      toast({ title: "Something went wrong", description: "Please try again or email us directly.", variant: "destructive" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-[500px] mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Contact us</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Have a question about getting your CPF? We respond within 24 hours.
          </p>

          {submitted ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">✉️</div>
              <h2 className="text-lg font-bold mb-2">Thanks for reaching out</h2>
              <p className="text-sm text-muted-foreground mb-6">
                We've sent a confirmation to your email. We respond within 24 hours.
              </p>
              <Link to="/" className="text-sm text-primary font-semibold hover:underline">
                Back to homepage
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot — hidden from humans, bots fill it */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  maxLength={2000}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
