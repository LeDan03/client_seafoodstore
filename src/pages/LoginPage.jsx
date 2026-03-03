import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import path from "../utils/path";

// Floating particle component
const Particle = ({ style }) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={style}
  />
);

const LoginPage = () => {

  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    if (!phone || phone.length < 9) {
      setPhoneError("Vui lòng nhập số điện thoại hợp lệ");
      valid = false;
    } else {
      setPhoneError("");
    }

    if (!password || password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2200);
  };

  const handleRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  };

  const particles = [
    { width: 6, height: 6, top: "10%", left: "8%", background: "#FF6B2B", opacity: 0.5, animation: "floatA 6s ease-in-out infinite" },
    { width: 10, height: 10, top: "20%", right: "12%", background: "#38BDF8", opacity: 0.4, animation: "floatB 8s ease-in-out infinite" },
    { width: 4, height: 4, top: "60%", left: "5%", background: "#ffffff", opacity: 0.6, animation: "floatA 5s ease-in-out infinite 1s" },
    { width: 8, height: 8, bottom: "20%", right: "8%", background: "#FF6B2B", opacity: 0.35, animation: "floatB 7s ease-in-out infinite 2s" },
    { width: 5, height: 5, top: "40%", left: "92%", background: "#38BDF8", opacity: 0.5, animation: "floatA 9s ease-in-out infinite 0.5s" },
    { width: 12, height: 12, bottom: "35%", left: "10%", background: "#0EA5E9", opacity: 0.25, animation: "floatB 10s ease-in-out infinite 3s" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(180deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-12px) translateX(8px); }
          66% { transform: translateY(6px) translateX(-6px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ripple {
          from { transform: scale(0); opacity: 0.6; }
          to { transform: scale(4); opacity: 0; }
        }
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.08); opacity: 0.15; }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5); }
        }

        .font-sora { font-family: 'Sora', sans-serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }

        .glass-card {
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .input-field {
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.12);
          transition: all 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .input-field:focus {
          background: rgba(255,255,255,0.1);
          border-color: #FF6B2B;
          outline: none;
          box-shadow: 0 0 0 3px rgba(255,107,43,0.18), inset 0 0 12px rgba(255,107,43,0.04);
        }
        .input-field.focused-blue:focus {
          border-color: #38BDF8;
          box-shadow: 0 0 0 3px rgba(56,189,248,0.18), inset 0 0 12px rgba(56,189,248,0.04);
        }

        .btn-login {
          background: linear-gradient(135deg, #FF6B2B 0%, #F97316 50%, #FB923C 100%);
          background-size: 200% auto;
          transition: all 0.4s ease;
          box-shadow: 0 8px 32px rgba(255,107,43,0.4), 0 2px 8px rgba(0,0,0,0.2);
        }
        .btn-login:hover {
          background-position: right center;
          box-shadow: 0 12px 40px rgba(255,107,43,0.55), 0 4px 12px rgba(0,0,0,0.25);
          transform: translateY(-2px);
        }
        .btn-login:active { transform: translateY(0); }

        .feature-img-mask {
          mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%);
        }

        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #38BDF8 40%, #FF6B2B 60%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .divider-line::before, .divider-line::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.2));
        }
        .divider-line::after {
          background: linear-gradient(to left, transparent, rgba(255,255,255,0.2));
        }

        .social-btn {
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
        }
        .social-btn:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-2px);
        }

        .accent-dot {
          animation: pulseRing 3s ease-in-out infinite;
        }

        .wave-bar { animation: wave 1.2s ease-in-out infinite; }

        .error-shake {
          animation: shake 0.4s ease;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>

      <div
        className="font-sora min-h-screen w-full relative overflow-hidden flex flex-col"
        style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D1F3C 40%, #0A2847 70%, #071A35 100%)" }}
      >
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute rounded-full" style={{ width: 340, height: 340, top: -80, right: -80, background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)" }} />
          <div className="absolute rounded-full" style={{ width: 260, height: 260, bottom: 60, left: -60, background: "radial-gradient(circle, rgba(255,107,43,0.12) 0%, transparent 70%)" }} />
          <div className="absolute rounded-full" style={{ width: 180, height: 180, top: "45%", left: "30%", background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)" }} />
        </div>

        {/* Floating particles */}
        {particles.map((p, i) => (
          <Particle key={i} style={{ ...p, position: "absolute", borderRadius: "50%", pointerEvents: "none" }} />
        ))}

        {/* === MOBILE LAYOUT === */}
        <div className="lg:hidden flex flex-col min-h-screen">

          {/* Top feature image strip */}
          <div
            className="relative w-full overflow-hidden"
            style={{ height: 220, animation: mounted ? "fadeIn 0.8s ease forwards" : "none", opacity: mounted ? 1 : 0 }}
          >
            <img
              src="feature-bg.png"
              alt="Feature"
              className="w-full h-full object-cover feature-img-mask"
              style={{ filter: "brightness(0.75) saturate(1.2)" }}
            />
            {/* Overlay tint */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,22,40,0.2) 0%, rgba(10,22,40,0.85) 100%)" }} />

            {/* Logo area */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3" style={{ animation: mounted ? "slideRight 0.7s 0.3s both" : "none" }}>
                <div className="relative w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF6B2B, #F97316)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9"/>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 rounded-xl accent-dot" style={{ border: "2px solid rgba(255,107,43,0.5)" }} />
                </div>
                <div>
                  <div className="text-white font-bold text-lg leading-tight tracking-wide">DAN</div>
                  <div className="text-xs font-dm" style={{ color: "#38BDF8", letterSpacing: "0.15em" }}>PLATFORM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Login card */}
          <div className="flex-1 px-5 pb-8 pt-2 relative z-10">
            <div
              className="glass-card rounded-3xl p-6"
              style={{ animation: mounted ? "scaleIn 0.6s 0.4s both" : "none", opacity: 0 }}
            >
              {/* Header */}
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #FF6B2B, #38BDF8)" }} />
                  <span className="text-xs font-dm tracking-widest uppercase" style={{ color: "#38BDF8" }}>Chào mừng trở lại</span>
                </div>
                <h1 className="text-3xl font-bold text-white leading-tight">Đăng nhập</h1>
                <p className="font-dm text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>Nhập thông tin để tiếp tục</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: focused === "phone" ? "#38BDF8" : "rgba(255,255,255,0.4)", transition: "color 0.3s" }}>
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.95 12a19.79 19.79 0 01-3.07-8.67A2 2 0 012.86 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <div className="w-px h-4" style={{ background: "rgba(255,255,255,0.15)" }} />
                      <span className="text-xs font-dm" style={{ color: "rgba(255,255,255,0.5)" }}>+84</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      onFocus={() => setFocused("phone")}
                      onBlur={() => setFocused(null)}
                      placeholder="98 765 4321"
                      maxLength={10}
                      className={`input-field focused-blue w-full rounded-2xl text-white placeholder-opacity-30 py-3.5 pr-4 font-dm text-sm ${phoneError ? "error-shake" : ""}`}
                      style={{ paddingLeft: "80px", color: "white" }}
                    />
                  </div>
                  {phoneError && (
                    <p className="text-xs mt-1.5 font-dm" style={{ color: "#FB923C", animation: "fadeIn 0.3s ease" }}>⚠ {phoneError}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.6)" }}>
                      Mật khẩu
                    </label>
                    <button type="button" className="text-xs font-dm transition-colors" style={{ color: "#FF6B2B" }}>
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: focused === "pass" ? "#FF6B2B" : "rgba(255,255,255,0.4)", transition: "color 0.3s" }}>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocused("pass")}
                      onBlur={() => setFocused(null)}
                      placeholder="••••••••"
                      className={`input-field w-full rounded-2xl text-white py-3.5 font-dm text-sm ${passwordError ? "error-shake" : ""}`}
                      style={{ paddingLeft: "44px", paddingRight: "48px", color: "white" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-xs mt-1.5 font-dm" style={{ color: "#FB923C", animation: "fadeIn 0.3s ease" }}>⚠ {passwordError}</p>
                  )}
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2.5 pt-1">
                  <div className="w-4 h-4 rounded-md border flex items-center justify-center cursor-pointer" style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }}>
                    <div className="w-2 h-2 rounded-sm" style={{ background: "#FF6B2B" }} />
                  </div>
                  <span className="text-xs font-dm" style={{ color: "rgba(255,255,255,0.5)" }}>Ghi nhớ đăng nhập</span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  onClick={handleRipple}
                  className="btn-login relative w-full rounded-2xl py-4 text-white font-semibold text-sm tracking-wide overflow-hidden mt-2"
                  disabled={isLoading}
                >
                  {ripples.map((r) => (
                    <span
                      key={r.id}
                      className="absolute rounded-full"
                      style={{ left: r.x, top: r.y, width: 20, height: 20, marginLeft: -10, marginTop: -10, background: "rgba(255,255,255,0.3)", animation: "ripple 0.7s linear forwards" }}
                    />
                  ))}
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="wave-bar w-1 h-4 rounded-full bg-white inline-block" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </span>
                      Đang đăng nhập...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Đăng nhập
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5 divider-line">
                <span className="text-xs font-dm px-2" style={{ color: "rgba(255,255,255,0.3)" }}>hoặc đăng nhập với</span>
              </div>

              {/* Social */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Google", color: "#EA4335", icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  )},
                  { name: "Zalo", color: "#0068FF", icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0068FF"><rect width="24" height="24" rx="5" fill="#0068FF"/><text x="12" y="17" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">Z</text></svg>
                  )},
                ].map((s) => (
                  <button key={s.name} className="social-btn rounded-2xl py-3 flex items-center justify-center gap-2.5 text-sm font-dm" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {s.icon}
                    {s.name}
                  </button>
                ))}
              </div>

              {/* Sign up */}
              <p className="text-center text-xs font-dm mt-5" style={{ color: "rgba(255,255,255,0.4)" }}>
                Chưa có tài khoản?{" "}
                <span className="font-semibold cursor-pointer" style={{ color: "#38BDF8" }} onClick={() => navigate(path.REGISTER)}>Đăng ký ngay</span>
              </p>
            </div>
          </div>
        </div>

        {/* === DESKTOP LAYOUT === */}
        <div className="hidden lg:flex min-h-screen">

          {/* Left — Feature image panel */}
          <div className="relative w-1/2 xl:w-[55%] overflow-hidden"
            style={{ animation: mounted ? "fadeIn 0.8s ease forwards" : "none", opacity: 0 }}
          >
            <img
              src="feature-bg.png"
              alt="Feature"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.65) saturate(1.3)" }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, rgba(10,22,40,0.5) 0%, rgba(10,22,40,0.2) 50%, rgba(14,165,233,0.1) 100%)" }} />

            {/* Content over image */}
            <div className="relative h-full flex flex-col justify-between p-10 xl:p-14">
              {/* Logo */}
              <div style={{ animation: mounted ? "slideRight 0.7s 0.4s both" : "none", opacity: 0 }}>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF6B2B, #F97316)", boxShadow: "0 8px 24px rgba(255,107,43,0.4)" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9"/>
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-bold text-xl tracking-widest">DAN</div>
                    <div className="text-xs font-dm tracking-widest" style={{ color: "#38BDF8" }}>PLATFORM</div>
                  </div>
                </div>
              </div>

              {/* Center tagline */}
              <div style={{ animation: mounted ? "slideUp 0.8s 0.6s both" : "none", opacity: 0 }}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: "#38BDF8", boxShadow: "0 0 8px #38BDF8" }} />
                  <span className="text-xs font-dm tracking-wider" style={{ color: "rgba(255,255,255,0.8)" }}>Nền tảng hiện đại</span>
                </div>
                <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                  Kết nối không<br />
                  <span className="shimmer-text">giới hạn</span>
                </h2>
                <p className="font-dm text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", maxWidth: 360 }}>
                  Trải nghiệm dịch vụ đỉnh cao với giao diện thông minh, bảo mật tuyệt đối và hiệu suất vượt trội.
                </p>

                {/* Stats row */}
                <div className="flex gap-8 mt-8">
                  {[
                    { label: "Người dùng", value: "2M+" },
                    { label: "Uptime", value: "99.9%" },
                    { label: "Hỗ trợ", value: "24/7" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs font-dm mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom testimonial */}
              <div className="glass-card rounded-2xl p-5" style={{ animation: mounted ? "slideUp 0.8s 0.8s both" : "none", opacity: 0 }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg, #38BDF8, #0EA5E9)" }} />
                  <div>
                    <p className="text-sm font-dm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                      "Giao diện đẹp, dễ sử dụng. Tôi rất hài lòng với trải nghiệm đăng nhập nhanh chóng."
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-semibold text-white">Nguyễn Minh Đan</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#FF6B2B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Login form */}
          <div className="w-1/2 xl:w-[45%] flex items-center justify-center p-10 xl:p-16 relative">
            <div className="w-full max-w-md" style={{ animation: mounted ? "scaleIn 0.7s 0.35s both" : "none", opacity: 0 }}>

              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(180deg, #FF6B2B, #38BDF8)" }} />
                  <span className="text-xs font-dm tracking-widest uppercase" style={{ color: "#38BDF8" }}>Chào mừng trở lại</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Đăng nhập</h1>
                <p className="font-dm" style={{ color: "rgba(255,255,255,0.45)" }}>Nhập thông tin để tiếp tục hành trình của bạn</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ color: focused === "phoneD" ? "#38BDF8" : "rgba(255,255,255,0.4)", transition: "color 0.3s" }}>
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.95 12a19.79 19.79 0 01-3.07-8.67A2 2 0 012.86 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.15)" }} />
                      <span className="text-sm font-dm" style={{ color: "rgba(255,255,255,0.5)" }}>+84</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      onFocus={() => setFocused("phoneD")}
                      onBlur={() => setFocused(null)}
                      placeholder="98 765 4321"
                      maxLength={10}
                      className={`input-field focused-blue w-full rounded-2xl text-white placeholder-opacity-30 py-4 pr-4 font-dm ${phoneError ? "error-shake" : ""}`}
                      style={{ paddingLeft: "88px", color: "white" }}
                    />
                  </div>
                  {phoneError && <p className="text-xs mt-1.5 font-dm" style={{ color: "#FB923C" }}>⚠ {phoneError}</p>}
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.6)" }}>Mật khẩu</label>
                    <button type="button" className="text-xs font-dm" style={{ color: "#FF6B2B" }}>Quên mật khẩu?</button>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ color: focused === "passD" ? "#FF6B2B" : "rgba(255,255,255,0.4)", transition: "color 0.3s" }}>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocused("passD")}
                      onBlur={() => setFocused(null)}
                      placeholder="••••••••"
                      className={`input-field w-full rounded-2xl text-white py-4 font-dm ${passwordError ? "error-shake" : ""}`}
                      style={{ paddingLeft: "48px", paddingRight: "52px", color: "white" }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {showPassword ? (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {passwordError && <p className="text-xs mt-1.5 font-dm" style={{ color: "#FB923C" }}>⚠ {passwordError}</p>}
                </div>

                {/* Remember */}
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-md border flex items-center justify-center cursor-pointer" style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }}>
                    <div className="w-2 h-2 rounded-sm" style={{ background: "#FF6B2B" }} />
                  </div>
                  <span className="text-sm font-dm" style={{ color: "rgba(255,255,255,0.5)" }}>Ghi nhớ đăng nhập</span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  onClick={handleRipple}
                  className="btn-login relative w-full rounded-2xl py-4 text-white font-semibold tracking-wide overflow-hidden mt-2"
                  disabled={isLoading}
                >
                  {ripples.map((r) => (
                    <span key={r.id} className="absolute rounded-full" style={{ left: r.x, top: r.y, width: 20, height: 20, marginLeft: -10, marginTop: -10, background: "rgba(255,255,255,0.3)", animation: "ripple 0.7s linear forwards" }} />
                  ))}
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="flex gap-1 items-end">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="wave-bar w-1.5 h-5 rounded-full bg-white inline-block" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </span>
                      Đang đăng nhập...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Đăng nhập ngay
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6 divider-line">
                <span className="text-xs font-dm px-3" style={{ color: "rgba(255,255,255,0.3)" }}>hoặc đăng nhập với</span>
              </div>

              {/* Social */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Google", icon: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
                  { name: "Zalo", icon: <svg width="20" height="20" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#0068FF"/><text x="12" y="17" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">Z</text></svg> },
                ].map((s) => (
                  <button key={s.name} className="social-btn rounded-2xl py-3.5 flex items-center justify-center gap-3 font-dm" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {s.icon}
                    {s.name}
                  </button>
                ))}
              </div>

              <p className="text-center text-sm font-dm mt-6" style={{ color: "rgba(255,255,255,0.4)" }}>
                Chưa có tài khoản?{" "}
                <span className="font-semibold cursor-pointer" style={{ color: "#38BDF8" }}>Đăng ký ngay</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;