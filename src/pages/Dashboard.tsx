import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  fetchLatestApplication,
  applicationHasReadyPack,
  mapApplicationToOnboardingData,
  persistOnboardingData,
} from "@/lib/application-storage";
import { maskPassport } from "@/lib/mask-passport";
import { toast } from "sonner";

const CpfConfirmation = ({ applicationId, existingCpf }: { applicationId: string; existingCpf: string | null }) => {
  const [cpf, setCpf] = useState(existingCpf || "");
  const [showInput, setShowInput] = useState(!!existingCpf);
  const [saving, setSaving] = useState(false);

  const validateCpfMod11 = (cpfStr: string): boolean => {
    const digits = cpfStr.replace(/\D/g, "");
    if (digits.length !== 11) return false;
    // Reject all-same-digit CPFs
    if (/^(\d)\1{10}$/.test(digits)) return false;
    // First check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(digits[9])) return false;
    // Second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(digits[10])) return false;
    return true;
  };

  const handleSave = async () => {
    const trimmed = cpf.trim();
    if (!trimmed) return;
    if (!validateCpfMod11(trimmed)) {
      toast.error("Invalid CPF number. Please check the digits and try again.");
      return;
    }
    setSaving(true);
    // First save the CPF number
    await supabase
      .from("applications")
      .update({ cpf_number: trimmed })
      .eq("id", applicationId);
    // Then transition status via secure RPC
    const { error } = await supabase
      .rpc("transition_application_status" as any, { _application_id: applicationId, _new_status: "completed" });
    setSaving(false);
    if (error) {
      toast.error("Could not save your CPF number. Try again.");
    } else {
      toast.success("CPF number saved.");
    }
  };

  if (showInput || existingCpf) {
    return (
      <div className="mt-6 bg-primary/5 border border-primary/15 rounded-xl p-4">
        <div className="text-xs text-primary font-bold uppercase tracking-wider mb-2">🎉 Your CPF Number</div>
        {existingCpf && !showInput ? (
          <div className="text-2xl font-extrabold font-mono tracking-wide">{existingCpf}</div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter your CPF number"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-base font-mono tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              onClick={handleSave}
              disabled={saving || !cpf.trim()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        onClick={() => setShowInput(true)}
        className="bg-[hsl(142,70%,49%)] text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
      >
        🎉 It worked! Save my CPF number
      </button>
    </div>
  );
};

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null; plan: string | null } | null>(null);
  const [application, setApplication] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    Promise.all([
      supabase.from("profiles").select("full_name, plan").eq("id", user.id).single(),
      fetchLatestApplication(user.id),
    ]).then(([profileRes, app]) => {
      setProfile(profileRes.data);
      setApplication(app);
      setChecking(false);

      if (!app) {
        // No application at all — send to onboarding
        navigate("/get-started");
        return;
      }

      // Stay on dashboard — show the user their data
    });
  }, [user, loading, navigate]);

  if (loading || checking) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Getting your stuff ready...</div>
    </div>
  );

  if (!user || !application) return null;

  const firstName = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-[960px] mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <a href="/" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">← GET CPF</a>
            <h1 className="text-2xl font-extrabold mt-2">Hey {firstName} 👋</h1>
            <p className="opacity-80 text-sm mt-1">Here's where you left off</p>
          </div>
          <button onClick={signOut} className="bg-primary-foreground/15 hover:bg-primary-foreground/25 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-6 py-8 space-y-8">
        {/* Application summary */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-lg">📋</div>
            <div>
              <h2 className="font-bold text-lg">Your CPF application</h2>
              <p className="text-xs text-muted-foreground">
                Status: <span className="text-primary font-semibold capitalize">{application.status}</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {application.full_name && <InfoField label="Full name" value={application.full_name} />}
            {application.nationality && <InfoField label="Nationality" value={application.nationality} />}
            {application.passport_number && <InfoField label="Passport" value={maskPassport(application.passport_number)} />}
            {application.state_name && <InfoField label="State" value={application.state_name} />}
            {application.city && <InfoField label="City" value={application.city} />}
            {application.email && <InfoField label="Email" value={application.email} />}
          </div>
          <CpfConfirmation applicationId={application.id} existingCpf={application.cpf_number} />
          <div className="mt-4">
            <button
              onClick={() => navigate("/ready-pack")}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
            >
              Open my Ready Pack →
            </button>
          </div>
        </section>

        {/* Partners */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-extrabold">What to do next with your CPF</h2>
            <p className="text-sm text-muted-foreground mt-1">The most useful things to set up right after getting your CPF, each one is tried and tested by people who've done exactly this.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PARTNERS.map((p) => (
              <PartnerCard key={p.name} partner={p} />
            ))}
          </div>
        </section>

        {/* Share */}
        <section className="bg-card border border-border rounded-2xl p-6 text-center">
          <h2 className="font-bold text-lg mb-2">Know someone heading to Brazil?</h2>
          <p className="text-sm text-muted-foreground mb-4">Send them this, they'll thank you later.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => navigator.clipboard.writeText("https://getcpf.com")}
              className="bg-secondary text-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all"
            >
              📋 Copy link
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent("If you're going to Brazil and need a CPF, this tool prepares everything for you: https://getcpf.com")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[hsl(142,70%,49%)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
            >
              💬 WhatsApp
            </a>
          </div>
        </section>

        {/* My Data */}
        <MyDataSection user={user} application={application} />

        {/* Partner Access */}
        <PartnerAccessSection applicationId={application.id} initialValue={application.partner_access_granted ?? false} />
      </div>
    </div>
  );
};

