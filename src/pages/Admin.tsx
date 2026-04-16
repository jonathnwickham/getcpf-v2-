import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area,
} from "recharts";
import { maskPassport } from "@/lib/mask-passport";
import Logo from "@/components/Logo";
import { TableSkeleton } from "@/components/Skeleton";

const CHART_COLORS = ["#166534", "#3b82f6", "#3b7dd8", "#22c55e", "#ec4899", "#f59e0b", "#a855f7", "#06b6d4"];

type AdminTab = "users" | "applications" | "revenue" | "promos" | "affiliates" | "partners" | "waitlist" | "settings";

const logAuditAction = async (userId: string, action: string, details?: string) => {
  await supabase.from("audit_log").insert({ user_id: userId, action, details } as any);
};

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
  state_code: string | null;
  city: string | null;
  status: string | null;
  created_at: string | null;
  submitted_at: string | null;
  passport_number: string | null;
  street_address: string | null;
  mother_name: string | null;
  father_name: string | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [tab, setTab] = useState<AdminTab>("users");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    loadData();
  }, [user, authLoading]);

  const loadData = async () => {
    const [profilesRes, appsRes] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name, country_code, plan, created_at, stripe_customer_id"),
      supabase.from("applications").select("id, user_id, full_name, email, nationality, state_name, state_code, city, status, created_at, submitted_at, passport_number, street_address, mother_name, father_name, cpf_number, protocol_number, promo_code, final_price, discount_amount"),
    ]);
    if (profilesRes.data) setProfiles(profilesRes.data);
    if (appsRes.data) setApplications(appsRes.data);
    setDataLoaded(true);
  };

  if (authLoading || !dataLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="border-b border-gray-100 bg-white h-14" />
        <div className="flex flex-1">
          <aside className="hidden md:block w-60 shrink-0 bg-white border-r border-gray-100" />
          <main className="flex-1 px-6 py-6 max-w-[1200px]">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <TableSkeleton rows={8} cols={6} />
            </div>
          </main>
        </div>
      </div>
    );
  }

  const navItems: { key: AdminTab; label: string; desc: string }[] = [
    { key: "users", label: "Users", desc: "Accounts, signups, data retention" },
    { key: "applications", label: "Applications", desc: "CPF applications and status" },
    { key: "revenue", label: "Revenue", desc: "Payments, refunds, transactions" },
    { key: "promos", label: "Promo Codes", desc: "Discounts and redemptions" },
    { key: "affiliates", label: "Affiliates", desc: "Partner commissions and tracking" },
    { key: "partners", label: "Partners", desc: "Affiliate applications to review" },
    { key: "waitlist", label: "Waitlist", desc: "Concierge and Full Assist signups" },
    { key: "settings", label: "Settings", desc: "Audit log and data exports" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top header */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="px-5 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/">
              <Logo className="h-8" />
            </a>
            <span className="text-gray-200">|</span>
            <h1 className="text-sm font-semibold text-gray-900">Admin</h1>
          </div>
          <button onClick={signOut} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Sign out
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — desktop */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 bg-white border-r border-gray-100 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <nav role="navigation" aria-label="Admin sections" className="p-3 space-y-0.5">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                aria-current={tab === item.key ? "page" : undefined}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors outline-none ${
                  tab === item.key
                    ? "bg-gray-100 text-gray-900 border-l-2 border-green-800"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent"
                }`}
              >
                <div className="text-sm font-medium">{item.label}</div>
                <div className={`text-[11px] mt-0.5 ${tab === item.key ? "text-gray-500" : "text-gray-400"}`}>{item.desc}</div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile nav — horizontal scroll */}
        <div className="md:hidden w-full border-b border-gray-100 bg-white overflow-x-auto">
          <div className="flex gap-0.5 p-2 whitespace-nowrap">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors shrink-0 ${
                  tab === item.key
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto px-6 py-6">
            {tab === "users" && <UsersTab profiles={profiles} applications={applications} search={search} setSearch={setSearch} onRefresh={loadData} />}
            {tab === "applications" && <ApplicationsTab applications={applications} profiles={profiles} onRefresh={loadData} adminUserId={user?.id || ""} />}
            {tab === "revenue" && <RevenueTab profiles={profiles} applications={applications} userId={user?.id || ""} />}
            {tab === "promos" && <PromosTab />}
            {tab === "affiliates" && <AffiliatesTab />}
            {tab === "partners" && <PartnersTab userId={user?.id || ""} />}
            {tab === "waitlist" && <WaitlistTab />}
            {tab === "settings" && <SettingsTab userId={user?.id || ""} />}
          </div>
        </main>
      </div>
    </div>
  );
};

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

const getDataStatus = (profile: Profile, applications: Application[] = []): "Active" | "Due for deletion" | "Retained" => {
  if (!profile.created_at) return "Active";
  const age = Date.now() - new Date(profile.created_at).getTime();
  // Paying customers are never flagged for deletion
  const hasPaidApp = applications.some(
    a => a.user_id === profile.id && ["paid", "prepared", "office_visited", "cpf_issued"].includes(a.status || "")
  );
  if (hasPaidApp || profile.plan === "active_subscriber") return "Retained";
  if (age > NINETY_DAYS_MS) return "Due for deletion";
  return "Active";
};

const anonymizeUser = async (userId: string, onRefresh: () => void) => {
  await supabase.from("applications").delete().eq("user_id", userId);
  await supabase.from("profiles").update({
    full_name: null,
    email: `deleted-${userId.slice(0, 8)}@deleted.getcpf.com`,
    country_code: null,
    location: null,
  }).eq("id", userId);
  onRefresh();
};

/* ── Users Tab ── */
const UsersTab = ({ profiles, applications, search, setSearch, onRefresh }: {
  profiles: Profile[];
  applications: Application[];
  search: string;
  setSearch: (v: string) => void;
  onRefresh: () => void;
}) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedForBulk, setSelectedForBulk] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "free">("all");
  const [revealedPassports, setRevealedPassports] = useState<Set<string>>(new Set());
  const totalUsers = profiles.length;
  const paidUsers = profiles.filter(p => p.plan && p.plan !== "free").length;
  const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : "0";
  const usersWithApps = new Set(applications.map(a => a.user_id)).size;

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 50;

  const filtered = profiles.filter(p => {
    const matchesSearch = !search ||
      (p.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "paid" && p.plan && p.plan !== "free") ||
      (statusFilter === "free" && (!p.plan || p.plan === "free"));
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedUsers = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset page when search/filter changes
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter]);

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
      const app = applications.find(a => a.user_id === p.id);
      const nat = app?.nationality || p.country_code || "Not onboarded";
      map.set(nat, (map.get(nat) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, [profiles, applications]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Users</h2>
        <p className="text-sm text-gray-500 mt-1">Everyone who signed up. View profiles, check payment status, and manage data retention.</p>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total users" value={totalUsers.toString()} />
        <StatCard label="Paid users" value={paidUsers.toString()} />
        <StatCard label="Conversion" value={`${conversionRate}%`} trend={parseFloat(conversionRate) > 0 ? "up" : undefined} />
        <StatCard label="Started app" value={usersWithApps.toString()} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="User Funnel" subtitle="Signup → Application → Paid">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={funnelData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis dataKey="stage" type="category" width={90} tick={{ fontSize: 12, fill: "#6b7280" }} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #f3f4f6", borderRadius: "12px", fontSize: "12px" }} />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {funnelData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Signups Over Time" subtitle="Daily new users">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={signupsByDay} margin={{ left: 0, right: 10, top: 5 }}>
              <defs>
                <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #f3f4f6", borderRadius: "12px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="signups" stroke="#166534" fill="url(#signupGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="By Nationality" subtitle="Top 8 countries">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={nationalityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2}>
                {nationalityData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #f3f4f6", borderRadius: "12px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Search + filters + Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full md:w-80 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 transition-all placeholder:text-gray-400"
            />
            {(() => {
              const dueForDeletion = filtered.filter(p => getDataStatus(p, applications) === "Due for deletion");
              if (dueForDeletion.length === 0) return null;
              return (
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setSelectedForBulk(new Set(dueForDeletion.map(p => p.id)))}
                    className="text-xs font-medium text-red-600 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Select all due for deletion ({dueForDeletion.length})
                  </button>
                  {selectedForBulk.size > 0 && (
                    <button
                      onClick={async () => {
                        if (!confirm(`Anonymize ${selectedForBulk.size} user(s)? This cannot be undone.`)) return;
                        for (const uid of selectedForBulk) {
                          await anonymizeUser(uid, () => {});
                        }
                        setSelectedForBulk(new Set());
                        onRefresh();
                      }}
                      className="text-xs font-medium text-white bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600 transition-all"
                    >
                      Delete selected ({selectedForBulk.size})
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
          {/* Filter pills */}
          <div className="flex gap-2">
            {(["all", "paid", "free"] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === f
                    ? "bg-green-800 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f === "all" ? "All" : f === "paid" ? "Paid" : "Free"}
              </button>
            ))}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium py-3">Name</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Email</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Nationality</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Plan</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Data status</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Signed up</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map(p => {
              const userApp = applications.find(a => a.user_id === p.id);
              const nat = userApp?.nationality || p.country_code || "—";
              const displayName = p.full_name || userApp?.full_name || "—";
              const dataStatus = getDataStatus(p, applications);
              return (
                <TableRow
                  key={p.id}
                  className="cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                  onClick={() => setSelectedUser(p.id)}
                >
                  <TableCell className="font-medium py-3.5">{displayName}</TableCell>
                  <TableCell className="text-sm text-gray-500 py-3.5">{p.email}</TableCell>
                  <TableCell className="text-sm py-3.5">{nat}</TableCell>
                  <TableCell className="py-3.5">
                    <StatusBadge
                      label={(p.plan || "free").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                      variant={p.plan && p.plan !== "free" ? "green" : "gray"}
                    />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <StatusBadge
                      label={dataStatus}
                      variant={
                        dataStatus === "Active" ? "green" :
                        dataStatus === "Due for deletion" ? "red" :
                        "gray"
                      }
                    />
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 py-3.5">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="py-3.5">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!confirm(`Delete user data for ${p.email}? This anonymizes their profile and removes application data. Consent log is retained.`)) return;
                        await anonymizeUser(p.id, onRefresh);
                      }}
                      className="text-xs text-gray-400 hover:text-red-600 font-medium px-2 py-1 rounded transition-colors whitespace-nowrap"
                    >
                      Delete data
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
            {paginatedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="text-gray-400 text-sm">No results found</div>
                  <div className="text-gray-300 text-xs mt-1">Try adjusting your search or filters</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <TablePagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} />
        )}
      </div>

      {/* User drill-down dialog */}
      {(() => {
        const userProfile = profiles.find(p => p.id === selectedUser);
        const userApps = applications.filter(a => a.user_id === selectedUser);
        if (!userProfile) return null;
        return (
          <Dialog open={!!selectedUser} onOpenChange={(open) => { if (!open) setSelectedUser(null); }}>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">{userProfile.full_name || userProfile.email}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-xs text-gray-500 font-medium mb-0.5">Email</div><div>{userProfile.email}</div></div>
                  <div><div className="text-xs text-gray-500 font-medium mb-0.5">Plan</div><div className="capitalize">{(userProfile.plan || "free").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</div></div>
                  <div><div className="text-xs text-gray-500 font-medium mb-0.5">Signed up</div><div>{userProfile.created_at ? new Date(userProfile.created_at).toLocaleDateString() : "—"}</div></div>
                  <div><div className="text-xs text-gray-500 font-medium mb-0.5">Country</div><div>{userProfile.country_code || "—"}</div></div>
                </div>

                {userApps.length > 0 ? userApps.map(app => (
                  <div key={app.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">Application</h4>
                      <StatusBadge
                        label={app.status || "draft"}
                        variant={
                          app.status === "prepared" || app.status === "cpf_issued" ? "green" :
                          app.status === "paid" ? "blue" :
                          app.status === "rejected" ? "red" :
                          "gray"
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-xs text-gray-500">Name:</span> {app.full_name || "—"}</div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Passport:</span>
                        <span>{revealedPassports.has(app.id) ? (app.passport_number || "—") : maskPassport(app.passport_number)}</span>
                        {app.passport_number && (
                          <button
                            onClick={() => setRevealedPassports(prev => {
                              const next = new Set(prev);
                              if (next.has(app.id)) next.delete(app.id);
                              else next.add(app.id);
                              return next;
                            })}
                            className="text-gray-400 hover:text-gray-900 text-xs ml-0.5"
                            title={revealedPassports.has(app.id) ? "Hide" : "Reveal"}
                          >
                            {revealedPassports.has(app.id) ? "hide" : "show"}
                          </button>
                        )}
                      </div>
                      <div><span className="text-xs text-gray-500">Nationality:</span> {app.nationality || "—"}</div>
                      <div><span className="text-xs text-gray-500">State:</span> {app.state_name || "—"}</div>
                      <div><span className="text-xs text-gray-500">City:</span> {app.city || "—"}</div>
                      <div><span className="text-xs text-gray-500">Address:</span> {app.street_address || "—"}</div>
                      <div><span className="text-xs text-gray-500">Mother:</span> {app.mother_name || "—"}</div>
                      <div><span className="text-xs text-gray-500">Father:</span> {app.father_name || "—"}</div>
                      <div><span className="text-xs text-gray-500">Email:</span> {app.email || "—"}</div>
                      <div><span className="text-xs text-gray-500">Created:</span> {app.created_at ? new Date(app.created_at).toLocaleDateString() : "—"}</div>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">No application yet</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
};

/* ── Applications Tab ── */
const APP_STATUSES = ["draft", "paid", "prepared", "office_visited", "cpf_issued", "rejected"] as const;
const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-50 text-gray-500",
  paid: "bg-blue-100 text-blue-700",
  prepared: "bg-green-100 text-green-700",
  office_visited: "bg-yellow-100 text-yellow-700",
  cpf_issued: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};
const STATUS_LABELS: Record<string, string> = {
  draft: "Draft", paid: "Paid", prepared: "Prepared",
  office_visited: "Office Visited", cpf_issued: "CPF Issued", rejected: "Rejected",
};

const ApplicationsTab = ({ applications, profiles, onRefresh, adminUserId }: { applications: Application[]; profiles: Profile[]; onRefresh: () => void; adminUserId: string }) => {
  const [appPage, setAppPage] = useState(1);
  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState<string>("all");
  const APP_PAGE_SIZE = 50;

  const profileMap = new Map(profiles.map(p => [p.id, p]));
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateStatus = async (appId: string, newStatus: string) => {
    setUpdatingId(appId);
    const { data, error } = await supabase.rpc("transition_application_status" as any, {
      _application_id: appId,
      _new_status: newStatus,
    });
    if (error) {
      console.error("Status update failed:", error);
      setUpdatingId(null);
      return;
    }
    // Log the status change
    const app = applications.find(a => a.id === appId);
    await logAuditAction(adminUserId, "application_status_changed", `Application ${appId} (${app?.full_name || app?.email || "unknown"}) → ${newStatus}`);

    // If marking as cpf_issued, send notification email to user
    if (newStatus === "cpf_issued") {
      const profile = profileMap.get(app?.user_id || "");
      const recipientEmail = app?.email || profile?.email;
      if (recipientEmail) {
        try {
          await supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "purchase-confirmation",
              recipientEmail,
              idempotencyKey: `cpf-issued-${appId}`,
              templateData: { name: app?.full_name || profile?.full_name || "there" },
            },
          });
        } catch (emailErr) {
          console.error("CPF issued email error:", emailErr);
        }
      }
    }
    setUpdatingId(null);
    onRefresh();
  };

  // State breakdown data (kept for potential future use)
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

  const filteredApps = applications.filter(a => {
    const profile = profileMap.get(a.user_id);
    const matchesSearch = !appSearch ||
      (a.full_name || "").toLowerCase().includes(appSearch.toLowerCase()) ||
      (a.email || "").toLowerCase().includes(appSearch.toLowerCase()) ||
      (profile?.email || "").toLowerCase().includes(appSearch.toLowerCase());
    const matchesStatus = appStatusFilter === "all" || a.status === appStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAppPages = Math.max(1, Math.ceil(filteredApps.length / APP_PAGE_SIZE));
  const paginatedApps = filteredApps.slice((appPage - 1) * APP_PAGE_SIZE, appPage * APP_PAGE_SIZE);

  useEffect(() => { setAppPage(1); }, [appSearch, appStatusFilter]);

  const paidApps = applications.filter(a => a.status && a.status !== "draft").length;
  const cpfIssuedCount = applications.filter(a => a.status === "cpf_issued").length;
  const draftCount = applications.filter(a => !a.status || a.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
        <p className="text-sm text-gray-500 mt-1">Track every CPF application from draft to issued. Change statuses, filter by stage, and monitor progress.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total apps" value={applications.length.toString()} sub={draftCount > 0 ? `${draftCount} still in draft` : undefined} />
        <StatCard label="Paid / active" value={paidApps.toString()} />
        <StatCard label="CPF issued" value={cpfIssuedCount.toString()} />
        <StatCard label="Unique states" value={new Set(applications.map(a => a.state_name).filter(Boolean)).size.toString()} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 space-y-3">
          <input
            type="text"
            value={appSearch}
            onChange={(e) => setAppSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full md:w-80 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 transition-all placeholder:text-gray-400"
          />
          {/* Status filter pills */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setAppStatusFilter("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${appStatusFilter === "all" ? "bg-green-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              All
            </button>
            {APP_STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setAppStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${appStatusFilter === s ? "bg-green-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium py-3">Name</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Email</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Nationality</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">State</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">City</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Status</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApps.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="text-gray-400 text-sm">No results found</div>
                  <div className="text-gray-300 text-xs mt-1">Try adjusting your search or filters</div>
                </TableCell>
              </TableRow>
            )}
            {paginatedApps.map(a => {
              const profile = profileMap.get(a.user_id);
              return (
                <TableRow key={a.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <TableCell className="font-medium py-3.5">{a.full_name || profile?.full_name || "—"}</TableCell>
                  <TableCell className="text-sm text-gray-500 py-3.5">{a.email || profile?.email || "—"}</TableCell>
                  <TableCell className="text-sm py-3.5">{a.nationality || "—"}</TableCell>
                  <TableCell className="text-sm py-3.5">{a.state_name || "—"}</TableCell>
                  <TableCell className="text-sm py-3.5">{a.city || "—"}</TableCell>
                  <TableCell className="py-3.5">
                    <select
                      value={a.status || "draft"}
                      onChange={(e) => updateStatus(a.id, e.target.value)}
                      disabled={updatingId === a.id}
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full cursor-pointer border-0 outline-none ${STATUS_COLORS[a.status || "draft"] || STATUS_COLORS.draft}`}
                    >
                      {APP_STATUSES.map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 py-3.5">
                    {a.created_at ? new Date(a.created_at).toLocaleDateString() : "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {totalAppPages > 1 && (
          <TablePagination currentPage={appPage} totalPages={totalAppPages} totalItems={filteredApps.length} pageSize={APP_PAGE_SIZE} onPageChange={setAppPage} />
        )}
      </div>
    </div>
  );
};

