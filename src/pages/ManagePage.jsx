import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const VISITOR_DATA = [
  { day: "1", v: 420 }, { day: "2", v: 380 }, { day: "3", v: 510 },
  { day: "4", v: 490 }, { day: "5", v: 620 }, { day: "6", v: 750 },
  { day: "7", v: 680 }, { day: "8", v: 590 }, { day: "9", v: 810 },
  { day: "10", v: 870 }, { day: "11", v: 760 }, { day: "12", v: 920 },
  { day: "13", v: 1040 }, { day: "14", v: 980 }, { day: "15", v: 1120 },
  { day: "16", v: 1050 }, { day: "17", v: 940 }, { day: "18", v: 1200 },
  { day: "19", v: 1350 }, { day: "20", v: 1280 }, { day: "21", v: 1180 },
  { day: "22", v: 1420 }, { day: "23", v: 1500 }, { day: "24", v: 1380 },
  { day: "25", v: 1460 }, { day: "26", v: 1320 }, { day: "27", v: 1600 },
  { day: "28", v: 1540 }, { day: "29", v: 1480 }, { day: "30", v: 1720 },
];

const PRODUCTS = [
  { id: "SP001", name: "Tư vấn Thiết kế Web", category: "Dịch vụ", price: "4.500.000₫", stock: "∞", status: "active", sold: 48 },
  { id: "SP002", name: "Gói SEO 3 tháng", category: "Marketing", price: "2.800.000₫", stock: "∞", status: "active", sold: 32 },
  { id: "SP003", name: "Thiết kế Logo + Branding", category: "Thiết kế", price: "3.200.000₫", stock: "∞", status: "active", sold: 27 },
  { id: "SP004", name: "Quản lý MXH / tháng", category: "Marketing", price: "1.900.000₫", stock: "∞", status: "inactive", sold: 15 },
  { id: "SP005", name: "App Mobile (iOS/Android)", category: "Dev", price: "25.000.000₫", stock: "∞", status: "active", sold: 6 },
  { id: "SP006", name: "Landing Page Premium", category: "Dịch vụ", price: "5.800.000₫", stock: "∞", status: "active", sold: 19 },
];

const CONSULTATIONS = [
  { id: "TV001", name: "Nguyễn Thị Lan", phone: "0912 345 678", service: "Thiết kế Web", date: "02/03/2026 09:15", status: "pending", note: "Cần tư vấn website bán hàng" },
  { id: "TV002", name: "Trần Minh Khoa", phone: "0987 654 321", service: "SEO", date: "02/03/2026 11:30", status: "confirmed", note: "Shop thời trang, muốn tăng traffic" },
  { id: "TV003", name: "Lê Thu Hương", phone: "0901 234 567", service: "App Mobile", date: "01/03/2026 14:00", status: "done", note: "App đặt đồ ăn nội bộ công ty" },
  { id: "TV004", name: "Phạm Quốc Bảo", phone: "0976 543 210", service: "Branding", date: "01/03/2026 16:45", status: "pending", note: "Startup fintech cần bộ nhận diện" },
  { id: "TV005", name: "Võ Ngọc Diễm", phone: "0934 567 890", service: "Landing Page", date: "29/02/2026 10:00", status: "cancelled", note: "" },
];

const ORDERS = [
  { id: "DH2603001", customer: "Nguyễn Thị Lan", service: "Tư vấn Thiết kế Web", amount: "4.500.000₫", date: "02/03/2026", status: "processing", payment: "Chuyển khoản" },
  { id: "DH2603002", customer: "Trần Minh Khoa", service: "Gói SEO 3 tháng", amount: "2.800.000₫", date: "02/03/2026", status: "done", payment: "Momo" },
  { id: "DH2602003", customer: "Công ty ABC", service: "App Mobile", amount: "25.000.000₫", date: "28/02/2026", status: "processing", payment: "Chuyển khoản" },
  { id: "DH2602004", customer: "Studio XYZ", service: "Branding", amount: "3.200.000₫", date: "27/02/2026", status: "done", payment: "VNPay" },
  { id: "DH2602005", customer: "Phạm Quốc Bảo", service: "Landing Page Premium", amount: "5.800.000₫", date: "25/02/2026", status: "cancelled", payment: "Momo" },
  { id: "DH2601006", customer: "Lê Thu Hương", service: "Quản lý MXH", amount: "1.900.000₫", date: "20/02/2026", status: "done", payment: "Chuyển khoản" },
];

