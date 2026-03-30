import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area,
} from "recharts";

type AdminTab = "users" | "applications" | "revenue" | "promos" | "settings";

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

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(210, 70%, 55%)",
  "hsl(150, 60%, 45%)",
  "hsl(340, 65%, 55%)",
  "hsl(40, 80%, 55%)",
  "hsl(270, 55%, 55%)",
  "hsl(190, 65%, 45%)",
];

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<AdminTab>("users");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
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

  const tabs: { key: AdminTab; label: string; icon: string }[] = [
    { key: "users", label: "Users", icon: "👥" },
    { key: "applications", label: "Applications", icon: "📋" },
    { key: "revenue", label: "Revenue", icon: "💰" },
    { key: "promos", label: "Promo Codes", icon: "🏷️" },
    { key: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <a href="/" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">← GET CPF</a>
            <h1 className="text-xl font-extrabold mt-1">Admin Dashboard</h1>
          </div>
          <button onClick={signOut} className="bg-primary-foreground/15 hover:bg-primary-foreground/25 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {tab === "users" && <UsersTab profiles={profiles} applications={applications} search={search} setSearch={setSearch} />}
        {tab === "applications" && <ApplicationsTab applications={applications} profiles={profiles} />}
        {tab === "revenue" && <RevenueTab profiles={profiles} applications={applications} />}
        {tab === "promos" && <PromosTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
};

/* ── Users Tab with search and funnel ── */
const UsersTab = ({ profiles, applications, search, setSearch }: {
  profiles: Profile[];
  applications: Application[];
  search: string;
  setSearch: (v: string) => void;
}) => {
  const totalUsers = profiles.length;
  const paidUsers = profiles.filter(p => p.plan && p.plan !== "free").length;
  const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : "0";
  const usersWithApps = new Set(applications.map(a => a.user_id)).size;

  const filtered = profiles.filter(p =>
    !search || 
    (p.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  // Funnel data
  const funnelData = [
    { stage: "Signed Up", count: totalUsers, fill: CHART_COLORS[0] },
    { stage: "Started App", count: usersWithApps, fill: CHART_COLORS[2] },
    { stage: "Paid", count: paidUsers, fill: CHART_COLORS[3] },
  ];

  // Signups over time (grouped by day)
  const signupsByDay = useMemo(() => {
    const map = new Map<string, number>();
    profiles.forEach(p => {
      if (p.created_at) {
        const day = new Date(p.created_at).toISOString().slice(0, 10);
        map.set(day, (map.get(day) || 0) + 1);
      }
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        signups: count,
      }));
  }, [profiles]);

  // Nationality breakdown
  const nationalityData = useMemo(() => {
    const map = new Map<string, number>();
    profiles.forEach(p => {
      const nat = p.country_code || "Unknown";
      map.set(nat, (map.get(nat) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, [profiles]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total users" value={totalUsers.toString()} icon="👥" />
        <StatCard label="Paid users" value={paidUsers.toString()} icon="✅" />
        <StatCard label="Conversion" value={`${conversionRate}%`} icon="📈" />
        <StatCard label="Est. revenue" value={`$${paidUsers * 49}`} icon="💵" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User funnel */}
        <ChartCard title="User Funnel" subtitle="Signup → Application → Paid">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={funnelData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis dataKey="stage" type="category" width={90} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {funnelData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Signups over time */}
        <ChartCard title="Signups Over Time" subtitle="Daily new users">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={signupsByDay} margin={{ left: 0, right: 10, top: 5 }}>
              <defs>
                <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="signups" stroke="hsl(var(--primary))" fill="url(#signupGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Nationality breakdown */}
        <ChartCard title="By Nationality" subtitle="Top 8 countries">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={nationalityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2}>
                {nationalityData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Search + Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full md:w-80 px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Signed up</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.email}</TableCell>
                <TableCell className="text-sm">{p.country_code || "—"}</TableCell>
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
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

/* ── Applications Tab ── */
const ApplicationsTab = ({ applications, profiles }: { applications: Application[]; profiles: Profile[] }) => {
  const profileMap = new Map(profiles.map(p => [p.id, p]));

  // State breakdown
  const stateData = useMemo(() => {
    const map = new Map<string, number>();
    applications.forEach(a => {
      const state = a.state_name || "Not set";
      map.set(state, (map.get(state) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  }, [applications]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total apps" value={applications.length.toString()} icon="📋" />
        <StatCard label="Submitted" value={applications.filter(a => a.submitted_at).length.toString()} icon="📤" />
        <StatCard label="Draft" value={applications.filter(a => a.status === "draft").length.toString()} icon="📝" />
        <StatCard label="Unique states" value={new Set(applications.map(a => a.state_name).filter(Boolean)).size.toString()} icon="🗺️" />
      </div>

      {/* State breakdown chart */}
      <ChartCard title="Applications by State" subtitle="Top 10 Brazilian states selected">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stateData} margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={-30} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>State</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map(a => {
              const profile = profileMap.get(a.user_id);
              return (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.full_name || profile?.full_name || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.email || profile?.email || "—"}</TableCell>
                  <TableCell className="text-sm">{a.nationality || "—"}</TableCell>
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
                    {a.created_at ? new Date(a.created_at).toLocaleDateString() : "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

/* ── Revenue Tab with charts ── */
const RevenueTab = ({ profiles, applications }: { profiles: Profile[]; applications: Application[] }) => {
  const paidUsers = profiles.filter(p => p.plan && p.plan !== "free").length;
  const totalRevenue = paidUsers * 49;
  const avgPerUser = paidUsers > 0 ? (totalRevenue / paidUsers).toFixed(0) : "0";

  // Revenue over time (based on paid user signup dates)
  const revenueByDay = useMemo(() => {
    const paidProfiles = profiles.filter(p => p.plan && p.plan !== "free" && p.created_at);
    const map = new Map<string, number>();
    paidProfiles.forEach(p => {
      const day = new Date(p.created_at!).toISOString().slice(0, 10);
      map.set(day, (map.get(day) || 0) + 49);
    });
    let cumulative = 0;
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => {
        cumulative += revenue;
        return {
          date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          revenue,
          cumulative,
        };
      });
  }, [profiles]);

  // Revenue by plan type
  const planData = useMemo(() => {
    const map = new Map<string, number>();
    profiles.forEach(p => {
      const plan = p.plan || "free";
      map.set(plan, (map.get(plan) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [profiles]);

  // Activity timeline (last 10 events)
  const recentActivity = useMemo(() => {
    const events: { time: string; type: string; detail: string }[] = [];
    profiles.forEach(p => {
      if (p.created_at) {
        events.push({
          time: p.created_at,
          type: "signup",
          detail: `${p.full_name || p.email} signed up`,
        });
      }
    });
    applications.forEach(a => {
      if (a.created_at) {
        events.push({
          time: a.created_at,
          type: "application",
          detail: `${a.full_name || "User"} started application${a.state_name ? ` in ${a.state_name}` : ""}`,
        });
      }
    });
    return events
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 15);
  }, [profiles, applications]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total revenue" value={`$${totalRevenue}`} icon="💰" trend={totalRevenue > 0 ? "up" : undefined} />
        <StatCard label="Paid users" value={paidUsers.toString()} icon="✅" />
        <StatCard label="Avg. per user" value={`$${avgPerUser}`} icon="📊" />
        <StatCard label="Refunds" value="$0" icon="↩️" />
      </div>

      {/* Revenue charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Daily Revenue" subtitle="Revenue per day ($49 per sale)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueByDay} margin={{ left: 0, right: 10, top: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} formatter={(v: number) => [`$${v}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Cumulative Revenue" subtitle="Total revenue growth over time">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueByDay} margin={{ left: 0, right: 10, top: 5 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(150, 60%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(150, 60%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} formatter={(v: number) => [`$${v}`, "Cumulative"]} />
              <Area type="monotone" dataKey="cumulative" stroke="hsl(150, 60%, 45%)" fill="url(#revenueGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Plan breakdown + Activity timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Users by Plan" subtitle="Distribution across tiers">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={planData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                {planData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Activity Timeline */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-1">Recent Activity</h3>
          <p className="text-xs text-muted-foreground mb-4">Latest signups and applications</p>
          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
            ) : (
              recentActivity.map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    event.type === "signup" ? "bg-primary" : "bg-blue-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{event.detail}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.time).toLocaleString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                    event.type === "signup" ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}>
                    {event.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
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
      const headers = ["id", "email", "full_name", "plan", "country_code", "created_at"];
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
          Payment integration settings will appear here once connected. Price changes and webhook configuration will be manageable from this panel.
        </p>
      </div>
    </div>
  );
};

/* ── Shared components ── */
const StatCard = ({ label, value, icon, trend }: { label: string; value: string; icon?: string; trend?: "up" | "down" }) => (
  <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
      {icon && <span className="text-lg">{icon}</span>}
    </div>
    <div className="text-2xl font-extrabold mt-1 flex items-center gap-2">
      {value}
      {trend === "up" && <span className="text-xs text-green-500 font-semibold">↑</span>}
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-2xl p-5">
    <h3 className="font-bold text-sm mb-0.5">{title}</h3>
    <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>
    {children}
  </div>
);

export default Admin;
