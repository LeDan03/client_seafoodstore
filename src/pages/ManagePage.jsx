import { useState, useEffect, useRef } from "react";
import useCategoriesStore from "../../stores/categoryStore";
import useProductStore from "../../stores/productStore";
import { uploadMultipleImages, uploadImage } from "../services/cloudinaryService";

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

const MOCK_PRODUCTS = [
  { id: "SP001", name: "Tư vấn Thiết kế Web", description: "Tư vấn và thiết kế website theo yêu cầu, tối ưu UX/UI, responsive đa thiết bị", minPrice: 4500000, maxPrice: 12000000, MOQ: 1, categoryId: "CAT001", productTypeId: "PT001", createdAt: "2026-01-10", updatedAt: "2026-02-20", images: [] },
  { id: "SP002", name: "Gói SEO 3 tháng", description: "Tối ưu SEO toàn diện: từ khóa, on-page, off-page, báo cáo hàng tuần", minPrice: 2800000, maxPrice: 5500000, MOQ: 1, categoryId: "CAT002", productTypeId: "PT002", createdAt: "2026-01-15", updatedAt: "2026-03-01", images: [] },
  { id: "SP003", name: "Thiết kế Logo + Branding", description: "Xây dựng bộ nhận diện thương hiệu hoàn chỉnh", minPrice: 3200000, maxPrice: 8000000, MOQ: 1, categoryId: "CAT003", productTypeId: "PT004", createdAt: "2026-01-20", updatedAt: "2026-02-15", images: [] },
  { id: "SP004", name: "Quản lý MXH / tháng", description: "Quản lý Facebook, Instagram, TikTok", minPrice: 1900000, maxPrice: 3500000, MOQ: 3, categoryId: "CAT002", productTypeId: "PT002", createdAt: "2026-02-01", updatedAt: "2026-03-01", images: [] },
  { id: "SP005", name: "App Mobile (iOS/Android)", description: "Phát triển ứng dụng di động native hoặc cross-platform", minPrice: 25000000, maxPrice: 80000000, MOQ: 1, categoryId: "CAT004", productTypeId: "PT001", createdAt: "2025-12-01", updatedAt: "2026-02-28", images: [] },
  { id: "SP006", name: "Landing Page Premium", description: "Thiết kế landing page chuyển đổi cao", minPrice: 5800000, maxPrice: 9500000, MOQ: 1, categoryId: "CAT001", productTypeId: "PT001", createdAt: "2026-01-25", updatedAt: "2026-03-02", images: [] },
];

const MOCK_CONSULTATIONS = [
  { id: "TV001", phone: "0912 345 678", email: "lan.nguyen@gmail.com", status: "pending", createdAt: "2026-03-02 09:15" },
  { id: "TV002", phone: "0987 654 321", email: "khoa.tran@yahoo.com", status: "done", createdAt: "2026-03-02 11:30" },
  { id: "TV003", phone: "0901 234 567", email: "", status: "done", createdAt: "2026-03-01 14:00" },
  { id: "TV004", phone: "0976 543 210", email: "bao.pham@gmail.com", status: "pending", createdAt: "2026-03-01 16:45" },
  { id: "TV005", phone: "0934 567 890", email: "", status: "cancelled", createdAt: "2026-02-29 10:00" },
];

const MOCK_ORDERS = [
  { id: "DH2603001", customer: "Nguyễn Thị Lan", service: "Tư vấn Thiết kế Web", amount: "4.500.000₫", date: "02/03/2026", status: "processing", payment: "Chuyển khoản" },
  { id: "DH2603002", customer: "Trần Minh Khoa", service: "Gói SEO 3 tháng", amount: "2.800.000₫", date: "02/03/2026", status: "done", payment: "Momo" },
  { id: "DH2602003", customer: "Công ty ABC", service: "App Mobile", amount: "25.000.000₫", date: "28/02/2026", status: "processing", payment: "Chuyển khoản" },
  { id: "DH2602004", customer: "Studio XYZ", service: "Branding", amount: "3.200.000₫", date: "27/02/2026", status: "done", payment: "VNPay" },
  { id: "DH2602005", customer: "Phạm Quốc Bảo", service: "Landing Page Premium", amount: "5.800.000₫", date: "25/02/2026", status: "cancelled", payment: "Momo" },
  { id: "DH2601006", customer: "Lê Thu Hương", service: "Quản lý MXH", amount: "1.900.000₫", date: "20/02/2026", status: "done", payment: "Chuyển khoản" },
];

const MOCK_CUSTOMERS = [
  { id: "KH001", name: "Nguyễn Thị Lan", phone: "0912 345 678", email: "lan.nguyen@gmail.com", orders: 3, total: "12.800.000₫", joined: "15/01/2026", tier: "gold" },
  { id: "KH002", name: "Trần Minh Khoa", phone: "0987 654 321", email: "khoa.tran@yahoo.com", orders: 2, total: "5.600.000₫", joined: "20/01/2026", tier: "silver" },
  { id: "KH003", name: "Công ty ABC Tech", phone: "028 1234 5678", email: "contact@abctech.vn", orders: 5, total: "48.200.000₫", joined: "05/12/2025", tier: "platinum" },
  { id: "KH004", name: "Studio XYZ", phone: "0901 111 222", email: "hello@xyz.studio", orders: 4, total: "19.500.000₫", joined: "10/12/2025", tier: "gold" },
  { id: "KH005", name: "Phạm Quốc Bảo", phone: "0976 543 210", email: "bao.pham@gmail.com", orders: 1, total: "5.800.000₫", joined: "01/03/2026", tier: "new" },
  { id: "KH006", name: "Võ Ngọc Diễm", phone: "0934 567 890", email: "diem.vo@outlook.com", orders: 2, total: "6.400.000₫", joined: "15/02/2026", tier: "silver" },
];

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  active: { label: "Hoạt động", bg: "#ECFDF5", text: "#059669", dot: "#10B981" },
  inactive: { label: "Tạm ẩn", bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" },
  pending: { label: "Chưa tư vấn", bg: "#FFFBEB", text: "#D97706", dot: "#F59E0B" },
  done: { label: "Đã tư vấn", bg: "#ECFDF5", text: "#059669", dot: "#10B981" },
  cancelled: { label: "Đã huỷ", bg: "#FEF2F2", text: "#DC2626", dot: "#EF4444" },
  processing: { label: "Đang xử lý", bg: "#FFF7ED", text: "#EA580C", dot: "#FF6B2B" },
};

const TIER_CONFIG = {
  platinum: { label: "Platinum", bg: "#F5F3FF", text: "#7C3AED", icon: "💎" },
  gold: { label: "Gold", bg: "#FFFBEB", text: "#B45309", icon: "🥇" },
  silver: { label: "Silver", bg: "#F1F5F9", text: "#475569", icon: "🥈" },
  new: { label: "Mới", bg: "#F0F9FF", text: "#0284C7", icon: "✨" },
};

