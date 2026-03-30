import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

type AdminTab = "users" | "applications" | "revenue" | "settings";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  country_code: string | null;
  plan: string | null;
  created_at: string | null;
  stripe_customer_id: string | null;
}

interface Application {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  nationality: string | null;
  state_name: string | null;
  city: string | null;
  status: string | null;
  created_at: string | null;
  submitted_at: string | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<AdminTab>("users");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    // Check admin role via has_role function
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" })
      .then(({ data }) => {
        if (data) {
          setIsAdmin(true);
          loadData();
        } else {
          navigate("/ready-pack");
        }
        setChecking(false);
      });
  }, [user, authLoading, navigate]);

  const loadData = async () => {
    const [profilesRes, appsRes] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("applications").select("*"),
    ]);
    if (profilesRes.data) setProfiles(profilesRes.data);
    if (appsRes.data) setApplications(appsRes.data);
  };

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Checking access...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const totalUsers = profiles.length;
  const paidUsers = profiles.filter(p => p.plan && p.plan !== "free").length;
  const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : "0";

  const tabs: { key: AdminTab; label: string }[] = [
    { key: "users", label: "Users" },
    { key: "applications", label: "Applications" },
    { key: "revenue", label: "Revenue" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <a href="/" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">← GET CPF</a>
            <h1 className="text-xl font-extrabold mt-1">Admin Dashboard</h1>
          </div>
          <button onClick={signOut} className="bg-primary-foreground/15 hover:bg-primary-foreground/25 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "users" && <UsersTab profiles={profiles} totalUsers={totalUsers} paidUsers={paidUsers} conversionRate={conversionRate} />}
        {tab === "applications" && <ApplicationsTab applications={applications} profiles={profiles} />}
        {tab === "revenue" && <RevenueTab profiles={profiles} />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
};

/* ── Users Tab ── */
const UsersTab = ({ profiles, totalUsers, paidUsers, conversionRate }: {
  profiles: Profile[];
  totalUsers: number;
  paidUsers: number;
  conversionRate: string;
}) => (
  <div className="space-y-6">
    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Total users" value={totalUsers.toString()} />
      <StatCard label="Paid users" value={paidUsers.toString()} />
      <StatCard label="Conversion rate" value={`${conversionRate}%`} />
      <StatCard label="Revenue (est.)" value={`$${paidUsers * 49}`} />
    </div>

    {/* Table */}
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Signed up</TableHead>
            <TableHead>Stripe ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map(p => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{p.email}</TableCell>
              <TableCell>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  p.plan && p.plan !== "free"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {p.plan || "free"}
                </span>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}
              </TableCell>
              <TableCell className="text-xs font-mono text-muted-foreground">
                {p.stripe_customer_id ? p.stripe_customer_id.slice(0, 12) + "…" : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

/* ── Applications Tab ── */
const ApplicationsTab = ({ applications, profiles }: { applications: Application[]; profiles: Profile[] }) => {
  const profileMap = new Map(profiles.map(p => [p.id, p]));

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>State</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map(a => {
            const profile = profileMap.get(a.user_id);
            return (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.full_name || profile?.full_name || "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{a.email || profile?.email || "—"}</TableCell>
                <TableCell className="text-sm">{a.state_name || "—"}</TableCell>
                <TableCell className="text-sm">{a.city || "—"}</TableCell>
                <TableCell>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                    a.status === "prepared" ? "bg-primary/10 text-primary" :
                    a.status === "submitted" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                    "bg-secondary text-muted-foreground"
                  }`}>
                    {a.status || "draft"}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {a.submitted_at ? new Date(a.submitted_at).toLocaleDateString() : "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

/* ── Revenue Tab ── */
const RevenueTab = ({ profiles }: { profiles: Profile[] }) => {
  const paidUsers = profiles.filter(p => p.plan && p.plan !== "free").length;
  const totalRevenue = paidUsers * 49;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total revenue" value={`$${totalRevenue}`} />
        <StatCard label="Paid users" value={paidUsers.toString()} />
        <StatCard label="Avg. per user" value={totalRevenue > 0 ? `$${(totalRevenue / paidUsers).toFixed(0)}` : "$0"} />
        <StatCard label="Refunds" value="$0" />
      </div>
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <p className="text-sm text-muted-foreground">Revenue chart will populate once real payment data flows in via Stripe.</p>
      </div>
    </div>
  );
};

/* ── Settings Tab ── */
const SettingsTab = () => {
  const [exporting, setExporting] = useState(false);

  const exportCSV = async () => {
    setExporting(true);
    const { data } = await supabase.from("profiles").select("*");
    if (data) {
      const headers = ["id", "email", "full_name", "plan", "created_at"];
      const csv = [headers.join(","), ...data.map(r =>
        headers.map(h => `"${(r as any)[h] ?? ""}"`).join(",")
      )].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `getcpf-users-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setExporting(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
        <h2 className="font-bold text-lg">Data export</h2>
        <p className="text-sm text-muted-foreground">Export all user data as CSV for LGPD compliance requests.</p>
        <button
          onClick={exportCSV}
          disabled={exporting}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          {exporting ? "Exporting..." : "📥 Export users CSV"}
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-2">Payment integration</h2>
        <p className="text-sm text-muted-foreground">
          Stripe and PayPal integration settings will appear here once connected. Price changes and webhook configuration will be manageable from this panel.
        </p>
      </div>
    </div>
  );
};

/* ── Shared components ── */
const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-card border border-border rounded-xl p-4">
    <div className="text-xs text-muted-foreground font-medium">{label}</div>
    <div className="text-2xl font-extrabold mt-1">{value}</div>
  </div>
);

export default Admin;
