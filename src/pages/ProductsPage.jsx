import { useState, useEffect, useRef } from "react";

// ── DATA ─────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: "Bạch Tuộc Tươi Nguyên Con",
    description:
      "Đánh bắt sáng sớm, còn nguyên con, da bóng mướt. Thịt giòn ngọt, thích hợp làm gỏi hoặc nướng muối ớt.",
    time: "Có hàng hôm nay",
    price: { min: 150000, max: 200000 },
    unit: "kg",
    status: "available",
    images: ["bach-tuoc.png"],
  },
  {
    id: 2,
    name: "Bạch Tuộc Size Lớn (500g+)",
    description:
      "Cỡ đặc biệt, mỗi con trên 500g. Thịt dày, ngọt đậm — lý tưởng để hầm hoặc xào cay theo phong cách Hàn.",
    time: "Số lượng có hạn",
    price: { min: 220000, max: 280000 },
    unit: "kg",
    status: "hot",
    images: ["bach-tuoc.png", "bach-tuoc.png"],
  },
  {
    id: 3,
    name: "Bạch Tuộc Mini Sashimi",
    description:
      "Loại nhỏ đặc chọn, sơ chế sạch, ngâm nước muối biển. Phù hợp ăn sống kiểu Nhật hoặc nhúng lẩu.",
    time: "Đặt trước 6h sáng",
    price: { min: 180000, max: 240000 },
    unit: "kg",
    status: "preorder",
    images: ["bach-tuoc.png", "bach-tuoc.png", "bach-tuoc.png"],
  },
  {
    id: 4,
    name: "Combo Nướng Bạch Tuộc",
    description:
      "Bạch tuộc tươi + sốt bơ tỏi đặc biệt + xiên tre. Chỉ cần bật bếp là có tiệc — giao kèm hướng dẫn nướng.",
    time: "Có hàng hôm nay",
    price: { min: 180000, max: 230000 },
    unit: "set",
    status: "available",
    images: ["bach-tuoc.png"],
  },
  {
    id: 5,
    name: "Bạch Tuộc Đã Sơ Chế",
    description:
      "Làm sạch hoàn toàn: bỏ túi mực, rửa kỹ với muối biển. Tiết kiệm thời gian, vẫn giữ nguyên độ tươi.",
    time: "Giao trong 2 giờ",
    price: { min: 170000, max: 210000 },
    unit: "kg",
    status: "available",
    images: [],
  },
  {
    id: 6,
    name: "Bạch Tuộc Thịt Cắt Sẵn",
    description:
      "Cắt khoanh sẵn sàng nấu. Hôm nay hết hàng sớm — đặt lịch cho ngày mai để không bỏ lỡ.",
    time: "Hết hôm nay",
    price: { min: 160000, max: 195000 },
    unit: "kg",
    status: "soldout",
    images: ["bach-tuoc.png", "bach-tuoc.png"],
  },
];