const TABS = [
  { id: "stats", label: "Thống kê", shortLabel: "Thống kê", icon: "📊" },
  { id: "categories", label: "Danh mục", shortLabel: "Danh mục", icon: "🗂️" },
  { id: "producttypes", label: "Loại sản phẩm", shortLabel: "Loại SP", icon: "📦" },
  { id: "products", label: "Sản phẩm", shortLabel: "Sản phẩm", icon: "🛍️" },
  { id: "consult", label: "Tư vấn", shortLabel: "Tư vấn", icon: "💬" },
  { id: "orders", label: "Đơn hàng", shortLabel: "Đơn hàng", icon: "📋" },
  { id: "customers", label: "Khách hàng", shortLabel: "Khách", icon: "👥" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const formatPrice = (n) => n ? n.toLocaleString("vi-VN") + "₫" : "—";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  .mp, .mp * { box-sizing: border-box; }
  .mp { text-align: left; font-family: 'Plus Jakarta Sans', sans-serif; }
  .mp button, .mp input, .mp textarea, .mp select { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes mp-fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes mp-slideUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes mp-slideLeft { from{opacity:0;transform:translateX(-100%)} to{opacity:1;transform:translateX(0)} }
  @keyframes mp-pulse     { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes mp-scaleIn   { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }

  .mp-overlay  { animation: mp-fadeIn .18s ease; }
  .mp-drawer   { animation: mp-slideLeft .22s cubic-bezier(.4,0,.2,1); }
  .mp-card     { animation: mp-slideUp .35s ease both; }
  .mp-modal-in { animation: mp-scaleIn .2s ease; }
  .mp-live     { animation: mp-pulse 2s ease-in-out infinite; }

  .mp table { border-collapse: collapse; width: 100%; min-width: 480px; }
  .mp th { padding:10px 14px; font-size:11px; font-weight:600; color:#94A3B8; text-transform:uppercase; letter-spacing:.06em; background:#F8FAFC; text-align:left; white-space:nowrap; }
  .mp td { padding:13px 14px; font-size:13px; color:#334155; border-bottom:1px solid #F1F5F9; vertical-align:middle; }
  .mp tbody tr:last-child td { border-bottom:none; }
  .mp-tr { transition:background .12s; cursor:default; }
  .mp-tr:hover { background:#F8FAFC; }

  .mp-input { width:100%; padding:10px 13px; border-radius:10px; border:1.5px solid #E2E8F0; font-size:13px; color:#334155; outline:none; transition:border-color .15s, box-shadow .15s; background:white; }
  .mp-input:focus { border-color:#38BDF8; box-shadow:0 0 0 3px rgba(56,189,248,.12); }
  .mp-input::placeholder { color:#94A3B8; }
  .mp-select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:32px; }

  .mp-chip { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:500; white-space:nowrap; }
  .mp-mono { font-family:'DM Mono',monospace; font-size:12px; color:#94A3B8; }

  .mp-btn { display:inline-flex; align-items:center; justify-content:center; gap:7px; border:none; border-radius:10px; font-weight:600; cursor:pointer; transition:transform .2s, box-shadow .2s; font-family:'Plus Jakarta Sans',sans-serif; }
  .mp-btn:active { transform:scale(.97); }
  .mp-btn-primary { background:linear-gradient(135deg,#FF6B2B,#F97316); color:white; box-shadow:0 4px 14px rgba(255,107,43,.28); }
  .mp-btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(255,107,43,.38); }
  .mp-btn-sky { background:linear-gradient(135deg,#38BDF8,#0EA5E9); color:white; box-shadow:0 3px 10px rgba(56,189,248,.2); }
  .mp-btn-sky:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(56,189,248,.35); }
  .mp-btn-ghost { background:transparent; color:#94A3B8; }
  .mp-btn-ghost:hover { background:#F1F5F9; color:#64748B; }
  .mp-btn-danger { background:#FEF2F2; color:#EF4444; }
  .mp-btn-danger:hover { background:#FEE2E2; }
  .mp-btn-outline { background:white; color:#64748B; border:1.5px solid #E2E8F0; }
  .mp-btn-outline:hover { border-color:#CBD5E1; }

  .mp-icon-btn { width:32px; height:32px; border-radius:8px; padding:0; }

  .mp-card-box { background:white; border-radius:16px; box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 16px rgba(0,0,0,.04); }
  .mp-mcard { background:white; border-radius:14px; padding:14px 16px; box-shadow:0 1px 3px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.04); }

  .mp-scroll::-webkit-scrollbar { width:4px; height:4px; }
  .mp-scroll::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:4px; }
  .mp-noscroll::-webkit-scrollbar { display:none; }

  .mp-tab-pill { position:relative; }
  .mp-tab-pill.active::after { content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:18px; height:3px; background:linear-gradient(90deg,#FF6B2B,#38BDF8); border-radius:2px 2px 0 0; }

  .mp-notif-panel { animation:mp-slideUp .18s ease; }
  .mp-search:focus { border-color:#38BDF8; box-shadow:0 0 0 3px rgba(56,189,248,.1); outline:none; }

  /* Swipe-friendly tap targets on mobile */
  @media (max-width: 768px) {
    .mp td { padding:11px 12px; }
    .mp-mcard { padding:14px; }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// ATOMIC COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Badge = ({ status }) => {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className="mp-chip" style={{ background: c.bg, color: c.text }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block", flexShrink: 0 }} />
      {c.label}
    </span>
  );
};

const Field = ({ label, children, half }) => (
  <div style={{ marginBottom: 14, width: half ? "calc(50% - 6px)" : "100%" }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 5 }}>{label}</label>
    {children}
  </div>
);

const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
    <div className="mp-overlay" style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.5)", backdropFilter: "blur(4px)" }} onClick={onCancel} />
    <div className="mp-modal-in" style={{ position: "relative", background: "white", borderRadius: 18, padding: 24, maxWidth: 340, width: "100%", boxShadow: "0 8px 40px rgba(0,0,0,.18)", zIndex: 1, textAlign: "center" }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 24 }}>🗑️</div>
      <p style={{ margin: "0 0 20px", fontSize: 14, color: "#334155", lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="mp-btn mp-btn-outline" style={{ flex: 1, padding: "10px" }} onClick={onCancel}>Huỷ</button>
        <button className="mp-btn mp-btn-danger" style={{ flex: 1, padding: "10px", fontWeight: 700 }} onClick={onConfirm}>Xoá</button>
      </div>
    </div>
  </div>
);

const Modal = ({ title, onClose, children, wide }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0" }} className="sm-center">
    <div className="mp-overlay" style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
    <div className="mp-modal-in" style={{
      position: "relative", background: "white", zIndex: 1, width: "100%",
      maxWidth: wide ? 620 : 480, maxHeight: "92vh", overflowY: "auto",
      borderRadius: "20px 20px 0 0",
      boxShadow: "0 -4px 40px rgba(0,0,0,.15)",
    }}>
      {/* drag handle */}
      <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E2E8F0", margin: "12px auto 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 0" }}>
        <h3 style={{ margin: 0, fontWeight: 700, color: "#1E293B", fontSize: 16 }}>{title}</h3>
        <button className="mp-btn mp-btn-ghost mp-icon-btn" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div style={{ padding: "16px 20px 24px" }}>{children}</div>
    </div>
    <style>{`@media(min-width:640px){ .sm-center{ align-items:center; padding:20px; } .sm-center > div:last-child{ border-radius:20px; } }`}</style>
  </div>
);

// ─── MINI CHART ───────────────────────────────────────────────────────────────
const MiniChart = ({ data, color = "#FF6B2B", height = 36 }) => {
  const max = Math.max(...data.map(d => d.v));
  const min = Math.min(...data.map(d => d.v));
  const w = 120, h = height;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.v - min) / (max - min || 1)) * (h - 6) - 3;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${h} ${pts} ${w},${h}`;
  const gid = `g${color.replace("#", "")}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── VISITOR CHART ────────────────────────────────────────────────────────────
const VisitorChart = ({ data }) => {
  const [tooltip, setTooltip] = useState(null);
  const max = Math.max(...data.map(d => d.v));
  const W = 700, H = 180, PAD = { t: 16, b: 32, l: 44, r: 16 };
  const cw = W - PAD.l - PAD.r, ch = H - PAD.t - PAD.b;
  const pts = data.map((d, i) => ({ x: PAD.l + (i / (data.length - 1)) * cw, y: PAD.t + (1 - d.v / max) * ch, ...d }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `M${pts[0].x},${PAD.t + ch} ${pts.map(p => `L${p.x},${p.y}`).join(" ")} L${pts[pts.length - 1].x},${PAD.t + ch} Z`;
  const gridLines = [0, .25, .5, .75, 1].map(f => Math.round(max * (1 - f)));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", maxHeight: 200, minWidth: 280, display: "block" }} onMouseLeave={() => setTooltip(null)}>
      <defs>
        <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF6B2B" stopOpacity=".22" /><stop offset="100%" stopColor="#FF6B2B" stopOpacity="0" /></linearGradient>
        <linearGradient id="lGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#38BDF8" /><stop offset="50%" stopColor="#FF6B2B" /><stop offset="100%" stopColor="#FB923C" /></linearGradient>
      </defs>
      {gridLines.map((val, i) => { const y = PAD.t + (i / 4) * ch; return (<g key={i}><line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="#F1F5F9" strokeWidth="1" /><text x={PAD.l - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#94A3B8">{val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}</text></g>); })}
      {pts.filter((_, i) => i % 4 === 0 || i === pts.length - 1).map((p, i) => <text key={i} x={p.x} y={H - 6} textAnchor="middle" fontSize="9" fill="#94A3B8">{p.day}</text>)}
      <path d={area} fill="url(#vGrad)" />
      <path d={path} fill="none" stroke="url(#lGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i} onMouseEnter={() => setTooltip(p)} style={{ cursor: "pointer" }}>
          <circle cx={p.x} cy={p.y} r="10" fill="transparent" />
          <circle cx={p.x} cy={p.y} r={tooltip?.day === p.day ? 4 : 2.5} fill={tooltip?.day === p.day ? "#FF6B2B" : "#fff"} stroke={tooltip?.day === p.day ? "#FF6B2B" : "#CBD5E1"} strokeWidth="1.5" style={{ transition: "r .12s" }} />
        </g>
      ))}
      {tooltip && (() => { const tx = Math.min(Math.max(tooltip.x, 60), W - 60), ty = tooltip.y - 36; return (<g><rect x={tx - 36} y={ty} width={72} height={26} rx={6} fill="#1E293B" /><text x={tx} y={ty + 11} textAnchor="middle" fontSize="9" fill="#94A3B8">Ngày {tooltip.day}</text><text x={tx} y={ty + 22} textAnchor="middle" fontSize="10" fill="white" fontWeight="600">{tooltip.v.toLocaleString()} lượt</text></g>); })()}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// ─── STATS TAB ────────────────────────────────────────────────────────────────
const StatsTab = ({ consultations, setActiveTab }) => {
  const totalVisitors = VISITOR_DATA.reduce((s, d) => s + d.v, 0);
  const avgDaily = Math.round(totalVisitors / VISITOR_DATA.length);
  const todayVisitors = VISITOR_DATA[VISITOR_DATA.length - 1].v;
  const growth = Math.round(((VISITOR_DATA[29].v - VISITOR_DATA[0].v) / VISITOR_DATA[0].v) * 100);
  const pendingConsult = consultations.filter(c => c.status === "pending").length;
  const processingOrders = MOCK_ORDERS.filter(o => o.status === "processing").length;

  const kpis = [
    { label: "Lượt truy cập", value: totalVisitors.toLocaleString(), sub: `+${growth}% tháng này`, color: "#38BDF8", bg: "#EFF6FF", data: VISITOR_DATA.slice(-8) },
    { label: "Doanh thu tháng", value: "68.600.000₫", sub: "6 đơn hoàn thành", color: "#FF6B2B", bg: "#FFF3EE", data: VISITOR_DATA.slice(-8).map(d => ({ ...d, v: d.v * .8 | 0 })) },
    { label: "Yêu cầu tư vấn", value: consultations.length, sub: `${pendingConsult} chưa xử lý`, color: "#A78BFA", bg: "#F5F3FF", data: VISITOR_DATA.slice(-8).map(d => ({ ...d, v: d.v * .3 | 0 })) },
    { label: "Đơn hàng tháng", value: MOCK_ORDERS.length, sub: `${processingOrders} đang xử lý`, color: "#10B981", bg: "#ECFDF5", data: VISITOR_DATA.slice(-8).map(d => ({ ...d, v: d.v * .5 | 0 })) },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
        {kpis.map((k, i) => (
          <div key={i} className="mp-card mp-card-box" style={{ padding: 16, animationDelay: `${i * .07}s` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {["👥", "💰", "💬", "📋"][i]}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#10B981" }}>↑ Tăng</span>
            </div>
            <div style={{ fontWeight: 800, color: "#1E293B", fontSize: 20, lineHeight: 1.2 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2, marginBottom: 10 }}>{k.label}</div>
            <MiniChart data={k.data} color={k.color} />
            <div style={{ fontSize: 11, marginTop: 5, fontWeight: 600, color: k.color }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Visitor chart */}
      <div className="mp-card mp-card-box" style={{ padding: 20, animationDelay: ".28s" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="mp-live" style={{ width: 8, height: 8, borderRadius: "50%", background: "#34D399" }} />
              <span style={{ fontWeight: 700, color: "#1E293B", fontSize: 14 }}>Lượt truy cập tháng 3/2026</span>
            </div>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94A3B8" }}>Theo dõi khách truy cập hàng ngày</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[["Hôm nay", todayVisitors.toLocaleString(), "#FF6B2B"], ["TB/ngày", avgDaily.toLocaleString(), "#38BDF8"], ["Tổng", (totalVisitors / 1000).toFixed(1) + "k", "#A78BFA"]].map(([l, v, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 9, background: "#F8FAFC", fontSize: 12 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
                <span style={{ color: "#64748B" }}>{l}:</span>
                <span style={{ fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <VisitorChart data={VISITOR_DATA} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 16, paddingTop: 16, borderTop: "1px solid #F1F5F9" }}>
          {[["Khách mới", 68, "#FF6B2B"], ["Quay lại", 32, "#38BDF8"], ["Từ Mobile", 74, "#A78BFA"]].map(([l, p, c]) => (
            <div key={l}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: "#64748B" }}>{l}</span>
                <span style={{ fontWeight: 600, color: c }}>{p}%</span>
              </div>
              <div style={{ height: 5, borderRadius: 999, background: "#E2E8F0" }}>
                <div style={{ width: `${p}%`, height: "100%", borderRadius: 999, background: c }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders + top products */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        <div className="mp-card mp-card-box" style={{ padding: 18, animationDelay: ".35s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontWeight: 700, color: "#1E293B", fontSize: 14 }}>Đơn hàng gần đây</span>
            <button className="mp-btn mp-btn-ghost" style={{ fontSize: 12, fontWeight: 500, color: "#38BDF8", padding: "4px 8px" }} onClick={() => setActiveTab("orders")}>Xem tất cả →</button>
          </div>
          {MOCK_ORDERS.slice(0, 4).map(o => (
            <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 0", borderBottom: "1px solid #F8FAFC" }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#FF6B2B,#38BDF8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0 }}>{o.customer.charAt(0)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.customer}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.service}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 3 }}>{o.amount}</div>
                <Badge status={o.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── CATEGORIES TAB ───────────────────────────────────────────────────────────
const CategoriesTab = ({ categories, products, addCategory, removeCategory, openModal }) => {
  const [confirm, setConfirm] = useState(null);
  const handleDelete = (cat) => {
    setConfirm({
      message: `Xoá danh mục "${cat.name}"? Thao tác này không thể hoàn tác.`,
      onConfirm: () => { removeCategory(cat.id); setConfirm(null); },
    });
  };

  const countProducts = (id) => products.filter(p => p.categoryId === id).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}

      {/* Summary pill */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <div className="mp-chip" style={{ background: "white", color: "#FF6B2B", fontSize: 12, padding: "6px 14px", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
          <strong>{categories.length}</strong>&nbsp;danh mục
        </div>
      </div>

      {/* Mobile cards (always visible on small screens) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {categories.map((cat, i) => {
          const cnt = countProducts(cat.id);
          return (
            <div key={cat.id} className="mp-mcard mp-card" style={{ animationDelay: `${i * .05}s` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#FFF3EE,#EFF6FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🗂️</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 14 }}>{cat.name}</div>
                  <div className="mp-mono" style={{ marginTop: 2 }}>{cat.id}</div>
                </div>
                <span className="mp-chip" style={{ background: cnt > 0 ? "#EFF6FF" : "#F1F5F9", color: cnt > 0 ? "#38BDF8" : "#94A3B8", flexShrink: 0 }}>{cnt} SP</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
                <button className="mp-btn mp-btn-sky" style={{ flex: 1, padding: "9px", fontSize: 13 }} onClick={() => openModal("category", "edit", { ...cat })}>✏️ Sửa</button>
                <button className="mp-btn mp-btn-danger" style={{ flex: 1, padding: "9px", fontSize: 13 }} onClick={() => handleDelete(cat)}>🗑️ Xoá</button>
              </div>
            </div>
          );
        })}

        {categories.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#94A3B8", fontSize: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🗂️</div>
            Chưa có danh mục nào. Thêm mới ngay!
          </div>
        )}
      </div>
    </div>
  );
};

// ─── PRODUCT TYPES TAB ────────────────────────────────────────────────────────
const ProductTypesTab = ({ productTypes, products, addProductType, removeProductType, openModal }) => {
  const [confirm, setConfirm] = useState(null);

  const handleDelete = (pt) => {
    setConfirm({
      message: `Xoá loại sản phẩm "${pt.name}"? Thao tác này không thể hoàn tác.`,
      onConfirm: () => { removeProductType(pt.id); setConfirm(null); },
    });
  };

  const countProducts = (id) => products.filter(p => p.productTypeId === id).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}

      <div style={{ display: "flex", gap: 8 }}>
        <div className="mp-chip" style={{ background: "white", color: "#A78BFA", fontSize: 12, padding: "6px 14px", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
          <strong>{productTypes.length}</strong>&nbsp;loại sản phẩm
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {productTypes.map((pt, i) => {
          const cnt = countProducts(pt.id);
          return (
            <div key={pt.id} className="mp-mcard mp-card" style={{ animationDelay: `${i * .05}s` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📦</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 14 }}>{pt.name}</div>
                    <span className="mp-chip" style={{ background: cnt > 0 ? "#F5F3FF" : "#F1F5F9", color: cnt > 0 ? "#A78BFA" : "#94A3B8" }}>{cnt} SP</span>
                  </div>
                  <div className="mp-mono" style={{ marginTop: 2 }}>{pt.id}</div>
                  {pt.description && (
                    <p style={{ fontSize: 12, color: "#64748B", margin: "6px 0 0", lineHeight: 1.55 }}>{pt.description}</p>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
                <button className="mp-btn mp-btn-sky" style={{ flex: 1, padding: "9px", fontSize: 13 }} onClick={() => openModal("producttype", "edit", { ...pt })}>✏️ Sửa</button>
                <button className="mp-btn mp-btn-danger" style={{ flex: 1, padding: "9px", fontSize: 13 }} onClick={() => handleDelete(pt)}>🗑️ Xoá</button>
              </div>
            </div>
          );
        })}

        {productTypes.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#94A3B8", fontSize: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📦</div>
            Chưa có loại sản phẩm nào. Thêm mới ngay!
          </div>
        )}
      </div>
    </div>
  );
};

// ─── PRODUCTS TAB ─────────────────────────────────────────────────────────────
const ProductsTab = ({ products, setProducts, categories, productTypes, openModal }) => {
  const [confirm, setConfirm] = useState(null);
  const [filterCat, setFilterCat] = useState("all");

  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || "—";
  const getTypeName = (id) => productTypes.find(t => t.id === id)?.name || "—";

  const filtered = filterCat === "all" ? products : products.filter(p => p.categoryId === filterCat);

  const handleDelete = (p) => setConfirm({
    message: `Xoá sản phẩm "${p.name}"?`,
    onConfirm: () => { setProducts(prev => prev.filter(x => x.id !== p.id)); setConfirm(null); },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[{ id: "all", name: `Tất cả (${products.length})` }, ...categories.map(c => ({ id: c.id, name: `${c.name} (${products.filter(p => p.categoryId === c.id).length})` }))].map(c => (
          <button key={c.id} onClick={() => setFilterCat(c.id)} className="mp-btn" style={{ padding: "6px 14px", fontSize: 12, fontWeight: filterCat === c.id ? 700 : 400, background: filterCat === c.id ? "linear-gradient(135deg,#FF6B2B,#F97316)" : "white", color: filterCat === c.id ? "white" : "#64748B", boxShadow: "0 1px 3px rgba(0,0,0,.06)", borderRadius: 10 }}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Mobile cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((p, i) => (
          <div key={p.id} className="mp-mcard mp-card" style={{ animationDelay: `${i * .04}s` }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 11, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#FFF3EE,#EFF6FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🛍️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 14, lineHeight: 1.3 }}>{p.name}</div>
                <div className="mp-mono" style={{ marginTop: 2 }}>{p.id}</div>
              </div>
            </div>

            {p.description && <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 10px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</p>}

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              <span className="mp-chip" style={{ background: "#EFF6FF", color: "#38BDF8" }}>{getCategoryName(p.categoryId)}</span>
              <span className="mp-chip" style={{ background: "#F5F3FF", color: "#A78BFA" }}>{getTypeName(p.productTypeId)}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, paddingTop: 10, borderTop: "1px solid #F1F5F9" }}>
              <div>
                <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 2 }}>Giá từ</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#FF6B2B" }}>{formatPrice(p.minPrice)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 2 }}>Đến</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#64748B" }}>{formatPrice(p.maxPrice)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 2 }}>MOQ</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#475569" }}>{p.MOQ}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="mp-btn mp-btn-sky" style={{ flex: 1, padding: "9px", fontSize: 13 }} onClick={() => openModal("product", "edit", { ...p })}>✏️ Sửa</button>
              <button className="mp-btn mp-btn-danger" style={{ flex: 1, padding: "9px", fontSize: 13 }} onClick={() => handleDelete(p)}>🗑️ Xoá</button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#94A3B8", fontSize: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🛍️</div>
            Không tìm thấy sản phẩm nào.
          </div>
        )}
      </div>
    </div>
  );
};

// ─── CONSULT TAB ──────────────────────────────────────────────────────────────
const ConsultTab = ({ consultations, setConsultations }) => {
  const [confirm, setConfirm] = useState(null);

  const updateStatus = (id, status) => setConsultations(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  const handleDelete = (c) => setConfirm({
    message: `Xoá yêu cầu ${c.id}?`,
    onConfirm: () => { setConsultations(prev => prev.filter(x => x.id !== c.id)); setConfirm(null); },
  });

  const tabs = [
    { label: "Tất cả", count: consultations.length, filter: null },
    { label: "Chưa TV", count: consultations.filter(c => c.status === "pending").length, filter: "pending", alert: true },
    { label: "Đã TV", count: consultations.filter(c => c.status === "done").length, filter: "done" },
    { label: "Huỷ", count: consultations.filter(c => c.status === "cancelled").length, filter: "cancelled" },
  ];
  const [activeFilter, setActiveFilter] = useState(null);
  const filtered = activeFilter ? consultations.filter(c => c.status === activeFilter) : consultations;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.label} onClick={() => setActiveFilter(t.filter)} className="mp-btn" style={{ padding: "6px 14px", fontSize: 12, fontWeight: activeFilter === t.filter ? 700 : 400, background: activeFilter === t.filter ? (t.alert ? "linear-gradient(135deg,#FF6B2B,#F97316)" : "linear-gradient(135deg,#38BDF8,#0EA5E9)") : (t.alert && t.count > 0 ? "#FFF3EE" : "white"), color: activeFilter === t.filter ? "white" : (t.alert && t.count > 0 ? "#FF6B2B" : "#64748B"), boxShadow: "0 1px 3px rgba(0,0,0,.06)", borderRadius: 10 }}>
            {t.label} <span style={{ fontWeight: 700 }}>{t.count}</span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((c, i) => (
          <div key={c.id} className="mp-mcard mp-card" style={{ animationDelay: `${i * .04}s`, borderLeft: c.status === "pending" ? "3px solid #FF6B2B" : "3px solid transparent" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 15 }}>{c.phone}</div>
                <div style={{ fontSize: 12, color: c.email ? "#64748B" : "#CBD5E1", marginTop: 3 }}>{c.email || "Không có email"}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                  <span className="mp-mono">{c.id}</span>
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>{c.createdAt}</span>
                </div>
              </div>
              <Badge status={c.status} />
            </div>

            {c.status === "pending" && (
              <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
                <button className="mp-btn mp-btn-primary" style={{ flex: 1, padding: "10px", fontSize: 13 }} onClick={() => updateStatus(c.id, "done")}>✅ Đã tư vấn</button>
                <button className="mp-btn mp-btn-danger" style={{ flex: 1, padding: "10px", fontSize: 13 }} onClick={() => updateStatus(c.id, "cancelled")}>✖ Huỷ</button>
              </div>
            )}

            <button className="mp-btn mp-btn-ghost mp-icon-btn" style={{ position: "absolute", top: 14, right: 14, opacity: .6 }} onClick={() => handleDelete(c)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── ORDERS TAB ───────────────────────────────────────────────────────────────
const OrdersTab = () => {
  const processingOrders = MOCK_ORDERS.filter(o => o.status === "processing").length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {[["Đang xử lý", processingOrders, "#FF6B2B"], ["Hoàn thành", MOCK_ORDERS.filter(o => o.status === "done").length, "#10B981"], ["Đã huỷ", MOCK_ORDERS.filter(o => o.status === "cancelled").length, "#EF4444"]].map(([l, v, c]) => (
          <div key={l} className="mp-card-box" style={{ padding: "14px 12px", textAlign: "center", borderRadius: 14 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: c }}>{v}</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MOCK_ORDERS.map((o, i) => (
          <div key={o.id} className="mp-mcard mp-card" style={{ animationDelay: `${i * .04}s`, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 14 }}>{o.customer}</div>
                <div className="mp-mono" style={{ marginTop: 2 }}>{o.id}</div>
              </div>
              <Badge status={o.status} />
            </div>
            <div style={{ fontSize: 12, color: "#64748B", marginBottom: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.service}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className="mp-chip" style={{ background: "#F0FDF4", color: "#16A34A" }}>{o.payment}</span>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>{o.date}</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#FF6B2B" }}>{o.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── CUSTOMERS TAB ────────────────────────────────────────────────────────────
const CustomersTab = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {[["Tổng", MOCK_CUSTOMERS.length, "#64748B"], ["Platinum", MOCK_CUSTOMERS.filter(c => c.tier === "platinum").length, "#7C3AED"], ["Gold", MOCK_CUSTOMERS.filter(c => c.tier === "gold").length, "#D97706"], ["Mới", MOCK_CUSTOMERS.filter(c => c.tier === "new").length, "#0EA5E9"]].map(([l, v, c]) => (
        <div key={l} className="mp-chip" style={{ background: "white", color: c, fontSize: 12, padding: "6px 14px", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
          <strong>{v}</strong>&nbsp;{l}
        </div>
      ))}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {MOCK_CUSTOMERS.map((c, i) => {
        const tier = TIER_CONFIG[c.tier];
        return (
          <div key={c.id} className="mp-mcard mp-card" style={{ animationDelay: `${i * .04}s` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B2B,#38BDF8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "white", flexShrink: 0 }}>{c.name.charAt(0)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>{c.phone}</div>
              </div>
              <span className="mp-chip" style={{ background: tier.bg, color: tier.text, flexShrink: 0 }}>{tier.icon} {tier.label}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: "#334155", fontSize: 18 }}>{c.orders}</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>Đơn hàng</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: "#FF6B2B" }}>{c.total}</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>Chi tiêu</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <button className="mp-btn mp-btn-sky" style={{ width: "100%", padding: "7px 0", fontSize: 12 }}>Chi tiết</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// FORM MODALS
// ═══════════════════════════════════════════════════════════════════════════
const CategoryModal = ({ mode, data, onClose, onSave }) => {
  const [form, setForm] = useState(data || { name: "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <Modal title={mode === "add" ? "➕ Thêm danh mục" : "✏️ Sửa danh mục"} onClose={onClose}>
      <Field label="Tên danh mục *">
        <input className="mp-input" value={form.name || ""} onChange={e => set("name", e.target.value)} placeholder="Bạch tuộc" autoFocus />
      </Field>
      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button className="mp-btn mp-btn-outline" style={{ flex: 1, padding: "11px" }} onClick={onClose}>Huỷ</button>
        <button className="mp-btn mp-btn-primary" style={{ flex: 2, padding: "11px", fontSize: 14 }} onClick={() => onSave(form)} disabled={!form.name?.trim()}>
          {mode === "add" ? "Thêm mới" : "Lưu thay đổi"}
        </button>
      </div>
    </Modal>
  );
};

const ProductTypeModal = ({ mode, data, onClose, onSave }) => {
  const [form, setForm] = useState(data || { name: "", description: "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <Modal title={mode === "add" ? "➕ Thêm loại sản phẩm" : "✏️ Sửa loại sản phẩm"} onClose={onClose}>
      <Field label="Tên loại sản phẩm *">
        <input className="mp-input" value={form.name || ""} onChange={e => set("name", e.target.value)} placeholder="VD: ĐÔNG LẠNH" autoFocus />
      </Field>
      <Field label="Mô tả">
        <textarea className="mp-input" value={form.description || ""} onChange={e => set("description", e.target.value)} placeholder="Mô tả ngắn..." style={{ minHeight: 84, resize: "vertical" }} />
      </Field>
      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button className="mp-btn mp-btn-outline" style={{ flex: 1, padding: "11px" }} onClick={onClose}>Huỷ</button>
        <button className="mp-btn mp-btn-primary" style={{ flex: 2, padding: "11px", fontSize: 14 }} onClick={() => onSave(form)} disabled={!form.name?.trim()}>
          {mode === "add" ? "Thêm mới" : "Lưu thay đổi"}
        </button>
      </div>
    </Modal>
  );
};

const ProductModal = ({ mode, data, categories, productTypes, onClose, onSave }) => {
  const [form, setForm] = useState(data || { name: "", description: "", minPrice: "", maxPrice: "", MOQ: 1, categoryId: categories[0]?.id || "", productTypeId: productTypes[0]?.id || "", images: [] });
  const [imageFiles, setImageFiles] = useState([]); // { file, preview, status: "pending"|"uploading"|"done"|"error", result?: {secureUrl, publicId} }
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const MAX_IMAGES = 3;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const remaining = MAX_IMAGES - imageFiles.length;
    if (remaining <= 0) return;

    const toAdd = selected.slice(0, remaining).map(file => ({
      id: `${Date.now()}_${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
      result: null,
    }));
    setImageFiles(prev => [...prev, ...toAdd]);
    // reset input so same file can be re-selected if removed
    e.target.value = "";
  };

  const removeImage = (id) => {
    setImageFiles(prev => {
      const item = prev.find(f => f.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  const handleSave = async () => {
    // Upload pending images first
    const pending = imageFiles.filter(f => f.status === "pending");
    let uploadedImages = imageFiles.filter(f => f.status === "done").map(f => f.result);

    if (pending.length > 0) {
      setIsUploading(true);

      // Mark all pending as uploading
      setImageFiles(prev => prev.map(f => f.status === "pending" ? { ...f, status: "uploading" } : f));

      const results = await Promise.allSettled(
        pending.map(item => uploadImage(item.file).then(result => ({ id: item.id, result })))
      );

      const newUploaded = [];
      const updatedFiles = [...imageFiles];

      results.forEach(res => {
        if (res.status === "fulfilled") {
          const { id, result } = res.value;
          const idx = updatedFiles.findIndex(f => f.id === id);
          if (idx !== -1) updatedFiles[idx] = { ...updatedFiles[idx], status: "done", result };
          newUploaded.push(result);
        } else {
          // mark error — find by order in pending array
          const failedId = pending[results.indexOf(res)]?.id;
          const idx = updatedFiles.findIndex(f => f.id === failedId);
          if (idx !== -1) updatedFiles[idx] = { ...updatedFiles[idx], status: "error" };
        }
      });

      setImageFiles(updatedFiles);
      setIsUploading(false);

      // If any upload failed, stop — let user retry or remove
      const hasError = results.some(r => r.status === "rejected");
      if (hasError) {
        toast.error("Một số ảnh tải lên thất bại. Vui lòng thử lại hoặc xóa ảnh lỗi.");
        return;
      }

      uploadedImages = [...uploadedImages, ...newUploaded];
    }

    onSave({
      ...form,
      minPrice: Number(form.minPrice),
      maxPrice: Number(form.maxPrice),
      MOQ: Number(form.MOQ),
      categoryId: Number(form.categoryId),
      productTypeId: Number(form.productTypeId),
      imageRequests: uploadedImages
    });
  };

  const canSave = form.name?.trim() && !isUploading;

  return (
    <Modal title={mode === "add" ? "➕ Thêm sản phẩm" : "✏️ Sửa sản phẩm"} onClose={onClose} wide>
      <Field label="Tên sản phẩm *">
        <input className="mp-input" value={form.name || ""} onChange={e => set("name", e.target.value)} placeholder="Tên sản phẩm / dịch vụ" autoFocus />
      </Field>
      <Field label="Mô tả">
        <textarea className="mp-input" value={form.description || ""} onChange={e => set("description", e.target.value)} placeholder="Mô tả chi tiết..." style={{ minHeight: 72, resize: "vertical" }} />
      </Field>

      {/* ── IMAGE UPLOAD ── */}
      <Field label={`Hình ảnh sản phẩm (tối đa ${MAX_IMAGES} ảnh)`}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>

          {/* Existing + newly added previews */}
          {imageFiles.map(item => (
            <div key={item.id} style={{ position: "relative", width: 86, height: 86, borderRadius: 10, overflow: "hidden", border: `2px solid ${item.status === "error" ? "#FCA5A5" : item.status === "done" ? "#6EE7B7" : "#E2E8F0"}`, flexShrink: 0 }}>
              <img src={item.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

              {/* Uploading overlay */}
              {item.status === "uploading" && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ animation: "mp-spin 1s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2.5" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                  </svg>
                </div>
              )}

              {/* Done badge */}
              {item.status === "done" && (
                <div style={{ position: "absolute", bottom: 4, right: 4, width: 18, height: 18, borderRadius: "50%", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              )}

              {/* Error badge */}
              {item.status === "error" && (
                <div style={{ position: "absolute", bottom: 4, right: 4, width: 18, height: 18, borderRadius: "50%", background: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="3" strokeLinecap="round" /></svg>
                </div>
              )}

              {/* Remove button — only when not uploading */}
              {item.status !== "uploading" && (
                <button
                  type="button"
                  onClick={() => removeImage(item.id)}
                  style={{ position: "absolute", top: 3, right: 3, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,.55)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="3" strokeLinecap="round" /></svg>
                </button>
              )}
            </div>
          ))}

          {/* Add button — only if under limit */}
          {imageFiles.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ width: 86, height: 86, borderRadius: 10, border: "2px dashed #CBD5E1", background: "#F8FAFC", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, color: "#94A3B8", fontSize: 11, flexShrink: 0, transition: "border-color .2s, background .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF6B2B"; e.currentTarget.style.background = "#FFF7F4"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#CBD5E1"; e.currentTarget.style.background = "#F8FAFC"; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" /></svg>
              <span>Thêm ảnh</span>
              <span style={{ fontSize: 10, color: "#CBD5E1" }}>{imageFiles.length}/{MAX_IMAGES}</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {imageFiles.length > 0 && (
          <p style={{ margin: "6px 0 0", fontSize: 11, color: "#94A3B8" }}>
            Ảnh sẽ được tải lên Cloudinary khi bạn lưu sản phẩm.
          </p>
        )}
      </Field>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Field label="Giá thấp nhất (₫)" half>
          <input className="mp-input" type="number" value={form.minPrice || ""} onChange={e => set("minPrice", e.target.value)} placeholder="0" />
        </Field>
        <Field label="Giá cao nhất (₫)" half>
          <input className="mp-input" type="number" value={form.maxPrice || ""} onChange={e => set("maxPrice", e.target.value)} placeholder="0" />
        </Field>
        <Field label="MOQ" half>
          <input className="mp-input" type="number" value={form.MOQ || 1} onChange={e => set("MOQ", e.target.value)} placeholder="1" />
        </Field>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Field label="Danh mục" half>
          <select className="mp-input mp-select" value={form.categoryId || ""} onChange={e => set("categoryId", e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Loại sản phẩm" half>
          <select className="mp-input mp-select" value={form.productTypeId || ""} onChange={e => set("productTypeId", e.target.value)}>
            {productTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </Field>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button className="mp-btn mp-btn-outline" style={{ flex: 1, padding: "11px" }} onClick={onClose} disabled={isUploading}>Huỷ</button>
        <button
          className="mp-btn mp-btn-primary"
          style={{ flex: 2, padding: "11px", fontSize: 14 }}
          onClick={handleSave}
          disabled={!canSave}
        >
          {isUploading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "mp-spin 1s linear infinite" }}>
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2.5" strokeDasharray="31.4 31.4" strokeLinecap="round" />
              </svg>
              Đang tải ảnh...
            </span>
          ) : (
            mode === "add" ? "Thêm mới" : "Lưu thay đổi"
          )}
        </button>
      </div>

      {/* Spinner keyframe — injected locally to avoid global pollution */}
      <style>{`@keyframes mp-spin { to { transform: rotate(360deg); } }`}</style>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR & TOPBAR
// ═══════════════════════════════════════════════════════════════════════════
const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
    <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#FF6B2B,#F97316)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(255,107,43,.3)", flexShrink: 0 }}>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity=".9" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
    </div>
    <div>
      <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 14, lineHeight: 1.2 }}>DAN Platform</div>
      <div style={{ fontSize: 11, color: "#94A3B8" }}>Admin Panel</div>
    </div>
  </div>
);

const ProfileChip = ({ collapsed }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "#F8FAFC" }}>
    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#38BDF8,#0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0 }}>Đ</div>
    {!collapsed && (
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Admin Đan</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div className="mp-live" style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399" }} />
          <span style={{ fontSize: 11, color: "#94A3B8" }}>Đang hoạt động</span>
        </div>
      </div>
    )}
  </div>
);

const SidebarNav = ({ activeTab, setActiveTab, pendingConsult, processingOrders, onItemClick }) => (
  <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }} className="mp-scroll">
    <p style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", padding: "0 10px", marginBottom: 10, letterSpacing: ".1em", textTransform: "uppercase" }}>Menu chính</p>
    {TABS.map(tab => {
      const isActive = activeTab === tab.id;
      const badge = tab.id === "consult" ? pendingConsult : tab.id === "orders" ? processingOrders : 0;
      return (
        <button key={tab.id} onClick={() => { setActiveTab(tab.id); onItemClick?.(); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 11, border: "none", cursor: "pointer", background: isActive ? "linear-gradient(135deg,rgba(255,107,43,.1),rgba(56,189,248,.07))" : "transparent", color: isActive ? "#FF6B2B" : "#64748B", fontWeight: isActive ? 600 : 400, fontSize: 14, fontFamily: "inherit", textAlign: "left", transition: "background .12s, color .12s", marginBottom: 2 }}>
          <span style={{ fontSize: 16 }}>{tab.icon}</span>
          <span style={{ flex: 1 }}>{tab.label}</span>
          {badge > 0 && <span style={{ background: "#FF6B2B", color: "white", fontSize: 9, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{badge}</span>}
        </button>
      );
    })}
  </nav>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
const ManagePage = () => {
  const [activeTab, setActiveTab] = useState("stats");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [modal, setModal] = useState(null); // { type, mode, data }

  const tabBarRef = useRef(null);

  // Local state
  const [consultations, setConsultations] = useState(MOCK_CONSULTATIONS);

  // Store
  const { categories, fetchCategories, addCategory, removeCategory } = useCategoriesStore();
  const { products, productTypes, fetchProductTypes, addProductType, removeProductType, addProduct, fetchProducts } = useProductStore();

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);
  useEffect(() => {
    if (!categories || categories.length === 0) fetchCategories();
  }, [categories]);

  useEffect(() => {
    if (!productTypes || productTypes.length === 0) fetchProductTypes();
  }, [productTypes]);

  useEffect(() => {
    if (!products || products.length === 0) fetchProducts();
  }, [products]);

  useEffect(() => {
    const el = tabBarRef.current?.querySelector(`[data-tab="${activeTab}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeTab]);

  const pendingConsult = consultations.filter(c => c.status === "pending").length;
  const processingOrders = MOCK_ORDERS.filter(o => o.status === "processing").length;

  // ── Modal open/save ────────────────────────────────────────────────────
  const openModal = (type, mode, data = {}) => setModal({ type, mode, data });
  const closeModal = () => setModal(null);

  const handleSave = (form) => {
    if (modal.type === "category") {
      if (modal.mode === "add") {
        addCategory({ categoryName: form.name });
      } else {
        // update via store or local patch — keeping existing logic pattern
        addCategory({ ...modal.data, ...form }); // stores typically handle upsert
      }
    } else if (modal.type === "producttype") {
      if (modal.mode === "add") {
        addProductType({ ...form });
      } else {
        addProductType({ ...modal.data, ...form });
      }
    } else if (modal.type === "product") {
      const now = new Date().toISOString().split("T")[0];
      if (modal.mode === "add") {
        addProduct(form)
      } else {
        setProducts(prev => prev.map(p => p.id === modal.data.id ? { ...p, ...form, minPrice: Number(form.minPrice), maxPrice: Number(form.maxPrice), MOQ: Number(form.MOQ), updatedAt: now } : p));
      }
    }
    closeModal();
  };

  // ── FAB action per tab ─────────────────────────────────────────────────
  const FAB_ACTIONS = {
    categories: () => openModal("category", "add"),
    producttypes: () => openModal("producttype", "add"),
    products: () => openModal("product", "add"),
  };

  const tabLabel = TABS.find(t => t.id === activeTab)?.label || "";

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div className="mp" style={{ background: "#F0F4F8", minHeight: "100vh" }}>

        {/* ── MODALS ── */}
        {modal?.type === "category" && <CategoryModal mode={modal.mode} data={modal.data} onClose={closeModal} onSave={handleSave} />}
        {modal?.type === "producttype" && <ProductTypeModal mode={modal.mode} data={modal.data} onClose={closeModal} onSave={handleSave} />}
        {modal?.type === "product" && <ProductModal mode={modal.mode} data={modal.data} categories={categories || []} productTypes={productTypes || []} onClose={closeModal} onSave={handleSave} />}

        {/* ── MOBILE SIDEBAR OVERLAY ── */}
        {sidebarOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
            <div className="mp-overlay" style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.42)", backdropFilter: "blur(4px)" }} onClick={() => setSidebarOpen(false)} />
            <div className="mp-drawer" style={{ position: "relative", width: 280, height: "100%", display: "flex", flexDirection: "column", background: "white", boxShadow: "4px 0 24px rgba(0,0,0,.14)", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid #F1F5F9" }}>
                <Logo />
                <button className="mp-btn mp-btn-ghost mp-icon-btn" onClick={() => setSidebarOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
              <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} pendingConsult={pendingConsult} processingOrders={processingOrders} onItemClick={() => setSidebarOpen(false)} />
              <div style={{ padding: "12px" }}>
                <ProfileChip />
              </div>
            </div>
          </div>
        )}

        {/* ── DESKTOP SIDEBAR ── */}
        <aside style={{ display: "none", position: "fixed", left: 0, top: 0, height: "100%", width: 232, flexDirection: "column", zIndex: 30, background: "white", borderRight: "1px solid #F1F5F9", boxShadow: "2px 0 12px rgba(0,0,0,.04)" }} className="lg:flex">
          <div style={{ padding: "18px 16px", borderBottom: "1px solid #F1F5F9" }}>
            <Logo />
          </div>
          <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} pendingConsult={pendingConsult} processingOrders={processingOrders} />
          <div style={{ padding: "0 12px 12px" }}>
            <ProfileChip />
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} className="lg:ml-232">

          {/* TOP BAR */}
          <header style={{ position: "sticky", top: 0, zIndex: 20, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(240,244,248,.94)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(241,245,249,.8)" }}>
            {/* Hamburger */}
            <button className="mp-btn mp-btn-ghost" style={{ width: 36, height: 36, borderRadius: 10, background: "white", boxShadow: "0 1px 3px rgba(0,0,0,.06)", flexShrink: 0, padding: 0 }} onClick={() => setSidebarOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>

            {/* Search */}
            <div style={{ flex: 1, maxWidth: 340, position: "relative" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8" stroke="#94A3B8" strokeWidth="2" /><path d="M21 21l-4.35-4.35" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input className="mp-input mp-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm..." style={{ paddingLeft: 34, paddingRight: 12, paddingTop: 9, paddingBottom: 9 }} />
            </div>

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              {/* Notif */}
              <div style={{ position: "relative" }}>
                <button className="mp-btn mp-btn-ghost" style={{ width: 36, height: 36, borderRadius: 10, background: "white", position: "relative", boxShadow: "0 1px 3px rgba(0,0,0,.06)", padding: 0 }} onClick={() => setNotifOpen(!notifOpen)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  {(pendingConsult + processingOrders) > 0 && <span style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: "#FF6B2B", color: "white", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{pendingConsult + processingOrders}</span>}
                </button>
                {notifOpen && (
                  <div className="mp-notif-panel" style={{ position: "absolute", right: 0, top: 46, width: 276, background: "white", borderRadius: 15, overflow: "hidden", zIndex: 50, boxShadow: "0 4px 20px rgba(0,0,0,.1)", border: "1px solid #F1F5F9" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 700, color: "#1E293B", fontSize: 13 }}>Thông báo</span>
                      <span style={{ fontSize: 11, color: "#94A3B8", cursor: "pointer" }}>Đánh dấu đã đọc</span>
                    </div>
                    {pendingConsult > 0 && (
                      <div style={{ display: "flex", gap: 11, padding: "12px 16px", cursor: "pointer" }} onClick={() => { setActiveTab("consult"); setNotifOpen(false); }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#FFF3EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>💬</div>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "#334155", margin: 0 }}>{pendingConsult} yêu cầu chưa xử lý</p>
                          <p style={{ fontSize: 11, color: "#94A3B8", margin: "2px 0 0" }}>Cần tư vấn sớm</p>
                        </div>
                      </div>
                    )}
                    {processingOrders > 0 && (
                      <div style={{ display: "flex", gap: 11, padding: "12px 16px", cursor: "pointer", borderTop: pendingConsult > 0 ? "1px solid #F8FAFC" : "none" }} onClick={() => { setActiveTab("orders"); setNotifOpen(false); }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>📋</div>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "#334155", margin: 0 }}>{processingOrders} đơn đang xử lý</p>
                          <p style={{ fontSize: 11, color: "#94A3B8", margin: "2px 0 0" }}>Kiểm tra tiến độ</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Avatar */}
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#38BDF8,#0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", cursor: "pointer" }}>Đ</div>
            </div>
          </header>

          {/* ── MOBILE TAB BAR ── */}
          <div style={{ position: "sticky", top: 57, zIndex: 10, background: "rgba(240,244,248,.96)", backdropFilter: "blur(8px)", borderBottom: "1px solid #E2E8F0" }}>
            <div ref={tabBarRef} className="mp-noscroll" style={{ display: "flex", overflowX: "auto", padding: "6px 8px", gap: 3 }}>
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                const badge = tab.id === "consult" ? pendingConsult : tab.id === "orders" ? processingOrders : 0;
                return (
                  <button key={tab.id} data-tab={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`mp-btn mp-tab-pill ${isActive ? "active" : ""}`}
                    style={{ flexShrink: 0, padding: "7px 13px", borderRadius: 9, background: isActive ? "white" : "transparent", color: isActive ? "#FF6B2B" : "#64748B", fontSize: 12, fontWeight: isActive ? 700 : 400, boxShadow: isActive ? "0 1px 4px rgba(0,0,0,.08)" : "none", gap: 5 }}>
                    <span>{tab.icon}</span>
                    <span>{tab.shortLabel}</span>
                    {badge > 0 && <span style={{ width: 15, height: 15, borderRadius: "50%", background: "#FF6B2B", color: "white", fontSize: 8, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── PAGE CONTENT ── */}
          <main style={{ flex: 1, padding: "16px 14px 80px" }}>
            {/* Page header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, opacity: mounted ? 1 : 0, transition: "opacity .3s" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1E293B" }}>{tabLabel}</h1>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94A3B8" }}>Tháng 3, 2026 · DAN Platform</p>
              </div>
              {FAB_ACTIONS[activeTab] && (
                <button className="mp-btn mp-btn-primary" style={{ padding: "10px 16px", fontSize: 13 }} onClick={FAB_ACTIONS[activeTab]}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>
                  Thêm mới
                </button>
              )}
            </div>

            {/* Tab content */}
            {activeTab === "stats" && <StatsTab consultations={consultations} setActiveTab={setActiveTab} />}
            {activeTab === "categories" && <CategoriesTab categories={categories || []} products={products} addCategory={addCategory} removeCategory={removeCategory} openModal={openModal} />}
            {activeTab === "producttypes" && <ProductTypesTab productTypes={productTypes || []} products={products} addProductType={addProductType} removeProductType={removeProductType} openModal={openModal} />}
            {activeTab === "products" && <ProductsTab products={products} setProducts={setProducts} categories={categories || []} productTypes={productTypes || []} openModal={openModal} />}
            {activeTab === "consult" && <ConsultTab consultations={consultations} setConsultations={setConsultations} />}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "customers" && <CustomersTab />}
          </main>
        </div>

        {/* ── FLOATING ACTION BUTTON (mobile) ── */}
        {FAB_ACTIONS[activeTab] && (
          <button className="mp-btn mp-btn-primary" onClick={FAB_ACTIONS[activeTab]}
            style={{ position: "fixed", bottom: 20, right: 20, zIndex: 40, width: 54, height: 54, borderRadius: "50%", fontSize: 24, boxShadow: "0 6px 24px rgba(255,107,43,.4)", padding: 0 }}>
            +
          </button>
        )}
      </div>

      <style>{`
        @media(min-width:1024px) { .lg\\:flex { display: flex !important; } .lg\\:ml-232 { margin-left: 232px; } }
        .mp-btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }
      `}</style>
    </>
  );
};

export default ManagePage;