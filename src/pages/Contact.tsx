import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Send confirmation email via transactional email system
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-form-confirmation",
          recipientEmail: email,
          idempotencyKey: `contact-confirm-${email}-${Date.now()}`,
          templateData: { name },
        },
      });
    } catch (err) {
      console.error("Failed to send contact confirmation email:", err);
    }

    setSubmitted(true);
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
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