const STATUS_CONFIG = {
  available: { label: "Còn hàng",    bg: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30" },
  hot:       { label: "🔥 Bán Chạy", bg: "bg-orange-500/20 text-orange-300 border border-orange-500/40" },
  preorder:  { label: "Đặt Trước",   bg: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30" },
  soldout:   { label: "Hết Hôm Nay", bg: "bg-neutral-700/40 text-neutral-500 border border-neutral-700" },
};

function fmtPrice(n) {
  return n.toLocaleString("vi-VN");
}

// ── HOOKS ─────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── OCEAN WAVE SVG ─────────────────────────────────────────────────────────────
function OceanWave({ className = "" }) {
  return (
    <svg viewBox="0 0 1200 80" className={className} preserveAspectRatio="none">
      <path
        d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,80 L0,80 Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ── TENTACLE BG ────────────────────────────────────────────────────────────────
function TentacleBg() {
  return (
    <svg className="pointer-events-none absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      {[...Array(7)].map((_, i) => (
        <path key={i}
          d={`M${60 + i * 110},640 Q${40 + i * 110},430 ${130 + i * 90},310 Q${170 + i * 70},190 ${90 + i * 110},60`}
          stroke={i % 2 === 0 ? "#f97316" : "#0ea5e9"}
          strokeWidth={i % 3 === 0 ? "16" : "10"}
          fill="none" strokeLinecap="round"
          opacity="0.07"
          style={{
            animation: `sway ${3.5 + i * 0.4}s ease-in-out infinite alternate`,
            transformOrigin: `${60 + i * 110}px 640px`,
          }}
        />
      ))}
      <style>{`@keyframes sway{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}`}</style>
    </svg>
  );
}

// ── BUBBLES ────────────────────────────────────────────────────────────────────
function Bubbles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(14)].map((_, i) => (
        <span key={i} className="absolute rounded-full"
          style={{
            width: `${6 + (i % 6) * 9}px`,
            height: `${6 + (i % 6) * 9}px`,
            left: `${(i * 19 + 3) % 96}%`,
            bottom: `-20px`,
            background: i % 3 === 0
              ? "rgba(249,115,22,0.15)"
              : i % 3 === 1 ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${i % 2 === 0 ? "rgba(249,115,22,0.25)" : "rgba(14,165,233,0.25)"}`,
            animation: `rise ${5 + (i % 5)}s linear ${i * 0.6}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes rise{
          0%{transform:translateY(0) scale(1);opacity:0.5}
          85%{opacity:0.15}
          100%{transform:translateY(-105vh) scale(1.6);opacity:0}
        }
      `}</style>
    </div>
  );
}

// ── IMAGE CAROUSEL with SLIDE ANIMATION ───────────────────────────────────────
function ImageCarousel({ images }) {
  const [idx, setIdx] = useState(0);
  const [slideClass, setSlideClass] = useState("");
  const imgs = images.length > 0 ? images : ["bach-tuoc.png"];

  function go(next, direction) {
    if (imgs.length <= 1) return;
    const cls = direction > 0 ? "slide-out-left" : "slide-out-right";
    const inCls = direction > 0 ? "slide-in-right" : "slide-in-left";
    setSlideClass(cls);
    setTimeout(() => {
      setIdx(next);
      setSlideClass(inCls);
      setTimeout(() => setSlideClass(""), 320);
    }, 280);
  }

  return (
    <div className="relative w-full h-52 overflow-hidden rounded-t-2xl bg-neutral-950 group">
      <style>{`
        .slide-out-left  { animation: slideOutLeft  0.28s ease forwards; }
        .slide-out-right { animation: slideOutRight 0.28s ease forwards; }
        .slide-in-right  { animation: slideInRight  0.28s ease forwards; }
        .slide-in-left   { animation: slideInLeft   0.28s ease forwards; }
        @keyframes slideOutLeft  { to { transform: translateX(-60px); opacity: 0; } }
        @keyframes slideOutRight { to { transform: translateX(60px);  opacity: 0; } }
        @keyframes slideInRight  { from { transform: translateX(60px);  opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInLeft   { from { transform: translateX(-60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      <img
        key={idx}
        src={imgs[idx]}
        alt="product"
        className={`absolute inset-0 w-full h-full object-cover ${slideClass}`}
        onError={(e) => { e.target.src = "bach-tuoc.png"; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
        style={{ background: "radial-gradient(circle at top right,rgba(249,115,22,0.25),transparent 70%)" }} />

      {imgs.length > 1 && (
        <>
          <button
            onClick={() => go((idx - 1 + imgs.length) % imgs.length, -1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg text-base"
          >‹</button>
          <button
            onClick={() => go((idx + 1) % imgs.length, 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg text-base"
          >›</button>
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
            {imgs.map((_, i) => (
              <button key={i} onClick={() => go(i, i > idx ? 1 : -1)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === idx ? "20px" : "6px",
                  height: "6px",
                  background: i === idx ? "#f97316" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>
          <span className="absolute top-2.5 left-2.5 bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm">
            {idx + 1}/{imgs.length}
          </span>
        </>
      )}
    </div>
  );
}

// ── PRODUCT CARD ───────────────────────────────────────────────────────────────
function ProductCard({ product, index }) {
  const [ref, inView] = useInView();
  const status = STATUS_CONFIG[product.status] || STATUS_CONFIG.available;
  const isSoldOut = product.status === "soldout";

  return (
    <div
      ref={ref}
      className="relative flex flex-col rounded-2xl overflow-hidden group"
      style={{
        background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        backdropFilter: "blur(12px)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(50px)",
        transition: `opacity 0.55s ease ${index * 0.07}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 0.07}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)";
        e.currentTarget.style.boxShadow = "0 8px 40px rgba(249,115,22,0.15)";
        e.currentTarget.style.transform = "translateY(-6px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)";
        e.currentTarget.style.transform = inView ? "translateY(0)" : "translateY(50px)";
      }}
    >
      {product.status === "hot" && (
        <span className="absolute top-2.5 right-2.5 z-20 text-[11px] font-black text-white px-2.5 py-0.5 rounded-full"
          style={{
            background: "linear-gradient(135deg,#f97316,#dc2626)",
            boxShadow: "0 0 0 0 rgba(249,115,22,0.6)",
            animation: "hotpulse 1.8s ease-in-out infinite",
          }}>
          HOT 🔥
        </span>
      )}

      <ImageCarousel images={product.images} />

      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-black text-white text-sm sm:text-base leading-snug">
            {product.name}
          </h3>
          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${status.bg}`}>
            {status.label}
          </span>
        </div>

        <p className="text-white/45 text-xs leading-relaxed line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto pt-3 border-t border-white/[0.08] flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs text-sky-400">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {product.time}
          </div>

          <div>
            <p className="text-[10px] text-white/25 mb-0.5 uppercase tracking-widest">Khoảng giá</p>
            <p className="font-black text-sm sm:text-base text-orange-400">
              {fmtPrice(product.price.min)}
              <span className="text-white/25 mx-1 font-normal text-xs">–</span>
              {fmtPrice(product.price.max)}
              <span className="text-xs font-normal text-white/30 ml-1">đ/{product.unit}</span>
            </p>
          </div>

          <button
            disabled={isSoldOut}
            className="w-full py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-200 active:scale-95"
            style={isSoldOut
              ? { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.2)", cursor: "not-allowed" }
              : {
                  background: "linear-gradient(135deg,#f97316 0%,#ea580c 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 16px rgba(249,115,22,0.35)",
                }
            }
            onMouseEnter={(e) => { if (!isSoldOut) e.target.style.boxShadow = "0 6px 24px rgba(249,115,22,0.55)"; }}
            onMouseLeave={(e) => { if (!isSoldOut) e.target.style.boxShadow = "0 4px 16px rgba(249,115,22,0.35)"; }}
          >
            {isSoldOut ? "Hết Hàng Hôm Nay" : "Đặt Ngay 🐙"}
          </button>
        </div>
      </div>

      <style>{`@keyframes hotpulse{0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,0.7)}50%{box-shadow:0 0 0 7px rgba(249,115,22,0)}}`}</style>
    </div>
  );
}

// ── HERO ───────────────────────────────────────────────────────────────────────
function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long", day: "2-digit", month: "2-digit", year: "numeric",
  });

  return (
    <div className="relative overflow-hidden" style={{
      background: "linear-gradient(160deg, #091828 0%, #0f172a 45%, #1c0a00 100%)",
      minHeight: "64vh",
    }}>
      <TentacleBg />
      <Bubbles />

      {/* ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "700px", height: "400px",
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(249,115,22,0.25) 0%, rgba(14,165,233,0.12) 55%, transparent 80%)",
        }} />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-14 pb-14"
        style={{ minHeight: "64vh" }}>

        {/* ─ LOGO ─ */}
        <div className="mb-7"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "scale(1) translateY(0)" : "scale(0.55) translateY(30px)",
            transition: "opacity 0.9s ease, transform 0.9s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <div className="relative inline-block">
            {/* spinning conic border */}
            <div className="absolute rounded-full pointer-events-none"
              style={{
                inset: "-4px",
                background: "conic-gradient(from 0deg, #f97316, #0ea5e9, #ffffff30, #f97316)",
                borderRadius: "50%",
                animation: "spin 5s linear infinite",
                filter: "blur(0.5px)",
                opacity: 0.75,
              }} />
            {/* second slower ring */}
            <div className="absolute rounded-full pointer-events-none"
              style={{
                inset: "-10px",
                border: "1.5px dashed rgba(249,115,22,0.3)",
                borderRadius: "50%",
                animation: "spin 12s linear infinite reverse",
              }} />
            {/* logo bg */}
            <div className="relative rounded-full p-1.5"
              style={{
                background: "linear-gradient(135deg,#0e2744,#2d1200)",
                boxShadow: "0 0 50px rgba(249,115,22,0.45), 0 0 90px rgba(14,165,233,0.2), inset 0 0 20px rgba(0,0,0,0.5)",
              }}>
              <img
                src="logo.png"
                alt="Minh Hoàng"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover block"
                id="hero-logo"
                onError={(e) => {
                  e.target.style.display = "none";
                  document.getElementById("fallback-logo").style.display = "flex";
                }}
              />
              <div id="fallback-logo"
                className="hidden w-28 h-28 sm:w-36 sm:h-36 rounded-full items-center justify-center text-6xl"
                style={{ background: "#0e1a2d" }}>
                🐙
              </div>
            </div>
            {/* orbit dots */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ animation: "spin 4s linear infinite" }}>
              {[0, 120, 240].map((deg, di) => (
                <span key={deg}
                  className="absolute w-2.5 h-2.5 rounded-full"
                  style={{
                    background: di === 0 ? "#f97316" : di === 1 ? "#38bdf8" : "#ffffff",
                    top: "50%", left: "50%",
                    transform: `rotate(${deg}deg) translateX(80px) translateY(-50%)`,
                    boxShadow: `0 0 10px ${di === 0 ? "#f97316" : "#38bdf8"}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ─ TEXT ─ */}
        <div style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease 0.18s, transform 0.8s ease 0.18s",
        }}>
          <p className="text-xs sm:text-sm font-bold tracking-[0.38em] uppercase text-sky-400 mb-2">
            ✦ Hải Sản Tươi Sống ✦
          </p>
          <h1 className="font-black leading-none tracking-tight"
            style={{
              fontSize: "clamp(2.5rem,9vw,5rem)",
              background: "linear-gradient(130deg,#ffffff 25%,#fb923c 65%,#f97316 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Sora',sans-serif",
            }}>
            MINH HOÀNG
          </h1>
          <p className="mt-1.5 text-lg sm:text-xl font-black text-orange-400 tracking-wide">
            Chuyên Bạch Tuộc Tươi
          </p>

          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-orange-500" />
            <span className="text-base">🐙</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-orange-500" />
          </div>

          {/* today badge */}
          <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm"
            style={{
              background: "rgba(249,115,22,0.12)",
              border: "1px solid rgba(249,115,22,0.4)",
              color: "#fb923c",
              boxShadow: "0 0 20px rgba(249,115,22,0.15)",
            }}>
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block shrink-0"
              style={{ animation: "blink 1.4s infinite" }} />
            Hàng tươi {today}
          </div>

          {/* scroll hint */}
          <div className="mt-8 flex justify-center"
            style={{ animation: "bounceY 2.2s ease-in-out infinite" }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>
      </div>

      <OceanWave className="absolute bottom-0 left-0 w-full h-10 sm:h-14 text-[#0a1020]" />

      <style>{`
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes bounceY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </div>
  );
}

// ── FRESH DAILY BANNER ─────────────────────────────────────────────────────────
function FreshBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl my-6 p-5 sm:p-6"
      style={{
        background: "linear-gradient(120deg,rgba(14,165,233,0.12) 0%,rgba(249,115,22,0.10) 50%,rgba(14,165,233,0.08) 100%)",
        border: "1px solid rgba(14,165,233,0.2)",
      }}>
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg,#0ea5e9 0,#0ea5e9 1px,transparent 0,transparent 22px)",
        }} />
      <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
        {[
          { icon: "🌊", title: "Tươi Mỗi Sáng", sub: "Nhập từ bến cá lúc 5h sáng" },
          { icon: "📅", title: "Menu Thay Mỗi Ngày", sub: "Tùy mùa vụ & mẻ lưới" },
          { icon: "📞", title: "Đặt Trước Để Chắc", sub: "Số lượng giới hạn mỗi ngày" },
        ].map((s) => (
          <div key={s.title} className="flex sm:flex-col items-center gap-3 sm:gap-1.5">
            <span className="text-2xl sm:text-3xl">{s.icon}</span>
            <div className="text-left sm:text-center">
              <p className="text-white font-black text-sm leading-tight">{s.title}</p>
              <p className="text-white/35 text-xs mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FILTER BAR ─────────────────────────────────────────────────────────────────
const FILTERS = [
  { key: "all",       label: "Tất Cả"   },
  { key: "available", label: "Còn Hàng" },
  { key: "hot",       label: "🔥 Hot"   },
  { key: "preorder",  label: "Đặt Trước"},
];

function FilterBar({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {FILTERS.map((f) => (
        <button key={f.key} onClick={() => onChange(f.key)}
          className="shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-black tracking-wide transition-all duration-200 active:scale-95"
          style={active === f.key
            ? { background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", boxShadow: "0 4px 18px rgba(249,115,22,0.45)" }
            : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.45)" }
          }>
          {f.label}
        </button>
      ))}
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = PRODUCTS.filter((p) => {
    const matchFilter = filter === "all" || p.status === filter;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen text-white" style={{ background: "#0a1020", fontFamily: "'Sora','Inter',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      <HeroSection />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <FreshBanner />

        {/* Search + Filter */}
        <div className="flex flex-col gap-3 mb-5">
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Tìm sản phẩm hôm nay..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
              onFocus={(e) => e.target.style.borderColor = "rgba(249,115,22,0.6)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
            />
          </div>
          <FilterBar active={filter} onChange={setFilter} />
        </div>

        <p className="text-[11px] text-white/25 mb-5 font-bold tracking-widest uppercase">
          {filtered.length} sản phẩm tươi hôm nay
        </p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/20">
            <span className="text-5xl mb-3">🐙</span>
            <p className="text-sm">Không tìm thấy sản phẩm phù hợp</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 relative rounded-2xl overflow-hidden p-6 sm:p-10 text-center"
          style={{
            background: "linear-gradient(135deg,rgba(14,165,233,0.12) 0%,rgba(249,115,22,0.15) 100%)",
            border: "1px solid rgba(249,115,22,0.3)",
            boxShadow: "0 0 60px rgba(249,115,22,0.06) inset",
          }}>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              background: "repeating-linear-gradient(45deg,#f97316 0,#f97316 1px,transparent 0,transparent 18px)",
              backgroundSize: "25px 25px",
            }} />
          <p className="relative text-xl sm:text-3xl font-black text-white mb-1.5">
            Hàng tươi — Đặt sớm kẻo hết! 🐙
          </p>
          <p className="relative text-xs sm:text-sm text-sky-400 mb-6">
            Miễn phí giao hàng cho đơn từ 300.000đ · Nội thành 5km
          </p>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-black px-8 py-3.5 rounded-xl text-white text-sm transition-all active:scale-95 hover:brightness-110"
              style={{ background: "linear-gradient(135deg,#f97316,#dc2626)", boxShadow: "0 6px 28px rgba(249,115,22,0.5)" }}>
              📞 Gọi Đặt Hàng
            </button>
            <button
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold px-8 py-3.5 rounded-xl text-sm transition-all active:scale-95 hover:border-sky-400 hover:text-sky-300"
              style={{ background: "transparent", border: "1px solid rgba(14,165,233,0.45)", color: "#38bdf8" }}>
              💬 Nhắn Zalo / FB
            </button>
          </div>
        </div>
      </main>

      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}