/* ── Partner Access Toggle ── */
const PartnerAccessSection = ({ applicationId, initialValue }: { applicationId: string; initialValue: boolean }) => {
  const [enabled, setEnabled] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    const newVal = !enabled;
    setSaving(true);
    const { error } = await supabase
      .from("applications")
      .update({ partner_access_granted: newVal } as any)
      .eq("id", applicationId);
    setSaving(false);
    if (error) {
      toast.error("Could not update partner access. Try again.");
    } else {
      setEnabled(newVal);
      toast.success(newVal ? "Partner access enabled." : "Partner access disabled.");
    }
  };

  return (
    <section className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-lg">🤝</div>
        <div>
          <h2 className="font-bold text-lg">Partner Access</h2>
          <p className="text-xs text-muted-foreground">Control who can verify your CPF status</p>
        </div>
      </div>
      <div className="flex items-center justify-between bg-secondary rounded-xl p-4">
        <div>
          <p className="text-sm font-semibold">Allow partners to verify your CPF</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            When enabled, partner services (banks, eSIM providers) can confirm you have a valid CPF without seeing the number itself.
          </p>
        </div>
        <button
          onClick={toggle}
          disabled={saving}
          className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
            enabled ? "bg-primary" : "bg-muted-foreground/30"
          } ${saving ? "opacity-50" : ""}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`} />
        </button>
      </div>
    </section>
  );
};

/* ── My Data Section ── */
const MyDataSection = ({ user, application }: { user: any; application: any }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editData, setEditData] = useState({
    full_name: application?.full_name || "",
    mother_name: application?.mother_name || "",
    father_name: application?.father_name || "",
    nationality: application?.nationality || "",
    street_address: application?.street_address || "",
    city: application?.city || "",
    state_name: application?.state_name || "",
    host_name: application?.host_name || "",
    host_address: application?.host_address || "",
    host_city: application?.host_city || "",
    host_cpf: application?.host_cpf || "",
  });
  const [saving, setSaving] = useState(false);

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    if (error) {
      toast.error(error.message || "Could not update password.");
    } else {
      toast.success("Password updated successfully.");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowPassword(false);
    }
  };

  const handleDownload = async () => {
    const { data: consentData } = await supabase
      .from("consent_log")
      .select("*")
      .eq("user_id", user.id);

    const exportData = {
      name: application?.full_name || null,
      email: application?.email || user.email,
      nationality: application?.nationality || null,
      passport_number: application?.passport_number
        ? "*".repeat(Math.max(0, application.passport_number.length - 4)) + application.passport_number.slice(-4)
        : null,
      mother_name: application?.mother_name || null,
      father_name: application?.father_name || null,
      address: application?.street_address || null,
      city: application?.city || null,
      state: application?.state_name || null,
      application_status: application?.status || null,
      document_generated_at: application?.submitted_at || null,
      consent_log: consentData || [],
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "getcpf-my-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Your data has been downloaded.");
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("applications")
      .update({
        full_name: editData.full_name,
        mother_name: editData.mother_name,
        father_name: editData.father_name,
        nationality: editData.nationality,
        street_address: editData.street_address,
        city: editData.city,
        state_name: editData.state_name,
        host_name: editData.host_name,
        host_address: editData.host_address,
        host_city: editData.host_city,
        host_cpf: editData.host_cpf,
      })
      .eq("id", application.id);
    setSaving(false);
    if (error) {
      toast.error("Could not save changes. Try again.");
    } else {
      toast.success("Your details have been updated.");
      setShowEdit(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    await supabase.from("applications").delete().eq("user_id", user.id);
    await supabase
      .from("profiles")
      .update({
        full_name: null,
        email: `deleted-${user.id.slice(0, 8)}@deleted.getcpf.com`,
        country_code: null,
        location: null,
      })
      .eq("id", user.id);
    await signOut();
    navigate("/");
    toast.success("Your account and data have been permanently deleted.");
  };

  const editableFields = [
    { key: "full_name", label: "Full name" },
    { key: "mother_name", label: "Mother's name" },
    { key: "father_name", label: "Father's name" },
    { key: "nationality", label: "Nationality" },
    { key: "street_address", label: "Street address" },
    { key: "city", label: "City" },
    { key: "state_name", label: "State" },
    { key: "host_name", label: "Host name" },
    { key: "host_address", label: "Host address" },
    { key: "host_city", label: "Host city" },
    { key: "host_cpf", label: "Host CPF" },
  ];

  return (
    <section className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-lg">🔐</div>
        <div>
          <h2 className="font-bold text-lg">My Data</h2>
          <p className="text-xs text-muted-foreground">Manage your personal data and account settings</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowPassword(true)}
          className="bg-secondary text-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all"
        >
          🔑 Change password
        </button>
        <button
          onClick={handleDownload}
          className="bg-secondary text-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all"
        >
          📥 Download my data
        </button>
        <button
          onClick={() => setShowEdit(true)}
          className="bg-secondary text-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all"
        >
          ✏️ Update my details
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="bg-destructive/10 text-destructive px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-destructive/20 transition-all"
        >
          🗑️ Delete my account
        </button>
      </div>

      {/* Change Password Modal */}
      <Dialog open={showPassword} onOpenChange={setShowPassword}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm outline-none focus:border-primary"
              />
              <p className="text-[10px] text-muted-foreground mt-1">At least 6 characters</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Confirm new password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={changingPassword || !newPassword || !confirmNewPassword}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
            >
              {changingPassword ? "Updating..." : "Update password"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update my details</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {editableFields.map(({ key, label }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                  {label}
                </label>
                <input
                  type="text"
                  value={(editData as any)[key] || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm outline-none focus:border-primary"
                />
              </div>
            ))}
            {application?.passport_number && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                  Passport number
                </label>
                <input
                  type="text"
                  value={maskPassport(application.passport_number)}
                  disabled
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-muted-foreground cursor-not-allowed"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Passport number cannot be edited after submission. Contact support if you need to change it.</p>
              </div>
            )}
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete my account</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            This will permanently delete your account and all personal data including your documents. This cannot be undone. Your access to the Ready Pack will end immediately.
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowDelete(false)}
              className="flex-1 bg-secondary text-foreground py-2.5 rounded-lg font-semibold text-sm hover:bg-secondary/80 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="flex-1 bg-destructive text-destructive-foreground py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Confirm deletion"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">{label}</div>
    <div className="font-semibold text-foreground">{value}</div>
  </div>
);

const PARTNERS = [
  {
    icon: "📱",
    name: "Airalo",
    category: "eSIM / Data",
    summary: "Get a Brazil eSIM in 2 minutes, works the moment you land.",
    detail: "You need a CPF to buy a physical SIM from Claro, Vivo, or TIM. With Airalo you get data immediately while sorting your CPF. Plans from $5. No store visit needed, install directly from your phone.",
    tip: "Most popular choice: the 5GB / 30-day Brazil plan. Enough for maps, Uber, and messaging.",
    url: "https://www.airalo.com",
  },
  {
    icon: "🏦",
    name: "Nubank",
    category: "Bank Account",
    summary: "Brazil's #1 digital bank. Zero fees, instant Pix, debit & credit card.",
    detail: "Download the Nubank app, enter your CPF + passport, get approved in minutes. Nubank is what most Brazilians use. You get Pix (Brazil's free instant payment system) immediately. Use it at restaurants, shops, Uber, everything.",
    tip: "Nubank is the fastest way to get Pix. Most expats open this on the same day they get their CPF.",
    url: "https://nubank.com.br",
  },
  {
    icon: "💸",
    name: "Wise",
    category: "International Transfers",
    summary: "Send money to/from Brazil at the real exchange rate. Way cheaper than banks.",
    detail: "Brazilian banks charge huge spreads on foreign currency. Wise gives you the mid-market rate with minimal fees. Essential if you receive income from abroad or need to move money between countries. Connect it to your Nubank for instant BRL deposits.",
    tip: "Set up a BRL balance in Wise and connect your Nubank account for seamless transfers.",
    url: "https://wise.com",
  },
  {
    icon: "🏥",
    name: "SafetyWing",
    category: "Health & Travel Insurance",
    summary: "Month-to-month health coverage for nomads in Brazil. From $45/month.",
    detail: "Brazil's public healthcare (SUS) is free but crowded and Portuguese-only. Private hospitals can cost thousands without insurance. SafetyWing covers hospitals, clinics, and emergencies across Latin America. Cancel anytime, no long contracts.",
    tip: "Covers COVID, emergency dental, and adventure sports. Most digital nomads in Brazil use this.",
    url: "https://safetywing.com",
  },
  {
    icon: "🗣️",
    name: "iTalki",
    category: "Learn Portuguese",
    summary: "1-on-1 video lessons with native Brazilian Portuguese speakers.",
    detail: "Even 5 lessons makes a massive difference, at the Receita Federal office, at restaurants, with landlords. Brazilian Portuguese is different from European Portuguese and very different from Spanish. R$30-60/hour for a private tutor.",
    tip: "Book a few lessons before your office visit. Learn numbers, greetings, and how to say 'I'm here for my CPF'.",
    url: "https://www.italki.com",
  },
  {
    icon: "🏛️",
    name: "Gov.br",
    category: "Digital Government ID",
    summary: "Brazil's digital ID portal, needed for official services.",
    detail: "Register at gov.br with your CPF to access government services online. You can download your digital CPF card from the Receita Federal app after registering. This replaces the paper document, show it on your phone anywhere.",
    tip: "After registering, download the 'Receita Federal' app and go to 'CPF Digital' to get your digital card.",
    url: "https://www.gov.br",
  },
];

const PartnerCard = ({ partner }: { partner: typeof PARTNERS[0] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 flex items-start gap-4 hover:bg-secondary/30 transition-colors"
      >
        <span className="text-3xl mt-0.5">{partner.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-sm">{partner.name}</h3>
            <span className="text-[9px] uppercase tracking-wider text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">{partner.category}</span>
          </div>
          <p className="text-xs text-muted-foreground">{partner.summary}</p>
        </div>
        <span className={`text-muted-foreground transition-transform shrink-0 mt-1 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0 border-t border-border">
          <p className="text-sm text-foreground mt-4 leading-relaxed">{partner.detail}</p>
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 mt-3">
            <p className="text-xs text-primary font-medium">💡 {partner.tip}</p>
          </div>
            <a
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all group/ext"
            >
              Visit {partner.name} <span className="text-[10px] opacity-60 group-hover/ext:opacity-100 transition-opacity">↗ opens in new tab</span>
            </a>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