/* ── Revenue Tab ── */
const RevenueTab = ({ profiles, applications, userId }: { profiles: Profile[]; applications: Application[]; userId: string }) => {
  const paidUsers = profiles.filter(p => p.plan && p.plan !== "free").length;
  const [manualEntries, setManualEntries] = useState<any[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<"revenue" | "refund">("revenue");
  const [entryForm, setEntryForm] = useState({ amount: "", user_email: "", transaction_id: "", notes: "", entry_date: new Date().toISOString().slice(0, 10) });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoadingEntries(true);
    const { data } = await supabase.from("revenue_entries").select("*").order("entry_date", { ascending: false });
    if (data) setManualEntries(data);
    setLoadingEntries(false);
  };

  const saveEntry = async () => {
    if (!entryForm.amount) return;
    setSaving(true);
    await supabase.from("revenue_entries").insert({
      entry_type: formType,
      amount: parseFloat(entryForm.amount),
      user_email: entryForm.user_email.trim() || null,
      transaction_id: entryForm.transaction_id.trim() || null,
      notes: entryForm.notes.trim() || null,
      entry_date: entryForm.entry_date,
    } as any);
    await logAuditAction(userId, `Added ${formType}`, `$${entryForm.amount} - ${entryForm.user_email || "no email"}`);
    setEntryForm({ amount: "", user_email: "", transaction_id: "", notes: "", entry_date: new Date().toISOString().slice(0, 10) });
    setShowForm(false);
    setSaving(false);
    loadEntries();
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("revenue_entries").delete().eq("id", id);
    await logAuditAction(userId, "Deleted revenue entry", id);
    loadEntries();
  };

  const revenueEntries = manualEntries.filter(e => e.entry_type === "revenue");
  const refundEntries = manualEntries.filter(e => e.entry_type === "refund");
  const manualRevenue = revenueEntries.reduce((s: number, e: any) => s + Number(e.amount), 0);
  const totalRefunds = refundEntries.reduce((s: number, e: any) => s + Number(e.amount), 0);
  const estimatedRevenue = paidUsers * 49;
  const totalRevenue = estimatedRevenue + manualRevenue - totalRefunds;

  // Revenue over time (kept as data, no charts)
  const revenueByDay = useMemo(() => {
    const paidProfiles = profiles.filter(p => p.plan && p.plan !== "free" && p.created_at);
    const map = new Map<string, { revenue: number; refunds: number }>();
    paidProfiles.forEach(p => {
      const day = new Date(p.created_at!).toISOString().slice(0, 10);
      const existing = map.get(day) || { revenue: 0, refunds: 0 };
      existing.revenue += 49;
      map.set(day, existing);
    });
    manualEntries.forEach((e: any) => {
      const day = e.entry_date;
      const existing = map.get(day) || { revenue: 0, refunds: 0 };
      if (e.entry_type === "revenue") existing.revenue += Number(e.amount);
      else existing.refunds += Number(e.amount);
      map.set(day, existing);
    });
    let cumulative = 0;
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { revenue, refunds }]) => {
        cumulative += revenue - refunds;
        return {
          date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          revenue,
          refunds,
          cumulative,
        };
      });
  }, [profiles, manualEntries]);

  const recentActivity = useMemo(() => {
    const events: { time: string; type: string; detail: string }[] = [];
    profiles.forEach(p => {
      if (p.created_at) events.push({ time: p.created_at, type: "signup", detail: `${p.full_name || p.email} signed up` });
    });
    applications.forEach(a => {
      if (a.created_at) events.push({ time: a.created_at, type: "application", detail: `${a.full_name || "User"} started application${a.state_name ? ` in ${a.state_name}` : ""}` });
    });
    return events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 15);
  }, [profiles, applications]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Revenue</h2>
        <p className="text-sm text-gray-500 mt-1">Track payments, log manual transactions, and manage refunds.</p>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total revenue" value={`$${totalRevenue.toFixed(0)}`} trend={totalRevenue > 0 ? "up" : undefined} />
        <StatCard label="Estimated (auto)" value={`$${estimatedRevenue}`} />
        <StatCard label="Manual revenue" value={`$${manualRevenue.toFixed(0)}`} />
        <StatCard label="Refunds" value={`-$${totalRefunds.toFixed(0)}`} />
        <StatCard label="Paid users" value={paidUsers.toString()} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-sm mb-1 text-gray-900">Recent activity</h3>
        <p className="text-xs text-gray-500 mb-4">Latest signups and applications</p>
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No activity yet</p>
          ) : (
            recentActivity.map((event, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${event.type === "signup" ? "bg-green-500" : "bg-blue-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate text-gray-700">{event.detail}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(event.time).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${event.type === "signup" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                  {event.type}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Manual entry section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-base text-gray-900">Manual entries</h2>
            <p className="text-xs text-gray-500 mt-0.5">Add revenue or refund records manually</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setFormType("revenue"); setShowForm(true); }} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-900 transition-all">
              + Revenue
            </button>
            <button onClick={() => { setFormType("refund"); setShowForm(true); }} className="border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
              + Refund
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
            <h3 className="font-medium text-sm capitalize text-gray-900">{formType} entry</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Amount ($) *</label>
                <input type="number" value={entryForm.amount} onChange={e => setEntryForm(f => ({ ...f, amount: e.target.value }))} placeholder="49.00" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Date</label>
                <input type="date" value={entryForm.entry_date} onChange={e => setEntryForm(f => ({ ...f, entry_date: e.target.value }))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">User email</label>
                <input value={entryForm.user_email} onChange={e => setEntryForm(f => ({ ...f, user_email: e.target.value }))} placeholder="user@email.com" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Transaction ID</label>
                <input value={entryForm.transaction_id} onChange={e => setEntryForm(f => ({ ...f, transaction_id: e.target.value }))} placeholder="txn_..." className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Notes</label>
                <input value={entryForm.notes} onChange={e => setEntryForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional note..." className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={saveEntry} disabled={saving || !entryForm.amount} className="bg-green-800 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-900 disabled:opacity-50">{saving ? "Saving..." : `Add ${formType}`}</button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-500 hover:text-gray-900">Cancel</button>
            </div>
          </div>
        )}

        {loadingEntries ? (
          <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
        ) : manualEntries.length === 0 ? (
          <p className="text-sm text-gray-500">No manual entries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium py-3">Type</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Date</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Amount</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Email</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Transaction</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Notes</TableHead>
                  <TableHead className="text-right uppercase text-[11px] tracking-wider text-gray-400 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manualEntries.map((e: any) => (
                  <TableRow key={e.id} className="hover:bg-gray-50 border-b border-gray-100">
                    <TableCell className="py-3.5">
                      <StatusBadge
                        label={e.entry_type}
                        variant={e.entry_type === "revenue" ? "green" : "red"}
                      />
                    </TableCell>
                    <TableCell className="text-sm py-3.5">{new Date(e.entry_date).toLocaleDateString()}</TableCell>
                    <TableCell className={`font-medium py-3.5 ${e.entry_type === "refund" ? "text-red-600" : ""}`}>
                      {e.entry_type === "refund" ? "-" : ""}${Number(e.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 py-3.5">{e.user_email || "—"}</TableCell>
                    <TableCell className="text-xs font-mono text-gray-500 py-3.5">{e.transaction_id || "—"}</TableCell>
                    <TableCell className="text-sm text-gray-500 max-w-[200px] truncate py-3.5">{e.notes || "—"}</TableCell>
                    <TableCell className="text-right py-3.5">
                      <button onClick={() => deleteEntry(e.id)} className="text-xs text-gray-400 hover:text-red-600 font-medium transition-colors">Delete</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Fanbasis Payments */}
      <FanbasisPayments />
    </div>
  );
};

/* ── Fanbasis Payments Section ── */
const FanbasisPayments = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("checkout_sessions").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setSessions(data);
      setLoading(false);
    });
  }, []);

  const paidSessions = sessions.filter(s => s.paid);
  const pendingSessions = sessions.filter(s => !s.paid);
  const totalFromFanbasis = paidSessions.reduce((sum, s) => sum + (s.amount_cents ? s.amount_cents / 100 : 0), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base text-gray-900">Fanbasis Payments</h3>
          <p className="text-xs text-gray-500 mt-0.5">Live payment data from checkout sessions</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500">{paidSessions.length} paid</span>
          {pendingSessions.length > 0 && <span className="text-xs font-medium text-yellow-600">{pendingSessions.length} pending</span>}
          {totalFromFanbasis > 0 && <span className="text-sm font-semibold text-green-800">${totalFromFanbasis.toFixed(2)}</span>}
        </div>
      </div>
      {loading ? (
        <div className="p-6 text-sm text-gray-500 animate-pulse">Loading payment data...</div>
      ) : sessions.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">No checkout sessions yet</p>
          <p className="text-xs text-gray-400 mt-1">Payments will appear here when customers go through checkout</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium py-3">Email</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Status</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Amount</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Payment ID</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Paid at</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((s: any) => (
              <TableRow key={s.id} className="hover:bg-gray-50 border-b border-gray-100">
                <TableCell className="text-sm py-3.5 font-medium">{s.email}</TableCell>
                <TableCell className="py-3.5">
                  <StatusBadge label={s.paid ? "Paid" : "Pending"} variant={s.paid ? "green" : "yellow"} />
                </TableCell>
                <TableCell className="text-sm py-3.5 font-medium">
                  {s.amount_cents ? `$${(s.amount_cents / 100).toFixed(2)}` : "—"} {s.currency || ""}
                </TableCell>
                <TableCell className="text-xs font-mono text-gray-500 py-3.5">{s.payment_id || "—"}</TableCell>
                <TableCell className="text-sm text-gray-500 py-3.5">
                  {s.paid_at ? new Date(s.paid_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                </TableCell>
                <TableCell className="text-sm text-gray-500 py-3.5">
                  {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
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
  // Profile dialog
  const [profileOpen, setProfileOpen] = useState<string | null>(null);
  const [profileNotes, setProfileNotes] = useState("");
  const [profileSource, setProfileSource] = useState("");
  const [profileLocation, setProfileLocation] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

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

  const saveProfile = async (promoId: string) => {
    setProfileSaving(true);
    await supabase.from("promo_codes").update({
      affiliate_notes: profileNotes.trim() || null,
      affiliate_source: profileSource.trim() || null,
      affiliate_location: profileLocation.trim() || null,
    } as any).eq("id", promoId);
    setProfileSaving(false);
    loadData();
  };

  const openProfile = (a: typeof affiliateData[0]) => {
    setProfileOpen(a.promoId);
    setProfileNotes(a.notes || "");
    setProfileSource(a.source || "");
    setProfileLocation(a.location || "");
  };

  // Build affiliate performance from real application data
  const affiliateData = useMemo(() => {
    const data: Record<string, {
      promoId: string;
      name: string;
      email: string | null;
      notes: string | null;
      source: string | null;
      location: string | null;
      code: string;
      discount: number;
      commission: number;
      uses: number;
      totalRevenue: number;
      commissionOwed: number;
      conversions: any[];
      createdAt: string;
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
          notes: p.affiliate_notes,
          source: p.affiliate_source,
          location: p.affiliate_location,
          code: p.code,
          discount: p.discount_percent,
          commission: p.affiliate_commission_percent,
          uses: matchingApps.length,
          totalRevenue,
          commissionOwed,
          conversions: matchingApps,
          createdAt: p.created_at,
        };
      }
    });

    return Object.values(data);
  }, [promos, applications]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Promo Codes</h2>
        <p className="text-sm text-gray-500 mt-1">Create discount codes, track redemptions, and see which promos drive conversions.</p>
      </div>
      {/* Add new promo */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-base text-gray-900 mb-4">Create promo code</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Code</label>
            <input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="BRAZILIANGRINGO"
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Discount %</label>
            <input
              value={newDiscount}
              onChange={(e) => setNewDiscount(e.target.value)}
              placeholder="10"
              type="number"
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Affiliate name</label>
            <input
              value={newAffiliate}
              onChange={(e) => setNewAffiliate(e.target.value)}
              placeholder="Brazilian Gringo"
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Affiliate email</label>
            <input
              value={newAffiliateEmail}
              onChange={(e) => setNewAffiliateEmail(e.target.value)}
              placeholder="gringo@email.com"
              type="email"
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Commission %</label>
            <input
              value={newCommission}
              onChange={(e) => setNewCommission(e.target.value)}
              placeholder="20"
              type="number"
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
        </div>
        <button
          onClick={addPromo}
          disabled={adding || !newCode.trim()}
          className="mt-4 bg-green-800 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-green-900 transition-all disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add promo code"}
        </button>
      </div>

      {/* Existing promos */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-base text-gray-900 mb-4">All promo codes</h2>
        {loading ? (
          <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
        ) : promos.length === 0 ? (
          <p className="text-sm text-gray-500">No promo codes yet. Create one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium py-3">Code</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Discount</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Affiliate</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Commission</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Uses</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-right uppercase text-[11px] tracking-wider text-gray-400 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promos.map((p) => (
                  <TableRow key={p.id} className="hover:bg-gray-50 border-b border-gray-100">
                    <TableCell className="font-mono font-medium text-gray-900 py-3.5">{p.code}</TableCell>
                    <TableCell className="py-3.5">{p.discount_percent}% off</TableCell>
                    <TableCell className="py-3.5">{p.affiliate_name || <span className="text-gray-400">None</span>}</TableCell>
                    <TableCell className="py-3.5">{p.affiliate_commission_percent}%</TableCell>
                    <TableCell className="py-3.5">{p.times_used}{p.max_uses ? ` / ${p.max_uses}` : ""}</TableCell>
                    <TableCell className="py-3.5">
                      <StatusBadge
                        label={p.is_active ? "Active" : "Disabled"}
                        variant={p.is_active ? "green" : "gray"}
                      />
                    </TableCell>
                    <TableCell className="text-right py-3.5">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => toggleActive(p.id, p.is_active)}
                          className="text-xs text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          {p.is_active ? "Disable" : "Enable"}
                        </button>
                        {confirmDelete === p.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => deletePromo(p.id)} className="text-xs text-red-600 hover:text-red-700 transition-colors">Confirm</button>
                            <button onClick={() => setConfirmDelete(null)} className="text-xs text-gray-400 hover:text-gray-900 transition-colors">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(p.id)} className="text-xs text-gray-400 hover:text-red-600 transition-colors">Delete</button>
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
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-base text-gray-900 mb-1">Affiliate performance</h2>
        <p className="text-xs text-gray-500 mb-4">Revenue and commission based on actual paid applications</p>
        {affiliateData.length === 0 ? (
          <p className="text-sm text-gray-500">No affiliates yet. Add an affiliate name when creating a promo code.</p>
        ) : (
          <div className="space-y-4">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 font-medium mb-1">Total affiliates</div>
                <div className="text-2xl font-medium">{affiliateData.length}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 font-medium mb-1">Total affiliate revenue</div>
                <div className="text-2xl font-medium">${affiliateData.reduce((s, a) => s + a.totalRevenue, 0).toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 font-medium mb-1">Total commission owed</div>
                <div className="text-2xl font-medium text-green-700">${affiliateData.reduce((s, a) => s + a.commissionOwed, 0).toFixed(2)}</div>
              </div>
            </div>

            {/* Per-affiliate breakdown */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium py-3">Affiliate</TableHead>
                    <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Email</TableHead>
                    <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Code</TableHead>
                    <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Commission</TableHead>
                    <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Conversions</TableHead>
                    <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Revenue</TableHead>
                    <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Owed</TableHead>
                    <TableHead className="text-right uppercase text-[11px] tracking-wider text-gray-400 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliateData.map((a) => (
                    <>
                      <TableRow key={a.name} className="hover:bg-gray-50 border-b border-gray-100">
                        {editingAffiliate === a.promoId ? (
                          <>
                            <TableCell className="py-3.5">
                              <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Name"
                                className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full min-w-[120px] focus:outline-none focus:ring-1 focus:ring-gray-300"
                              />
                            </TableCell>
                            <TableCell className="py-3.5">
                              <input
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                placeholder="email@example.com"
                                type="email"
                                className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full min-w-[160px] focus:outline-none focus:ring-1 focus:ring-gray-300"
                              />
                            </TableCell>
                            <TableCell className="font-mono text-gray-700 py-3.5">{a.code}</TableCell>
                            <TableCell className="py-3.5">
                              <div className="flex items-center gap-1">
                                <input
                                  value={editCommission}
                                  onChange={(e) => setEditCommission(e.target.value)}
                                  type="number"
                                  className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-16 focus:outline-none focus:ring-1 focus:ring-gray-300"
                                />
                                <span className="text-sm text-gray-500">%</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3.5">{a.uses}</TableCell>
                            <TableCell className="py-3.5">${a.totalRevenue.toFixed(2)}</TableCell>
                            <TableCell className="font-medium text-green-700 py-3.5">${a.commissionOwed.toFixed(2)}</TableCell>
                            <TableCell className="text-right py-3.5">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => updateAffiliate(a.promoId)} className="text-xs text-gray-900 hover:text-gray-700 font-medium">Save</button>
                                <button onClick={() => setEditingAffiliate(null)} className="text-xs text-gray-400 hover:text-gray-900">Cancel</button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="py-3.5">
                              <button onClick={() => openProfile(a)} className="font-medium text-gray-900 hover:underline cursor-pointer text-left">
                                {a.name}
                              </button>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500 py-3.5">{a.email || <span className="text-gray-400">No email</span>}</TableCell>
                            <TableCell className="font-mono text-gray-700 py-3.5">{a.code}</TableCell>
                            <TableCell className="py-3.5">{a.commission}%</TableCell>
                            <TableCell className="py-3.5">{a.uses}</TableCell>
                            <TableCell className="py-3.5">${a.totalRevenue.toFixed(2)}</TableCell>
                            <TableCell className="font-medium text-green-700 py-3.5">${a.commissionOwed.toFixed(2)}</TableCell>
                            <TableCell className="text-right py-3.5">
                              <div className="flex items-center justify-end gap-3">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setExpandedAffiliate(expandedAffiliate === a.name ? null : a.name); }}
                                  className="text-xs text-gray-400 hover:text-gray-900"
                                >
                                  {a.conversions.length > 0 ? (expandedAffiliate === a.name ? "Hide" : `${a.conversions.length} sales`) : "No sales"}
                                </button>
                                <button
                                  onClick={() => { setEditingAffiliate(a.promoId); setEditName(a.name); setEditEmail(a.email || ""); setEditCommission(String(a.commission)); }}
                                  className="text-xs text-gray-400 hover:text-gray-900"
                                >
                                  Edit
                                </button>
                                {confirmDeleteAffiliate === a.promoId ? (
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => removeAffiliate(a.promoId)} className="text-xs text-red-600 hover:text-red-700">Remove</button>
                                    <button onClick={() => setConfirmDeleteAffiliate(null)} className="text-xs text-gray-400">Cancel</button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmDeleteAffiliate(a.promoId)}
                                    className="text-xs text-gray-400 hover:text-red-600 transition-colors"
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
                          <TableCell colSpan={9} className="bg-gray-50/50 p-0">
                            <div className="p-5">
                              <p className="text-xs font-medium text-gray-500 mb-3">Conversions for {a.name}</p>
                              <div className="space-y-2">
                                {a.conversions.map((c: any, i: number) => (
                                  <div key={i} className="flex flex-wrap items-center gap-4 text-xs bg-white rounded-lg px-4 py-3 border border-gray-100">
                                    <span className="font-medium min-w-[120px]">{c.full_name || c.email || "Unknown"}</span>
                                    <span className="text-gray-500">{c.email}</span>
                                    <span className="text-green-700 font-medium">${Number(c.final_price || 0).toFixed(2)}</span>
                                    <span className="text-gray-500">saved ${Number(c.discount_amount || 0).toFixed(2)}</span>
                                    <StatusBadge
                                      label={c.status}
                                      variant={c.status === "paid" || c.status === "completed" ? "green" : "gray"}
                                    />
                                    <span className="text-gray-500 ml-auto">{c.created_at ? new Date(c.created_at).toLocaleDateString() : ""}</span>
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
      {/* Affiliate Profile Dialog */}
      {(() => {
        const activeAffiliate = affiliateData.find(a => a.promoId === profileOpen);
        if (!activeAffiliate) return null;
        return (
          <Dialog open={!!profileOpen} onOpenChange={(open) => { if (!open) setProfileOpen(null); }}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">{activeAffiliate.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 mt-2">
                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 font-medium">Conversions</div>
                    <div className="text-xl font-medium">{activeAffiliate.uses}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 font-medium">Revenue</div>
                    <div className="text-xl font-medium">${activeAffiliate.totalRevenue.toFixed(2)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 font-medium">Owed</div>
                    <div className="text-xl font-medium text-green-700">${activeAffiliate.commissionOwed.toFixed(2)}</div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-0.5">Email</div>
                    <div className="font-medium">{activeAffiliate.email || "Not set"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-0.5">Code</div>
                    <div className="font-mono text-gray-900">{activeAffiliate.code}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-0.5">Discount</div>
                    <div>{activeAffiliate.discount}% off</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-0.5">Commission</div>
                    <div>{activeAffiliate.commission}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-0.5">Added</div>
                    <div>{new Date(activeAffiliate.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Editable fields */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Where did you find them?</label>
                    <input
                      value={profileSource}
                      onChange={(e) => setProfileSource(e.target.value)}
                      placeholder="YouTube, Instagram, referral, event..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Location</label>
                    <input
                      value={profileLocation}
                      onChange={(e) => setProfileLocation(e.target.value)}
                      placeholder="Sao Paulo, Brazil / London, UK..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Notes</label>
                    <textarea
                      value={profileNotes}
                      onChange={(e) => setProfileNotes(e.target.value)}
                      placeholder="Any notes about this affiliate... deal terms, contact preferences, follow-up dates..."
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => saveProfile(activeAffiliate.promoId)}
                  disabled={profileSaving}
                  className="w-full bg-green-800 text-white py-3 rounded-lg font-medium text-sm hover:bg-green-900 transition-all disabled:opacity-50"
                >
                  {profileSaving ? "Saving..." : "Save profile"}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
};

/* ── Affiliates Tab ── */
interface Affiliate {
  id: string;
  created_at: string;
  name: string;
  email: string;
  platform: string | null;
  why: string | null;
  posting_frequency: string | null;
  situation: string | null;
  motivation: string | null;
  promo_code: string | null;
  commission_percent: number;
  status: string;
  notes: string | null;
  location: string | null;
  source: string | null;
}

const frequencyOptions = ["One-off post", "Multiple posts", "Monthly posts", "Weekly posts", "Daily posts"];
const statusOptions = ["pending", "approved", "rejected"];

const AffiliatesTab = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", platform: "", why: "", posting_frequency: "",
    situation: "", motivation: "", promo_code: "", commission_percent: "20",
    status: "approved", notes: "", location: "", source: "",
  });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const loadAffiliates = async () => {
    setLoading(true);
    const { data } = await supabase.from("affiliates").select("*").order("created_at", { ascending: false });
    if (data) setAffiliates(data as any);
    setLoading(false);
  };

  useEffect(() => { loadAffiliates(); }, []);

  const resetForm = () => {
    setForm({ name: "", email: "", platform: "", why: "", posting_frequency: "", situation: "", motivation: "", promo_code: "", commission_percent: "20", status: "approved", notes: "", location: "", source: "" });
    setShowAdd(false);
    setEditId(null);
  };

  const startEdit = (a: Affiliate) => {
    setEditId(a.id);
    setShowAdd(true);
    setForm({
      name: a.name, email: a.email, platform: a.platform || "", why: a.why || "",
      posting_frequency: a.posting_frequency || "", situation: a.situation || "",
      motivation: a.motivation || "", promo_code: a.promo_code || "",
      commission_percent: String(a.commission_percent), status: a.status,
      notes: a.notes || "", location: a.location || "", source: a.source || "",
    });
  };

  const saveAffiliate = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      platform: form.platform.trim() || null,
      why: form.why.trim() || null,
      posting_frequency: form.posting_frequency || null,
      situation: form.situation.trim() || null,
      motivation: form.motivation.trim() || null,
      promo_code: form.promo_code.trim().toUpperCase() || null,
      commission_percent: parseInt(form.commission_percent) || 20,
      status: form.status,
      notes: form.notes.trim() || null,
      location: form.location.trim() || null,
      source: form.source.trim() || null,
    };
    if (editId) {
      await supabase.from("affiliates").update(payload as any).eq("id", editId);
    } else {
      await supabase.from("affiliates").insert(payload as any);
    }
    setSaving(false);
    resetForm();
    loadAffiliates();
  };

  const deleteAffiliate = async (id: string) => {
    await supabase.from("affiliates").delete().eq("id", id);
    setConfirmDelete(null);
    loadAffiliates();
  };

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const approved = affiliates.filter(a => a.status === "approved").length;
  const pending = affiliates.filter(a => a.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Affiliates</h2>
        <p className="text-sm text-gray-500 mt-1">Manage affiliate partners, set commission rates, and track referrals.</p>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total affiliates" value={affiliates.length.toString()} />
        <StatCard label="Approved" value={approved.toString()} />
        <StatCard label="Pending" value={pending.toString()} />
        <StatCard label="With promo code" value={affiliates.filter(a => a.promo_code).length.toString()} />
      </div>

      {/* Add / Edit form */}
      {showAdd ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-base text-gray-900 mb-4">{editId ? "Edit affiliate" : "Add new affiliate"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Name *</label>
              <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Jane Doe" className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Email *</label>
              <input value={form.email} onChange={e => update("email", e.target.value)} type="email" placeholder="affiliate@email.com" className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Platform</label>
              <input value={form.platform} onChange={e => update("platform", e.target.value)} placeholder="YouTube, Instagram, blog..." className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Location</label>
              <input value={form.location} onChange={e => update("location", e.target.value)} placeholder="Sao Paulo, Brazil" className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Promo code</label>
              <input value={form.promo_code} onChange={e => update("promo_code", e.target.value.toUpperCase())} placeholder="BRAZILIANGRINGO" className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-gray-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Commission %</label>
              <input value={form.commission_percent} onChange={e => update("commission_percent", e.target.value)} type="number" placeholder="20" className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Source</label>
              <input value={form.source} onChange={e => update("source", e.target.value)} placeholder="Referral, event, outreach..." className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Status</label>
              <select value={form.status} onChange={e => update("status", e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300">
                {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          {/* Posting frequency */}
          <div className="mt-4">
            <label className="text-xs font-medium text-gray-500 block mb-1.5">Posting frequency</label>
            <div className="flex flex-wrap gap-2">
              {frequencyOptions.map(opt => (
                <button key={opt} type="button" onClick={() => update("posting_frequency", form.posting_frequency === opt ? "" : opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.posting_frequency === opt ? "border-gray-900 bg-green-800 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"}`}
                >{opt}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Why they want to be an affiliate</label>
              <textarea value={form.why} onChange={e => update("why", e.target.value)} rows={2} placeholder="Their motivation..." className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Their situation</label>
              <textarea value={form.situation} onChange={e => update("situation", e.target.value)} rows={2} placeholder="Based in Brazil? Digital nomad?..." className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none" />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs font-medium text-gray-500 block mb-1">Internal notes</label>
            <textarea value={form.notes} onChange={e => update("notes", e.target.value)} rows={2} placeholder="Any private notes about this affiliate..." className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none" />
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={saveAffiliate} disabled={saving || !form.name.trim() || !form.email.trim()} className="bg-green-800 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-green-900 transition-all disabled:opacity-50">
              {saving ? "Saving..." : editId ? "Update affiliate" : "Add affiliate"}
            </button>
            <button onClick={resetForm} className="px-6 py-2.5 rounded-lg font-medium text-sm border border-gray-200 text-gray-500 hover:text-gray-900 transition-all">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="bg-green-800 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-green-900 transition-all">
          + Add affiliate
        </button>
      )}

      {/* Affiliates table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500 animate-pulse">Loading...</div>
        ) : affiliates.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No affiliates yet. Add one above.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium py-3">Name</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Email</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Platform</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Code</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Commission</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Frequency</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-right uppercase text-[11px] tracking-wider text-gray-400 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates.map(a => (
                  <TableRow key={a.id} className="hover:bg-gray-50 border-b border-gray-100">
                    <TableCell className="font-medium py-3.5">{a.name}</TableCell>
                    <TableCell className="text-sm text-gray-500 py-3.5">{a.email}</TableCell>
                    <TableCell className="text-sm text-gray-500 py-3.5">{a.platform || "—"}</TableCell>
                    <TableCell className="font-mono text-gray-700 py-3.5">{a.promo_code || "—"}</TableCell>
                    <TableCell className="py-3.5">{a.commission_percent}%</TableCell>
                    <TableCell className="text-sm text-gray-500 py-3.5">{a.posting_frequency || "—"}</TableCell>
                    <TableCell className="py-3.5">
                      <StatusBadge
                        label={a.status}
                        variant={
                          a.status === "approved" ? "green" :
                          a.status === "rejected" ? "red" :
                          "yellow"
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right py-3.5">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => startEdit(a)} className="text-xs text-gray-400 hover:text-gray-900 transition-colors">Edit</button>
                        {confirmDelete === a.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => deleteAffiliate(a.id)} className="text-xs text-red-600 hover:text-red-700">Confirm</button>
                            <button onClick={() => setConfirmDelete(null)} className="text-xs text-gray-400">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(a.id)} className="text-xs text-gray-400 hover:text-red-600 transition-colors">Delete</button>
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
    </div>
  );
};

/* ── Partners Tab ── */
const PartnersTab = ({ userId }: { userId: string }) => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    setLoading(true);
    const { data } = await supabase.from("affiliate_applications").select("*").order("created_at", { ascending: false });
    if (data) setApps(data);
    setLoading(false);
  };

  const totalApps = apps.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Partner Applications</h2>
        <p className="text-sm text-gray-500 mt-1">Review and approve businesses applying to become GET CPF partners.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total applications" value={totalApps.toString()} />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500 animate-pulse">Loading...</div>
        ) : apps.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No partner applications yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium py-3">Name</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Email</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Platform</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Situation</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Applied</TableHead>
                  <TableHead className="text-right uppercase text-[11px] tracking-wider text-gray-400 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.map((a: any) => (
                  <TableRow key={a.id} className="hover:bg-gray-50 border-b border-gray-100">
                    <TableCell className="font-medium py-3.5">{a.name}</TableCell>
                    <TableCell className="text-sm text-gray-500 py-3.5">{a.email}</TableCell>
                    <TableCell className="text-sm py-3.5">{a.platform || "—"}</TableCell>
                    <TableCell className="text-sm text-gray-500 max-w-[200px] truncate py-3.5">{a.situation || "—"}</TableCell>
                    <TableCell className="text-xs text-gray-500 py-3.5">{new Date(a.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right py-3.5">
                      <button onClick={() => setSelectedApp(a)} className="text-xs text-gray-400 hover:text-gray-900 transition-colors">View</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {selectedApp && (
        <Dialog open={!!selectedApp} onOpenChange={(open) => { if (!open) setSelectedApp(null); }}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">{selectedApp.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><div className="text-xs text-gray-500 font-medium mb-0.5">Email</div><div>{selectedApp.email}</div></div>
                <div><div className="text-xs text-gray-500 font-medium mb-0.5">Platform</div><div>{selectedApp.platform || "—"}</div></div>
                <div><div className="text-xs text-gray-500 font-medium mb-0.5">Frequency</div><div>{selectedApp.posting_frequency || "—"}</div></div>
                <div><div className="text-xs text-gray-500 font-medium mb-0.5">Applied</div><div>{new Date(selectedApp.created_at).toLocaleDateString()}</div></div>
              </div>
              {selectedApp.situation && (
                <div><div className="text-xs text-gray-500 font-medium mb-0.5">Situation</div><p className="text-sm">{selectedApp.situation}</p></div>
              )}
              {selectedApp.why && (
                <div><div className="text-xs text-gray-500 font-medium mb-0.5">Why</div><p className="text-sm">{selectedApp.why}</p></div>
              )}
              {selectedApp.motivation && (
                <div><div className="text-xs text-gray-500 font-medium mb-0.5">Motivation</div><p className="text-sm">{selectedApp.motivation}</p></div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

/* ── Settings Tab ── */
const SettingsTab = ({ userId }: { userId: string }) => {
  const [exporting, setExporting] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => { if (data) setAuditLogs(data); setLoadingLogs(false); });
  }, []);

  const exportCSV = async () => {
    setExporting(true);
    await logAuditAction(userId, "Exported users CSV");
    const [profilesRes, appsRes] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name, country_code, plan, created_at"),
      supabase.from("applications").select("user_id, full_name, nationality, state_name, city, status"),
    ]);
    const profileData = profilesRes.data || [];
    const appData = appsRes.data || [];
    const appMap = new Map((appData as any[]).map(a => [a.user_id, a]));

    const headers = ["email", "full_name", "nationality", "state", "city", "plan", "status", "created_at"];
    const rows = profileData.map((p: any) => {
      const app = appMap.get(p.id) as any;
      return headers.map(h => {
        let val = "";
        if (h === "full_name") val = p.full_name || app?.full_name || "";
        else if (h === "nationality") val = app?.nationality || p.country_code || "";
        else if (h === "state") val = app?.state_name || "";
        else if (h === "city") val = app?.city || "";
        else if (h === "status") val = app?.status || "";
        else val = (p as any)[h] ?? "";
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(",");
    });

    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `getcpf-users-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Export data for compliance, view the audit trail, and manage system configuration.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-base text-gray-900">Data export</h2>
        <p className="text-sm text-gray-500">Export all user data as CSV for LGPD compliance requests.</p>
        <button
          onClick={exportCSV}
          disabled={exporting}
          className="bg-green-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-900 transition-all disabled:opacity-50"
        >
          {exporting ? "Exporting..." : "Export users CSV"}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-base text-gray-900 mb-2">Payment integration</h2>
        <p className="text-sm text-gray-500">
          Payment integration settings will appear here once connected. Price changes and webhook configuration will be manageable from this panel.
        </p>
      </div>

      {/* Audit Log */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-base text-gray-900 mb-1">Audit log</h2>
        <p className="text-xs text-gray-500 mb-4">Recent admin actions (last 50)</p>
        {loadingLogs ? (
          <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
        ) : auditLogs.length === 0 ? (
          <p className="text-sm text-gray-500">No audit log entries yet. Actions will be recorded as you use the admin panel.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium py-3">Action</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Details</TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log: any) => (
                  <TableRow key={log.id} className="hover:bg-gray-50 border-b border-gray-100">
                    <TableCell className="font-medium text-sm py-3.5">{log.action}</TableCell>
                    <TableCell className="text-sm text-gray-500 max-w-[300px] truncate py-3.5">{log.details || "—"}</TableCell>
                    <TableCell className="text-xs text-gray-500 whitespace-nowrap py-3.5">
                      {new Date(log.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Waitlist Tab ── */
const WaitlistTab = () => {
  const [entries, setEntries] = useState<{ id: string; email: string; plan: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("waitlist").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setEntries(data as any); setLoading(false); });
  }, []);

  const byPlan = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.plan] = (acc[e.plan] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Waitlist</h2>
        <p className="text-sm text-gray-500 mt-1">People who signed up for Concierge and Full Assist tiers. Reach out when those plans launch.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total signups" value={entries.length.toString()} />
        {Object.entries(byPlan).map(([plan, count]) => (
          <StatCard key={plan} label={plan} value={count.toString()} />
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium py-3">Email</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Plan interest</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider text-gray-400 font-medium">Signed up</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} className="text-center text-sm text-gray-500 py-8">Loading...</TableCell></TableRow>
            ) : entries.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center text-sm text-gray-500 py-8">No waitlist signups yet</TableCell></TableRow>
            ) : entries.map(e => (
              <TableRow key={e.id} className="hover:bg-gray-50 border-b border-gray-100">
                <TableCell className="font-medium py-3.5">{e.email}</TableCell>
                <TableCell className="py-3.5">
                  <StatusBadge label={e.plan} variant="green" />
                </TableCell>
                <TableCell className="text-xs text-gray-500 py-3.5">
                  {new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

/* ── Shared components ── */
const StatusBadge = ({ label, variant }: { label: string; variant: "green" | "yellow" | "red" | "blue" | "gray" }) => {
  const styles = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[variant]}`}>
      {label}
    </span>
  );
};

const StatCard = ({ label, value, trend, sub }: { label: string; value: string; trend?: "up" | "down"; sub?: string }) => (
  <div className="bg-white rounded-xl shadow-sm p-4">
    <div className="text-sm text-gray-500 font-medium">{label}</div>
    <div className="text-2xl font-medium text-gray-900 mt-1 flex items-center gap-2">
      {value}
      {trend === "up" && <span className="text-xs text-green-600 font-medium">+</span>}
    </div>
    {sub && <div className="text-[10px] text-gray-400 mt-1">{sub}</div>}
  </div>
);

const ChartCard = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-sm p-4">
    <div className="text-sm font-medium text-gray-900">{title}</div>
    {subtitle && <div className="text-[11px] text-gray-400 mb-3">{subtitle}</div>}
    {children}
  </div>
);

const TablePagination = ({ currentPage, totalPages, totalItems, pageSize, onPageChange }: {
  currentPage: number; totalPages: number; totalItems: number; pageSize: number; onPageChange: (p: number) => void;
}) => {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm">
      <span className="text-gray-400 text-xs">{start}&ndash;{end} of {totalItems}</span>
      <div className="flex gap-1">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-50 hover:bg-gray-100 disabled:opacity-40 transition-all">&larr; Prev</button>
        <span className="px-2 py-1 text-xs text-gray-400">Page {currentPage} of {totalPages}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-50 hover:bg-gray-100 disabled:opacity-40 transition-all">Next &rarr;</button>
      </div>
    </div>
  );
};

export default Admin;
