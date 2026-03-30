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

/* ── Promo Codes Tab ── */
interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  affiliate_name: string | null;
  affiliate_email: string | null;
  affiliate_notes: string | null;
  affiliate_source: string | null;
  affiliate_location: string | null;
  affiliate_commission_percent: number;
  is_active: boolean;
  max_uses: number | null;
  times_used: number;
  created_at: string;
}

const PromosTab = () => {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("10");
  const [newAffiliate, setNewAffiliate] = useState("");
  const [newAffiliateEmail, setNewAffiliateEmail] = useState("");
  const [newCommission, setNewCommission] = useState("20");
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [expandedAffiliate, setExpandedAffiliate] = useState<string | null>(null);
  const [editingAffiliate, setEditingAffiliate] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCommission, setEditCommission] = useState("");
  const [confirmDeleteAffiliate, setConfirmDeleteAffiliate] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [promosRes, appsRes] = await Promise.all([
      supabase.from("promo_codes").select("*").order("created_at", { ascending: false }),
      supabase.from("applications").select("promo_code, final_price, discount_amount, status, created_at, full_name, email").not("promo_code", "is", null),
    ]);
    if (promosRes.data) setPromos(promosRes.data as PromoCode[]);
    if (appsRes.data) setApplications(appsRes.data);
    setLoading(false);
  };

  const addPromo = async () => {
    if (!newCode.trim()) return;
    setAdding(true);
    await supabase.from("promo_codes").insert({
      code: newCode.trim().toUpperCase(),
      discount_percent: parseInt(newDiscount) || 10,
      affiliate_name: newAffiliate.trim() || null,
      affiliate_email: newAffiliateEmail.trim() || null,
      affiliate_commission_percent: parseInt(newCommission) || 20,
    } as any);
    setNewCode("");
    setNewAffiliate("");
    setNewAffiliateEmail("");
    setNewDiscount("10");
    setNewCommission("20");
    setAdding(false);
    loadData();
  };

  const toggleActive = async (id: string, currentlyActive: boolean) => {
    await supabase.from("promo_codes").update({ is_active: !currentlyActive }).eq("id", id);
    loadData();
  };

  const deletePromo = async (id: string) => {
    await supabase.from("promo_codes").delete().eq("id", id);
    setConfirmDelete(null);
    loadData();
  };

  const updateAffiliate = async (promoId: string) => {
    await supabase.from("promo_codes").update({
      affiliate_name: editName.trim() || null,
      affiliate_email: editEmail.trim() || null,
      affiliate_commission_percent: parseInt(editCommission) || 20,
    } as any).eq("id", promoId);
    setEditingAffiliate(null);
    loadData();
  };

  const removeAffiliate = async (promoId: string) => {
    await supabase.from("promo_codes").update({
      affiliate_name: null,
      affiliate_email: null,
      affiliate_commission_percent: 0,
    } as any).eq("id", promoId);
    setConfirmDeleteAffiliate(null);
    loadData();
  };

  // Build affiliate performance from real application data
  const affiliateData = useMemo(() => {
    const data: Record<string, {
      promoId: string;
      name: string;
      email: string | null;
      code: string;
      discount: number;
      commission: number;
      uses: number;
      totalRevenue: number;
      commissionOwed: number;
      conversions: any[];
    }> = {};

    promos.forEach(p => {
      if (!p.affiliate_name) return;
      const matchingApps = applications.filter(a => a.promo_code?.toUpperCase() === p.code.toUpperCase());
      const totalRevenue = matchingApps.reduce((sum, a) => sum + (Number(a.final_price) || 0), 0);
      const commissionOwed = totalRevenue * (p.affiliate_commission_percent / 100);

      const existing = data[p.affiliate_name];
      if (existing) {
        existing.uses += matchingApps.length;
        existing.totalRevenue += totalRevenue;
        existing.commissionOwed += commissionOwed;
        existing.conversions.push(...matchingApps);
      } else {
        data[p.affiliate_name] = {
          promoId: p.id,
          name: p.affiliate_name,
          email: p.affiliate_email,
          code: p.code,
          discount: p.discount_percent,
          commission: p.affiliate_commission_percent,
          uses: matchingApps.length,
          totalRevenue,
          commissionOwed,
          conversions: matchingApps,
        };
      }
    });

    return Object.values(data);
  }, [promos, applications]);

  return (
    <div className="space-y-6">
      {/* Add new promo */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-4">Create promo code</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Code</label>
            <input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="BRAZILIANGRINGO"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Discount %</label>
            <input
              value={newDiscount}
              onChange={(e) => setNewDiscount(e.target.value)}
              placeholder="10"
              type="number"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Affiliate name</label>
            <input
              value={newAffiliate}
              onChange={(e) => setNewAffiliate(e.target.value)}
              placeholder="Brazilian Gringo"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Affiliate email</label>
            <input
              value={newAffiliateEmail}
              onChange={(e) => setNewAffiliateEmail(e.target.value)}
              placeholder="gringo@email.com"
              type="email"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Commission %</label>
            <input
              value={newCommission}
              onChange={(e) => setNewCommission(e.target.value)}
              placeholder="20"
              type="number"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <button
          onClick={addPromo}
          disabled={adding || !newCode.trim()}
          className="mt-4 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add promo code"}
        </button>
      </div>

      {/* Existing promos */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-4">All promo codes</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
        ) : promos.length === 0 ? (
          <p className="text-sm text-muted-foreground">No promo codes yet. Create one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Uses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono font-bold text-primary">{p.code}</TableCell>
                    <TableCell>{p.discount_percent}% off</TableCell>
                    <TableCell>{p.affiliate_name || "None"}</TableCell>
                    <TableCell>{p.affiliate_commission_percent}%</TableCell>
                    <TableCell>{p.times_used}{p.max_uses ? ` / ${p.max_uses}` : ""}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {p.is_active ? "Active" : "Disabled"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleActive(p.id, p.is_active)}
                          className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {p.is_active ? "Disable" : "Enable"}
                        </button>
                        {confirmDelete === p.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => deletePromo(p.id)}
                              className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(p.id)}
                            className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Affiliate performance */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-1">Affiliate performance</h2>
        <p className="text-xs text-muted-foreground mb-4">Revenue and commission based on actual paid applications</p>
        {affiliateData.length === 0 ? (
          <p className="text-sm text-muted-foreground">No affiliates yet. Add an affiliate name when creating a promo code.</p>
        ) : (
          <div className="space-y-4">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-secondary rounded-xl p-4">
                <div className="text-xs text-muted-foreground font-semibold mb-1">Total affiliates</div>
                <div className="text-2xl font-extrabold">{affiliateData.length}</div>
              </div>
              <div className="bg-secondary rounded-xl p-4">
                <div className="text-xs text-muted-foreground font-semibold mb-1">Total affiliate revenue</div>
                <div className="text-2xl font-extrabold">${affiliateData.reduce((s, a) => s + a.totalRevenue, 0).toFixed(2)}</div>
              </div>
              <div className="bg-secondary rounded-xl p-4">
                <div className="text-xs text-muted-foreground font-semibold mb-1">Total commission owed</div>
                <div className="text-2xl font-extrabold text-primary">${affiliateData.reduce((s, a) => s + a.commissionOwed, 0).toFixed(2)}</div>
              </div>
            </div>

            {/* Per-affiliate breakdown */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Owed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliateData.map((a) => (
                    <>
                      <TableRow key={a.name}>
                        {editingAffiliate === a.promoId ? (
                          <>
                            <TableCell>
                              <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Name"
                                className="bg-secondary border border-border rounded-lg px-2 py-1.5 text-sm w-full min-w-[120px] focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                placeholder="email@example.com"
                                type="email"
                                className="bg-secondary border border-border rounded-lg px-2 py-1.5 text-sm w-full min-w-[160px] focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </TableCell>
                            <TableCell className="font-mono text-primary">{a.code}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <input
                                  value={editCommission}
                                  onChange={(e) => setEditCommission(e.target.value)}
                                  type="number"
                                  className="bg-secondary border border-border rounded-lg px-2 py-1.5 text-sm w-16 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <span className="text-sm text-muted-foreground">%</span>
                              </div>
                            </TableCell>
                            <TableCell>{a.uses}</TableCell>
                            <TableCell>${a.totalRevenue.toFixed(2)}</TableCell>
                            <TableCell className="font-bold text-primary">${a.commissionOwed.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => updateAffiliate(a.promoId)} className="text-xs font-bold text-primary hover:opacity-80">Save</button>
                                <button onClick={() => setEditingAffiliate(null)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="font-semibold">{a.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{a.email || "No email"}</TableCell>
                            <TableCell className="font-mono text-primary">{a.code}</TableCell>
                            <TableCell>{a.commission}%</TableCell>
                            <TableCell>{a.uses}</TableCell>
                            <TableCell>${a.totalRevenue.toFixed(2)}</TableCell>
                            <TableCell className="font-bold text-primary">${a.commissionOwed.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-3">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setExpandedAffiliate(expandedAffiliate === a.name ? null : a.name); }}
                                  className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                  {a.conversions.length > 0 ? (expandedAffiliate === a.name ? "Hide ▲" : `View ▼`) : "No data"}
                                </button>
                                <button
                                  onClick={() => { setEditingAffiliate(a.promoId); setEditName(a.name); setEditEmail(a.email || ""); setEditCommission(String(a.commission)); }}
                                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                                >
                                  Edit
                                </button>
                                {confirmDeleteAffiliate === a.promoId ? (
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => removeAffiliate(a.promoId)} className="text-xs font-bold text-red-600 hover:text-red-700">Remove</button>
                                    <button onClick={() => setConfirmDeleteAffiliate(null)} className="text-xs text-muted-foreground">Cancel</button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmDeleteAffiliate(a.promoId)}
                                    className="text-xs font-semibold text-red-500 hover:text-red-600"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                      {expandedAffiliate === a.name && a.conversions.length > 0 && (
                        <TableRow key={`${a.name}-detail`}>
                          <TableCell colSpan={9} className="bg-secondary/30 p-0">
                            <div className="p-5">
                              <p className="text-xs font-bold text-muted-foreground mb-3">Conversions for {a.name}</p>
                              <div className="space-y-2">
                                {a.conversions.map((c: any, i: number) => (
                                  <div key={i} className="flex flex-wrap items-center gap-4 text-xs bg-card rounded-lg px-4 py-3 border border-border">
                                    <span className="font-semibold min-w-[120px]">{c.full_name || c.email || "Unknown"}</span>
                                    <span className="text-muted-foreground">{c.email}</span>
                                    <span className="text-primary font-bold">${Number(c.final_price || 0).toFixed(2)}</span>
                                    <span className="text-muted-foreground">saved ${Number(c.discount_amount || 0).toFixed(2)}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      c.status === "paid" || c.status === "completed" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                    }`}>{c.status}</span>
                                    <span className="text-muted-foreground ml-auto">{c.created_at ? new Date(c.created_at).toLocaleDateString() : ""}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
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
