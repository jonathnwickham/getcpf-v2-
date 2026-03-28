import { useState } from "react";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal = ({ isOpen, onClose }: SignupModalProps) => {
  const [formState, setFormState] = useState<"form" | "loading" | "success">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [nationality, setNationality] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !location) {
      setError("Please fill all fields");
      setTimeout(() => setError(""), 2000);
      return;
    }
    setFormState("loading");
    setTimeout(() => setFormState("success"), 1500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setFormState("form");
      setName("");
      setEmail("");
      setLocation("");
      setNationality("");
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-8"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-card border border-foreground/[0.08] rounded-xl p-10 max-w-[440px] w-full relative animate-modal-in">
        <button onClick={handleClose} className="absolute top-4 right-4 text-text-tertiary text-2xl hover:text-foreground hover:bg-foreground/5 w-8 h-8 flex items-center justify-center rounded-lg transition-all">
          ×
        </button>

        {formState !== "success" ? (
          <>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Let's get you started</h2>
            <p className="text-sm text-text-secondary mb-8 leading-relaxed">
              Create your free account to begin the AI-powered CPF consultation. Takes 30 seconds.
            </p>

            <div className="mb-5">
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="As it appears on your passport"
                className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg text-foreground text-sm outline-none focus:border-primary transition-colors placeholder:text-text-tertiary"
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg text-foreground text-sm outline-none focus:border-primary transition-colors placeholder:text-text-tertiary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Where are you now?</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg text-foreground text-sm outline-none focus:border-primary transition-colors appearance-none"
                >
                  <option value="" disabled>Select...</option>
                  <option value="brazil">I'm in Brazil</option>
                  <option value="outside">I'm outside Brazil</option>
                  <option value="planning">Planning to visit</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Nationality</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="e.g. American"
                  className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg text-foreground text-sm outline-none focus:border-primary transition-colors placeholder:text-text-tertiary"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={formState === "loading"}
              className={`w-full py-3.5 rounded-[10px] font-bold text-base transition-all mt-2 ${
                error
                  ? "bg-destructive text-foreground"
                  : "bg-primary text-primary-foreground hover:brightness-110"
              } ${formState === "loading" ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {error || (formState === "loading" ? "Creating your account..." : "Create account →")}
            </button>

            <div className="flex items-center gap-2 mt-4 text-xs text-text-tertiary">
              <span>🔒</span> Your data is encrypted and never sold. Used only for your CPF consultation.
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold mb-2">You're in!</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We've sent a confirmation to your email. Click the link to access your AI-powered CPF consultation.
            </p>
            <div className="bg-secondary rounded-lg p-5 mt-6 text-left">
              <h3 className="font-semibold text-sm mb-1">What happens next</h3>
              <p className="text-xs text-text-secondary">
                Our AI will walk you through a short conversation to understand your exact situation, validate your documents, and generate your personalized Ready Pack — everything you need to get your CPF.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupModal;