const CUSTOMERS = [
  { id: "KH001", name: "Nguyễn Thị Lan", phone: "0912 345 678", email: "lan.nguyen@gmail.com", orders: 3, total: "12.800.000₫", joined: "15/01/2026", tier: "gold" },
  { id: "KH002", name: "Trần Minh Khoa", phone: "0987 654 321", email: "khoa.tran@yahoo.com", orders: 2, total: "5.600.000₫", joined: "20/01/2026", tier: "silver" },
  { id: "KH003", name: "Công ty ABC Tech", phone: "028 1234 5678", email: "contact@abctech.vn", orders: 5, total: "48.200.000₫", joined: "05/12/2025", tier: "platinum" },
  { id: "KH004", name: "Studio XYZ", phone: "0901 111 222", email: "hello@xyz.studio", orders: 4, total: "19.500.000₫", joined: "10/12/2025", tier: "gold" },
  { id: "KH005", name: "Phạm Quốc Bảo", phone: "0976 543 210", email: "bao.pham@gmail.com", orders: 1, total: "5.800.000₫", joined: "01/03/2026", tier: "new" },
  { id: "KH006", name: "Võ Ngọc Diễm", phone: "0934 567 890", email: "diem.vo@outlook.com", orders: 2, total: "6.400.000₫", joined: "15/02/2026", tier: "silver" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const statusConfig = {
  active:     { label: "Hoạt động",  bg: "bg-emerald-50", text: "text-emerald-600", dot: "#10B981" },
  inactive:   { label: "Tạm ẩn",    bg: "bg-slate-100",  text: "text-slate-500",  dot: "#94A3B8" },
  pending:    { label: "Chờ xử lý", bg: "bg-amber-50",   text: "text-amber-600",  dot: "#F59E0B" },
  confirmed:  { label: "Đã xác nhận",bg:"bg-sky-50",     text: "text-sky-600",    dot: "#0EA5E9" },
  done:       { label: "Hoàn thành", bg: "bg-emerald-50", text: "text-emerald-600",dot: "#10B981" },
  cancelled:  { label: "Đã huỷ",    bg: "bg-red-50",     text: "text-red-500",    dot: "#EF4444" },
  processing: { label: "Đang xử lý",bg: "bg-orange-50",  text: "text-orange-500", dot: "#FF6B2B" },
};

const tierConfig = {
  platinum: { label: "Platinum", bg: "bg-violet-50", text: "text-violet-600", icon: "💎" },
  gold:     { label: "Gold",     bg: "bg-amber-50",  text: "text-amber-600",  icon: "🥇" },
  silver:   { label: "Silver",   bg: "bg-slate-100", text: "text-slate-600",  icon: "🥈" },
  new:      { label: "Mới",      bg: "bg-sky-50",    text: "text-sky-600",    icon: "✨" },
};

const Badge = ({ status, map = statusConfig }) => {
  const c = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
};

// ─── SPARKLINE CHART ──────────────────────────────────────────────────────────
const MiniChart = ({ data, color = "#FF6B2B", height = 48 }) => {
  const max = Math.max(...data.map(d => d.v));
  const min = Math.min(...data.map(d => d.v));
  const w = 120, h = height;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.v - min) / (max - min)) * (h - 6) - 3;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#g${color.replace("#","")})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── VISITOR CHART ────────────────────────────────────────────────────────────
const VisitorChart = ({ data }) => {
  const [tooltip, setTooltip] = useState(null);
  const max = Math.max(...data.map(d => d.v));
  const W = 700, H = 180;
  const PAD = { t: 16, b: 32, l: 44, r: 16 };
  const cw = W - PAD.l - PAD.r;
  const ch = H - PAD.t - PAD.b;
  const pts = data.map((d, i) => {
    const x = PAD.l + (i / (data.length - 1)) * cw;
    const y = PAD.t + (1 - d.v / max) * ch;
    return { x, y, ...d };
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `M${pts[0].x},${PAD.t + ch} ${pts.map(p => `L${p.x},${p.y}`).join(" ")} L${pts[pts.length-1].x},${PAD.t+ch} Z`;
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(max * (1 - f)));

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minWidth: 320, height: "auto", maxHeight: 200 }}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B2B" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#FF6B2B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#FF6B2B" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {gridLines.map((val, i) => {
          const y = PAD.t + (i / 4) * ch;
          return (
            <g key={i}>
              <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="#F1F5F9" strokeWidth="1" />
              <text x={PAD.l - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#94A3B8">{val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}</text>
            </g>
          );
        })}

        {/* X labels — every 5 days */}
        {pts.filter((_, i) => i % 4 === 0 || i === pts.length - 1).map((p, i) => (
          <text key={i} x={p.x} y={H - 6} textAnchor="middle" fontSize="9" fill="#94A3B8">{p.day}</text>
        ))}

        {/* Area fill */}
        <path d={area} fill="url(#visitorGrad)" />

        {/* Line */}
        <path d={path} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots + hover */}
        {pts.map((p, i) => (
          <g key={i} onMouseEnter={() => setTooltip(p)} style={{ cursor: "pointer" }}>
            <circle cx={p.x} cy={p.y} r="10" fill="transparent" />
            <circle cx={p.x} cy={p.y} r={tooltip?.day === p.day ? 4 : 2.5}
              fill={tooltip?.day === p.day ? "#FF6B2B" : "#fff"}
              stroke={tooltip?.day === p.day ? "#FF6B2B" : "#CBD5E1"}
              strokeWidth="1.5"
              style={{ transition: "r .15s" }}
            />
          </g>
        ))}

        {/* Tooltip */}
        {tooltip && (() => {
          const tx = Math.min(Math.max(tooltip.x, 60), W - 60);
          const ty = tooltip.y - 36;
          return (
            <g>
              <rect x={tx - 36} y={ty} width={72} height={26} rx={6} fill="#1E293B" />
              <text x={tx} y={ty + 11} textAnchor="middle" fontSize="9" fill="#94A3B8">Ngày {tooltip.day}</text>
              <text x={tx} y={ty + 22} textAnchor="middle" fontSize="10" fill="white" fontWeight="600">{tooltip.v.toLocaleString()} lượt</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
};

// ─── TABS CONFIG ──────────────────────────────────────────────────────────────
const TABS = [
  { id: "stats",    label: "Thống kê",      shortLabel: "Thống kê",   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { id: "products", label: "Sản phẩm",      shortLabel: "Sản phẩm",   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2"/><polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/></svg> },
  { id: "consult",  label: "Yêu cầu tư vấn",shortLabel: "Tư vấn",    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: "orders",   label: "Đơn hàng",      shortLabel: "Đơn hàng",   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { id: "customers",label: "Khách hàng",    shortLabel: "Khách",      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ManagePage = () => {
  const [activeTab, setActiveTab] = useState("stats");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const tabBarRef = useRef(null);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const totalVisitors = VISITOR_DATA.reduce((s, d) => s + d.v, 0);
  const avgDaily = Math.round(totalVisitors / VISITOR_DATA.length);
  const todayVisitors = VISITOR_DATA[VISITOR_DATA.length - 1].v;
  const growth = Math.round(((VISITOR_DATA[29].v - VISITOR_DATA[0].v) / VISITOR_DATA[0].v) * 100);

  const totalRevenue = "68.600.000₫";
  const pendingConsult = CONSULTATIONS.filter(c => c.status === "pending").length;
  const processingOrders = ORDERS.filter(o => o.status === "processing").length;

  // scroll active tab into view
  useEffect(() => {
    const el = tabBarRef.current?.querySelector(`[data-tab="${activeTab}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeTab]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#F8FAFC}
        .font-jakarta{font-family:'Plus Jakarta Sans',sans-serif}
        .font-mono{font-family:'DM Mono',monospace}
        @keyframes slideInLeft{from{opacity:0;transform:translateX(-100%)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .sidebar-overlay{animation:fadeIn .2s ease}
        .sidebar-panel{animation:slideInLeft .25s cubic-bezier(.4,0,.2,1)}
        .card-enter{animation:slideUp .4s ease both}
        .stat-num{animation:countUp .5s ease both}
        .live-dot{animation:pulse 2s ease infinite}
        .tab-active{position:relative}
        .tab-active::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:20px;height:3px;background:linear-gradient(90deg,#FF6B2B,#38BDF8);border-radius:2px 2px 0 0}
        .row-hover{transition:background .15s ease}
        .row-hover:hover{background:#F8FAFC}
        .btn-primary{background:linear-gradient(135deg,#FF6B2B,#F97316);transition:all .25s ease;box-shadow:0 4px 14px rgba(255,107,43,.3)}
        .btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(255,107,43,.4)}
        .btn-sky{background:linear-gradient(135deg,#38BDF8,#0EA5E9);transition:all .25s ease;box-shadow:0 4px 14px rgba(56,189,248,.25)}
        .btn-sky:hover{transform:translateY(-1px)}
        .card-shadow{box-shadow:0 1px 3px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.04)}
        .card-shadow-md{box-shadow:0 2px 8px rgba(0,0,0,.08),0 8px 24px rgba(0,0,0,.05)}
        .search-input:focus{outline:none;border-color:#38BDF8;box-shadow:0 0 0 3px rgba(56,189,248,.12)}
        .notif-panel{animation:slideUp .2s ease}
        .chip{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:500;white-space:nowrap}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:4px}
        .table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
        table{border-collapse:collapse;width:100%;min-width:520px}
        th{padding:10px 14px;text-align:left;font-size:11px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:.05em;background:#F8FAFC;border-bottom:1px solid #F1F5F9;white-space:nowrap}
        td{padding:12px 14px;font-size:13px;color:#334155;border-bottom:1px solid #F8FAFC;vertical-align:middle}
        .mobile-card{background:white;border-radius:16px;padding:14px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.04)}
      `}</style>

      <div className="font-jakarta min-h-screen" style={{ background: "#F0F4F8" }}>

        {/* ── MOBILE SIDEBAR OVERLAY ── */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="sidebar-overlay absolute inset-0" style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)" }} onClick={() => setSidebarOpen(false)} />
            <div className="sidebar-panel relative w-72 h-full flex flex-col" style={{ background: "white", boxShadow: "4px 0 24px rgba(0,0,0,0.12)" }}>
              {/* Sidebar header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#FF6B2B,#F97316)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity=".9"/>
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 leading-tight text-sm">DAN Platform</div>
                    <div className="text-xs text-slate-400">Admin Panel</div>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
              </div>

              {/* Nav items */}
              <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {TABS.map(tab => (
                  <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150"
                    style={{ background: activeTab === tab.id ? "linear-gradient(135deg,rgba(255,107,43,.1),rgba(56,189,248,.08))" : "transparent", color: activeTab === tab.id ? "#FF6B2B" : "#64748B", fontWeight: activeTab === tab.id ? 600 : 400 }}>
                    <span style={{ color: activeTab === tab.id ? "#FF6B2B" : "#94A3B8" }}>{tab.icon}</span>
                    <span className="text-sm">{tab.label}</span>
                    {tab.id === "consult" && pendingConsult > 0 && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#FFF3EE", color: "#FF6B2B" }}>{pendingConsult}</span>
                    )}
                    {tab.id === "orders" && processingOrders > 0 && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#FFF3EE", color: "#FF6B2B" }}>{processingOrders}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Admin profile */}
              <div className="px-4 py-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#38BDF8,#0EA5E9)" }}>Đ</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-700 truncate">Admin Đan</div>
                    <div className="text-xs text-slate-400">Super Admin</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 live-dot" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── DESKTOP SIDEBAR ── */}
        <div className="hidden lg:flex fixed left-0 top-0 h-full w-60 xl:w-64 flex-col z-30"
          style={{ background: "white", borderRight: "1px solid #F1F5F9", boxShadow: "2px 0 12px rgba(0,0,0,.04)" }}>
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#FF6B2B,#F97316)", boxShadow: "0 4px 12px rgba(255,107,43,.3)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity=".9"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-slate-800">DAN Platform</div>
              <div className="text-xs text-slate-400">Admin Panel</div>
            </div>
          </div>

          {/* Nav */}
          <div className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
            <p className="text-xs font-semibold text-slate-400 px-3 mb-3 tracking-widest uppercase">Menu chính</p>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                style={{ background: activeTab === tab.id ? "linear-gradient(135deg,rgba(255,107,43,.1),rgba(56,189,248,.07))" : "transparent", color: activeTab === tab.id ? "#FF6B2B" : "#64748B", fontWeight: activeTab === tab.id ? 600 : 400 }}>
                <span style={{ color: activeTab === tab.id ? "#FF6B2B" : "#94A3B8" }}>{tab.icon}</span>
                <span className="text-sm">{tab.label}</span>
                {tab.id === "consult" && pendingConsult > 0 && (
                  <span className="ml-auto text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold" style={{ background: "#FF6B2B", color: "white" }}>{pendingConsult}</span>
                )}
                {tab.id === "orders" && processingOrders > 0 && (
                  <span className="ml-auto text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold" style={{ background: "#FF6B2B", color: "white" }}>{processingOrders}</span>
                )}
              </button>
            ))}
          </div>

          {/* Profile */}
          <div className="px-4 py-4 border-t border-slate-100 mx-3 mb-3 rounded-xl" style={{ background: "#F8FAFC" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg,#38BDF8,#0EA5E9)" }}>Đ</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-700 truncate">Admin Đan</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />
                  <span className="text-xs text-slate-400">Đang hoạt động</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="lg:ml-60 xl:ml-64 flex flex-col min-h-screen">

          {/* Top bar */}
          <header className="sticky top-0 z-20 flex items-center gap-3 px-4 lg:px-6 py-3.5"
            style={{ background: "rgba(240,244,248,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(241,245,249,0.8)" }}>
            {/* Hamburger (mobile) */}
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white card-shadow text-slate-600 flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>

            {/* Search */}
            <div className="flex-1 relative max-w-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm..." className="search-input w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white border border-slate-200 text-slate-700 placeholder-slate-400" style={{ transition: "all .2s" }} />
            </div>

            <div className="ml-auto flex items-center gap-2">
              {/* Date */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white card-shadow text-xs text-slate-500">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#94A3B8" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="#94A3B8" strokeWidth="2"/></svg>
                <span>Tháng 3, 2026</span>
              </div>

              {/* Notif */}
              <div className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)}
                  className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white card-shadow text-slate-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  {(pendingConsult + processingOrders) > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: "#FF6B2B", fontSize: 9 }}>{pendingConsult + processingOrders}</span>
                  )}
                </button>
                {notifOpen && (
                  <div className="notif-panel absolute right-0 top-12 w-72 bg-white rounded-2xl card-shadow-md overflow-hidden z-50" style={{ border: "1px solid #F1F5F9" }}>
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-semibold text-slate-700 text-sm">Thông báo</span>
                      <span className="text-xs text-slate-400 cursor-pointer hover:text-sky-500">Đánh dấu đã đọc</span>
                    </div>
                    {pendingConsult > 0 && (
                      <div className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50" onClick={() => { setActiveTab("consult"); setNotifOpen(false); }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FFF3EE" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#FF6B2B" strokeWidth="2"/></svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-700">{pendingConsult} yêu cầu tư vấn đang chờ</p>
                          <p className="text-xs text-slate-400 mt-0.5">Cần xử lý sớm</p>
                        </div>
                      </div>
                    )}
                    {processingOrders > 0 && (
                      <div className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer" onClick={() => { setActiveTab("orders"); setNotifOpen(false); }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#EFF6FF" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="#38BDF8" strokeWidth="2"/></svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-700">{processingOrders} đơn hàng đang xử lý</p>
                          <p className="text-xs text-slate-400 mt-0.5">Kiểm tra tiến độ</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer" style={{ background: "linear-gradient(135deg,#38BDF8,#0EA5E9)" }}>Đ</div>
            </div>
          </header>

          {/* ── MOBILE TAB BAR ── */}
          <div className="lg:hidden sticky top-[57px] z-10" style={{ background: "rgba(240,244,248,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid #E2E8F0" }}>
            <div ref={tabBarRef} className="flex overflow-x-auto px-2 py-2 gap-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {TABS.map(tab => (
                <button key={tab.id} data-tab={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${activeTab === tab.id ? "tab-active" : ""}`}
                  style={{
                    background: activeTab === tab.id ? "white" : "transparent",
                    color: activeTab === tab.id ? "#FF6B2B" : "#64748B",
                    boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,.08)" : "none",
                    fontWeight: activeTab === tab.id ? 600 : 400,
                  }}>
                  <span style={{ color: activeTab === tab.id ? "#FF6B2B" : "#94A3B8" }}>{tab.icon}</span>
                  {tab.shortLabel}
                  {tab.id === "consult" && pendingConsult > 0 && <span className="w-4 h-4 rounded-full text-white text-xs flex items-center justify-center" style={{ background: "#FF6B2B", fontSize: 9 }}>{pendingConsult}</span>}
                  {tab.id === "orders" && processingOrders > 0 && <span className="w-4 h-4 rounded-full text-white text-xs flex items-center justify-center" style={{ background: "#FF6B2B", fontSize: 9 }}>{processingOrders}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* ── PAGE CONTENT ── */}
          <main className="flex-1 p-4 lg:p-6 xl:p-8">

            {/* PAGE TITLE */}
            <div className="mb-5 lg:mb-7" style={{ animation: mounted ? "slideUp .4s ease both" : "none", opacity: 0 }}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-slate-800">
                    {TABS.find(t => t.id === activeTab)?.label}
                  </h1>
                  <p className="text-sm text-slate-400 mt-0.5">Tháng 3, 2026 • DAN Platform</p>
                </div>
                {(activeTab === "products" || activeTab === "customers") && (
                  <button className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    <span className="hidden sm:inline">Thêm mới</span>
                  </button>
                )}
              </div>
            </div>

            {/* ════════════════════════════════════════════════
                TAB: THỐNG KÊ
            ════════════════════════════════════════════════ */}
            {activeTab === "stats" && (
              <div className="space-y-5">
                {/* KPI cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  {[
                    { label: "Tổng lượt truy cập", value: totalVisitors.toLocaleString(), sub: `+${growth}% tháng này`, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2"/></svg>, color: "#38BDF8", bg: "#EFF6FF", trend: "up", chartData: VISITOR_DATA.slice(-8) },
                    { label: "Doanh thu tháng", value: totalRevenue, sub: "6 đơn hoàn thành", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>, color: "#FF6B2B", bg: "#FFF3EE", trend: "up", chartData: VISITOR_DATA.slice(-8).map(d => ({...d, v: Math.round(d.v * 0.8)})) },
                    { label: "Yêu cầu tư vấn", value: CONSULTATIONS.length, sub: `${pendingConsult} chờ xử lý`, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2"/></svg>, color: "#A78BFA", bg: "#F5F3FF", trend: "up", chartData: VISITOR_DATA.slice(-8).map(d => ({...d, v: Math.round(d.v * 0.3)})) },
                    { label: "Đơn hàng tháng", value: ORDERS.length, sub: `${processingOrders} đang xử lý`, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2"/></svg>, color: "#10B981", bg: "#ECFDF5", trend: "up", chartData: VISITOR_DATA.slice(-8).map(d => ({...d, v: Math.round(d.v * 0.5)})) },
                  ].map((kpi, i) => (
                    <div key={i} className="card-enter bg-white rounded-2xl p-4 card-shadow" style={{ animationDelay: `${i * 0.07}s` }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: kpi.bg, color: kpi.color }}>{kpi.icon}</div>
                        <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "#10B981" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/></svg>
                          {kpi.trend === "up" ? "Tăng" : "Giảm"}
                        </div>
                      </div>
                      <div className="stat-num font-bold text-slate-800 text-xl lg:text-2xl leading-tight" style={{ animationDelay: `${i * 0.07 + 0.15}s` }}>{kpi.value}</div>
                      <div className="text-xs text-slate-400 mt-0.5 mb-3">{kpi.label}</div>
                      <MiniChart data={kpi.chartData} color={kpi.color} height={36} />
                      <div className="text-xs mt-1.5 font-medium" style={{ color: kpi.color }}>{kpi.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Visitor chart */}
                <div className="bg-white rounded-2xl p-5 card-shadow card-enter" style={{ animationDelay: "0.28s" }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full live-dot" style={{ background: "#10B981" }} />
                        <h2 className="font-bold text-slate-800">Lượt truy cập tháng 3/2026</h2>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Theo dõi khách truy cập hàng ngày</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {[
                        { label: "Hôm nay", value: todayVisitors.toLocaleString(), color: "#FF6B2B" },
                        { label: "TB/ngày", value: avgDaily.toLocaleString(), color: "#38BDF8" },
                        { label: "Tổng tháng", value: (totalVisitors/1000).toFixed(1)+"k", color: "#A78BFA" },
                      ].map(s => (
                        <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "#F8FAFC" }}>
                          <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                          <span className="text-xs text-slate-500">{s.label}:</span>
                          <span className="text-xs font-bold" style={{ color: s.color }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <VisitorChart data={VISITOR_DATA} />

                  {/* Breakdown row */}
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
                    {[
                      { label: "Khách mới", pct: 68, color: "#FF6B2B" },
                      { label: "Quay lại", pct: 32, color: "#38BDF8" },
                      { label: "Từ Mobile", pct: 74, color: "#A78BFA" },
                    ].map(b => (
                      <div key={b.label}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-500">{b.label}</span>
                          <span className="font-semibold" style={{ color: b.color }}>{b.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.color, transition: "width 1s ease" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent + Top products row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Recent orders */}
                  <div className="bg-white rounded-2xl p-5 card-shadow card-enter" style={{ animationDelay: "0.35s" }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-800 text-sm">Đơn hàng gần đây</h3>
                      <button className="text-xs font-medium" style={{ color: "#38BDF8" }} onClick={() => setActiveTab("orders")}>Xem tất cả →</button>
                    </div>
                    <div className="space-y-3">
                      {ORDERS.slice(0, 4).map(o => (
                        <div key={o.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#FF6B2B,#38BDF8)" }}>{o.customer.charAt(0)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-700 truncate">{o.customer}</div>
                            <div className="text-xs text-slate-400 truncate">{o.service}</div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs font-bold text-slate-700">{o.amount}</div>
                            <Badge status={o.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top products */}
                  <div className="bg-white rounded-2xl p-5 card-shadow card-enter" style={{ animationDelay: "0.42s" }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-800 text-sm">Sản phẩm bán chạy</h3>
                      <button className="text-xs font-medium" style={{ color: "#38BDF8" }} onClick={() => setActiveTab("products")}>Xem tất cả →</button>
                    </div>
                    <div className="space-y-3">
                      {[...PRODUCTS].sort((a,b) => b.sold - a.sold).slice(0,4).map((p, i) => (
                        <div key={p.id} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: i === 0 ? "#FFF3EE" : i === 1 ? "#EFF6FF" : "#F8FAFC", color: i === 0 ? "#FF6B2B" : i === 1 ? "#38BDF8" : "#94A3B8" }}>
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-700 truncate">{p.name}</div>
                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1">
                              <div className="h-full rounded-full" style={{ width: `${(p.sold / PRODUCTS[0].sold) * 100}%`, background: i === 0 ? "#FF6B2B" : i === 1 ? "#38BDF8" : "#CBD5E1" }} />
                            </div>
                          </div>
                          <div className="text-xs font-bold text-slate-500 flex-shrink-0">{p.sold} bán</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════
                TAB: SẢN PHẨM
            ════════════════════════════════════════════════ */}
            {activeTab === "products" && (
              <div className="space-y-4">
                {/* Summary pills */}
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: "Tất cả", count: PRODUCTS.length, color: "#FF6B2B" },
                    { label: "Hoạt động", count: PRODUCTS.filter(p => p.status === "active").length, color: "#10B981" },
                    { label: "Tạm ẩn", count: PRODUCTS.filter(p => p.status === "inactive").length, color: "#94A3B8" },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white card-shadow text-xs">
                      <span className="font-semibold" style={{ color: s.color }}>{s.count}</span>
                      <span className="text-slate-500">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden md:block bg-white rounded-2xl card-shadow overflow-hidden">
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Mã SP</th><th>Tên sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Đã bán</th><th>Trạng thái</th><th>Thao tác</th></tr>
                      </thead>
                      <tbody>
                        {PRODUCTS.map((p, i) => (
                          <tr key={p.id} className="row-hover" style={{ animationDelay: `${i * 0.05}s` }}>
                            <td><span className="font-mono text-xs text-slate-400">{p.id}</span></td>
                            <td><span className="font-semibold text-slate-700">{p.name}</span></td>
                            <td><span className="chip" style={{ background: "#EFF6FF", color: "#38BDF8" }}>{p.category}</span></td>
                            <td><span className="font-bold" style={{ color: "#FF6B2B" }}>{p.price}</span></td>
                            <td>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-600">{p.sold}</span>
                                <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${(p.sold/48)*100}%`, background: "#FF6B2B" }} />
                                </div>
                              </div>
                            </td>
                            <td><Badge status={p.status} /></td>
                            <td>
                              <div className="flex items-center gap-1.5">
                                <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-sky-50 text-slate-400 hover:text-sky-500 transition-colors">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                                </button>
                                <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-400 transition-colors">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2"/></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-3">
                  {PRODUCTS.map(p => (
                    <div key={p.id} className="mobile-card">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-slate-700 text-sm">{p.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-xs text-slate-400">{p.id}</span>
                            <span className="chip" style={{ background: "#EFF6FF", color: "#38BDF8" }}>{p.category}</span>
                          </div>
                        </div>
                        <Badge status={p.status} />
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <div>
                          <div className="text-xs text-slate-400">Giá</div>
                          <div className="font-bold text-sm" style={{ color: "#FF6B2B" }}>{p.price}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400 text-right">Đã bán</div>
                          <div className="font-bold text-sm text-slate-600 text-right">{p.sold}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1.5 rounded-lg text-xs font-medium btn-sky text-white">Sửa</button>
                          <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-400">Xoá</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════
                TAB: TƯ VẤN
            ════════════════════════════════════════════════ */}
            {activeTab === "consult" && (
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: "Tất cả", count: CONSULTATIONS.length },
                    { label: "Chờ xử lý", count: CONSULTATIONS.filter(c=>c.status==="pending").length, alert: true },
                    { label: "Đã xác nhận", count: CONSULTATIONS.filter(c=>c.status==="confirmed").length },
                    { label: "Hoàn thành", count: CONSULTATIONS.filter(c=>c.status==="done").length },
                  ].map(s => (
                    <div key={s.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs card-shadow ${s.alert ? "bg-orange-50" : "bg-white"}`}>
                      <span className="font-semibold" style={{ color: s.alert ? "#FF6B2B" : "#64748B" }}>{s.count}</span>
                      <span className="text-slate-500">{s.label}</span>
                    </div>
                  ))}
                </div>

                <div className="hidden md:block bg-white rounded-2xl card-shadow overflow-hidden">
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Mã</th><th>Khách hàng</th><th>SĐT</th><th>Dịch vụ quan tâm</th><th>Thời gian</th><th>Ghi chú</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                      <tbody>
                        {CONSULTATIONS.map((c, i) => (
                          <tr key={c.id} className="row-hover">
                            <td><span className="font-mono text-xs text-slate-400">{c.id}</span></td>
                            <td><span className="font-semibold text-slate-700">{c.name}</span></td>
                            <td><span className="text-slate-500 text-xs">{c.phone}</span></td>
                            <td><span className="chip" style={{ background: "#FFF3EE", color: "#FF6B2B" }}>{c.service}</span></td>
                            <td><span className="text-xs text-slate-400">{c.date}</span></td>
                            <td><span className="text-xs text-slate-500 max-w-[140px] block truncate">{c.note || "—"}</span></td>
                            <td><Badge status={c.status} /></td>
                            <td>
                              <div className="flex gap-1.5">
                                {c.status === "pending" && <button className="btn-primary px-3 py-1.5 rounded-lg text-xs text-white font-medium">Xác nhận</button>}
                                <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-400 transition-colors">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2"/></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-3">
                  {CONSULTATIONS.map(c => (
                    <div key={c.id} className="mobile-card">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-slate-700 text-sm">{c.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{c.phone}</div>
                        </div>
                        <Badge status={c.status} />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="chip" style={{ background: "#FFF3EE", color: "#FF6B2B" }}>{c.service}</span>
                        <span className="text-xs text-slate-400">{c.date}</span>
                      </div>
                      {c.note && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{c.note}</p>}
                      {c.status === "pending" && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                          <button className="btn-primary flex-1 py-2 rounded-xl text-xs text-white font-semibold">✓ Xác nhận</button>
                          <button className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-400">✗ Huỷ</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════
                TAB: ĐƠN HÀNG
            ════════════════════════════════════════════════ */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Đang xử lý", count: processingOrders, color: "#FF6B2B", bg: "#FFF3EE" },
                    { label: "Hoàn thành", count: ORDERS.filter(o=>o.status==="done").length, color: "#10B981", bg: "#ECFDF5" },
                    { label: "Đã huỷ", count: ORDERS.filter(o=>o.status==="cancelled").length, color: "#EF4444", bg: "#FEF2F2" },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl p-3 lg:p-4 card-shadow text-center">
                      <div className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="hidden md:block bg-white rounded-2xl card-shadow overflow-hidden">
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Dịch vụ</th><th>Thanh toán</th><th>Tổng tiền</th><th>Ngày đặt</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                      <tbody>
                        {ORDERS.map(o => (
                          <tr key={o.id} className="row-hover">
                            <td><span className="font-mono text-xs text-slate-400">{o.id}</span></td>
                            <td><span className="font-semibold text-slate-700">{o.customer}</span></td>
                            <td><span className="text-xs text-slate-500 max-w-[160px] block truncate">{o.service}</span></td>
                            <td><span className="chip" style={{ background: "#F0FDF4", color: "#16A34A" }}>{o.payment}</span></td>
                            <td><span className="font-bold" style={{ color: "#FF6B2B" }}>{o.amount}</span></td>
                            <td><span className="text-xs text-slate-400">{o.date}</span></td>
                            <td><Badge status={o.status} /></td>
                            <td>
                              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-sky-50 text-slate-400 hover:text-sky-500">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile */}
                <div className="md:hidden space-y-3">
                  {ORDERS.map(o => (
                    <div key={o.id} className="mobile-card">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-slate-700 text-sm">{o.customer}</div>
                          <div className="font-mono text-xs text-slate-400 mt-0.5">{o.id}</div>
                        </div>
                        <Badge status={o.status} />
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1">{o.service}</div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="chip" style={{ background: "#F0FDF4", color: "#16A34A" }}>{o.payment}</span>
                          <span className="text-xs text-slate-400">{o.date}</span>
                        </div>
                        <span className="font-bold text-sm" style={{ color: "#FF6B2B" }}>{o.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════
                TAB: KHÁCH HÀNG
            ════════════════════════════════════════════════ */}
            {activeTab === "customers" && (
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: "Tổng", count: CUSTOMERS.length, color: "#64748B" },
                    { label: "Platinum", count: CUSTOMERS.filter(c=>c.tier==="platinum").length, color: "#7C3AED" },
                    { label: "Gold", count: CUSTOMERS.filter(c=>c.tier==="gold").length, color: "#D97706" },
                    { label: "Mới", count: CUSTOMERS.filter(c=>c.tier==="new").length, color: "#0EA5E9" },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white card-shadow text-xs">
                      <span className="font-semibold" style={{ color: s.color }}>{s.count}</span>
                      <span className="text-slate-500">{s.label}</span>
                    </div>
                  ))}
                </div>

                <div className="hidden md:block bg-white rounded-2xl card-shadow overflow-hidden">
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Mã KH</th><th>Tên khách hàng</th><th>Liên hệ</th><th>Đơn hàng</th><th>Tổng chi tiêu</th><th>Ngày tham gia</th><th>Hạng</th><th>Thao tác</th></tr></thead>
                      <tbody>
                        {CUSTOMERS.map(c => (
                          <tr key={c.id} className="row-hover">
                            <td><span className="font-mono text-xs text-slate-400">{c.id}</span></td>
                            <td>
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg,#FF6B2B,#38BDF8)" }}>{c.name.charAt(0)}</div>
                                <span className="font-semibold text-slate-700">{c.name}</span>
                              </div>
                            </td>
                            <td>
                              <div className="text-xs text-slate-500">{c.phone}</div>
                              <div className="text-xs text-slate-400">{c.email}</div>
                            </td>
                            <td><span className="font-bold text-slate-600">{c.orders}</span></td>
                            <td><span className="font-bold" style={{ color: "#FF6B2B" }}>{c.total}</span></td>
                            <td><span className="text-xs text-slate-400">{c.joined}</span></td>
                            <td>
                              <span className={`chip ${tierConfig[c.tier].bg} ${tierConfig[c.tier].text}`}>
                                {tierConfig[c.tier].icon} {tierConfig[c.tier].label}
                              </span>
                            </td>
                            <td>
                              <button className="btn-sky px-3 py-1.5 rounded-lg text-xs text-white font-medium">Chi tiết</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile */}
                <div className="md:hidden space-y-3">
                  {CUSTOMERS.map(c => (
                    <div key={c.id} className="mobile-card">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg,#FF6B2B,#38BDF8)" }}>{c.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-700 text-sm truncate">{c.name}</div>
                          <div className="text-xs text-slate-400">{c.phone}</div>
                        </div>
                        <span className={`chip ${tierConfig[c.tier].bg} ${tierConfig[c.tier].text}`}>
                          {tierConfig[c.tier].icon} {tierConfig[c.tier].label}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                        <div className="text-center">
                          <div className="font-bold text-slate-700">{c.orders}</div>
                          <div className="text-xs text-slate-400">Đơn hàng</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-xs" style={{ color: "#FF6B2B" }}>{c.total}</div>
                          <div className="text-xs text-slate-400">Chi tiêu</div>
                        </div>
                        <div className="text-center">
                          <button className="btn-sky px-3 py-1.5 rounded-lg text-xs text-white font-medium w-full">Chi tiết</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
}

export default ManagePage;