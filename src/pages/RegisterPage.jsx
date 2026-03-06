import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../services/authService"

import { toast } from "react-toastify";
import { HttpStatusCode } from "axios";
import path from "../utils/path"

const Particle = ({ style }) => <div className="absolute rounded-full pointer-events-none" style={style} />;

const InputField = ({
    label, placeholder, type = "text", value, onChange, onFocus, onBlur,
    isFocused, icon, rightSlot, prefix, error, optional = false, accentColor = "#FF6B2B"
}) => (
    <div>
        <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>
                {label}
            </label>
            {optional && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(56,189,248,0.12)", color: "#38BDF8", fontFamily: "'DM Sans', sans-serif" }}>
                    Tùy chọn
                </span>
            )}
        </div>
        <div className="relative">
            {prefix ? (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none" style={{ zIndex: 2 }}>
                    <div style={{ color: isFocused ? accentColor : "rgba(255,255,255,0.4)", transition: "color 0.3s" }}>{icon}</div>
                    <div className="w-px h-4" style={{ background: "rgba(255,255,255,0.15)" }} />
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>{prefix}</span>
                </div>
            ) : (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: isFocused ? accentColor : "rgba(255,255,255,0.4)", transition: "color 0.3s", zIndex: 2 }}>
                    {icon}
                </div>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={placeholder}
                className={error ? "error-shake" : ""}
                style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: `1.5px solid ${isFocused ? accentColor : error ? "#FB923C" : "rgba(255,255,255,0.12)"}`,
                    borderRadius: "1rem",
                    color: "white",
                    padding: `14px ${rightSlot ? "48px" : "16px"} 14px ${prefix ? "90px" : "44px"}`,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxShadow: isFocused ? `0 0 0 3px ${accentColor}28, inset 0 0 12px ${accentColor}08` : "none",
                }}
            />
            {rightSlot && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {rightSlot}
                </div>
            )}
        </div>
        {error && (
            <p className="text-xs mt-1.5" style={{ color: "#FB923C", fontFamily: "'DM Sans', sans-serif", animation: "fadeIn 0.3s ease" }}>
                ⚠ {error}
            </p>
        )}
    </div>
);

const RegisterPage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", confirm: "" });
    const [focused, setFocused] = useState(null);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [ripples, setRipples] = useState([]);
    const [agreed, setAgreed] = useState(false);
    const [step, setStep] = useState(0); // 0 = form, 1 = success

    useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

    const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

    const passwordStrength = (p) => {
        if (!p) return 0;
        let s = 0;
        if (p.length >= 6) s++;
        if (p.length >= 10) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    };

    const strength = passwordStrength(form.password);
    const strengthLabel = ["", "Rất yếu", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"][strength];
    const strengthColor = ["", "#EF4444", "#FB923C", "#FBBF24", "#38BDF8", "#22C55E"][strength];

    const validate = () => {
        const e = {};
        if (!form.name.trim() || form.name.trim().length < 2) e.name = "Tên phải có ít nhất 2 ký tự";
        if (!form.phone || form.phone.length < 9) e.phone = "Số điện thoại không hợp lệ";
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email không đúng định dạng";
        if (!form.password || form.password.length < 6) e.password = "Mật khẩu phải có ít nhất 6 ký tự";
        if (!form.confirm) e.confirm = "Vui lòng xác nhận mật khẩu";
        else if (form.confirm !== form.password) e.confirm = "Mật khẩu xác nhận không khớp";
        if (!agreed) e.agreed = "Bạn cần đồng ý với điều khoản";
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const e2 = validate();
        setErrors(e2);

        if (Object.keys(e2).length > 0) return;

        setIsLoading(true);

        try {
            const payload = {
                username: form.name,
                phoneNumber: form.phone,
                email: form.email,
                password: form.password,
                confirmPassword: form.confirm
            };

            const res = await register(payload);
            if (res.data.data.status === HttpStatusCode.Created) {
                toast.success("Đăng ký thành công");
                setStep(1); // chuyển sang màn hình success
                navigate(path.LOGIN);
            }


        } catch (err) {

            let message = "Đăng ký thất bại";

            if (err?.response?.data?.message) {
                message = err.response.data.message;
            }

            toast.error(message);

        } finally {
            setIsLoading(false);
        }
    };

    const handleRipple = (ev) => {
        const rect = ev.currentTarget.getBoundingClientRect();
        const id = Date.now();
        setRipples((p) => [...p, { x: ev.clientX - rect.left, y: ev.clientY - rect.top, id }]);
        setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 700);
    };

    const particles = [
        { width: 7, height: 7, top: "8%", left: "6%", background: "#38BDF8", opacity: 0.45, animation: "floatA 7s ease-in-out infinite" },
        { width: 5, height: 5, top: "15%", right: "9%", background: "#FF6B2B", opacity: 0.5, animation: "floatB 5s ease-in-out infinite 1s" },
        { width: 9, height: 9, top: "55%", left: "4%", background: "#0EA5E9", opacity: 0.3, animation: "floatA 9s ease-in-out infinite 2s" },
        { width: 6, height: 6, bottom: "25%", right: "7%", background: "#38BDF8", opacity: 0.4, animation: "floatB 6s ease-in-out infinite 0.5s" },
        { width: 4, height: 4, top: "35%", right: "3%", background: "#ffffff", opacity: 0.35, animation: "floatA 8s ease-in-out infinite 3s" },
        { width: 11, height: 11, bottom: "15%", left: "8%", background: "#FF6B2B", opacity: 0.2, animation: "floatB 11s ease-in-out infinite 1.5s" },
        { width: 5, height: 5, top: "75%", right: "15%", background: "#ffffff", opacity: 0.25, animation: "floatA 6s ease-in-out infinite 4s" },
    ];

    const icons = {
        user: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" /></svg>,
        phone: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.95 12a19.79 19.79 0 01-3.07-8.67A2 2 0 012.86 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
        mail: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" /><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" /></svg>,
        lock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
        eyeOff: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
        eye: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" /></svg>,
        check: <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#22C55E" strokeWidth="2" /><path d="M7 13l3 3 7-7" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-18px) rotate(180deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) translateX(0)}33%{transform:translateY(-12px) translateX(8px)}66%{transform:translateY(6px) translateX(-6px)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)} }
        @keyframes shimmer { 0%{background-position:-200% center}100%{background-position:200% center} }
        @keyframes ripple { from{transform:scale(0);opacity:.6}to{transform:scale(4);opacity:0} }
        @keyframes wave { 0%,100%{transform:scaleY(1)}50%{transform:scaleY(0.45)} }
        @keyframes shake { 0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)} }
        @keyframes pulseRing { 0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.08);opacity:.15} }
        @keyframes slideRight { from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)} }
        @keyframes successPop { 0%{opacity:0;transform:scale(0.7)}70%{transform:scale(1.08)}100%{opacity:1;transform:scale(1)} }
        @keyframes successFade { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        .font-sora{font-family:'Sora',sans-serif}
        .shimmer-text{background:linear-gradient(90deg,#fff 0%,#38BDF8 40%,#FF6B2B 60%,#fff 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
        .glass-card{background:rgba(255,255,255,0.065);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border:1px solid rgba(255,255,255,0.13)}
        .btn-register{background:linear-gradient(135deg,#FF6B2B 0%,#F97316 50%,#FB923C 100%);background-size:200% auto;transition:all .4s ease;box-shadow:0 8px 32px rgba(255,107,43,.4),0 2px 8px rgba(0,0,0,.2)}
        .btn-register:hover:not(:disabled){background-position:right center;box-shadow:0 12px 40px rgba(255,107,43,.55);transform:translateY(-2px)}
        .btn-register:disabled{opacity:.7;cursor:not-allowed}
        .social-btn{background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);transition:all .3s ease}
        .social-btn:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.25);transform:translateY(-2px)}
        .divider-line::before,.divider-line::after{content:'';flex:1;height:1px}
        .divider-line::before{background:linear-gradient(to right,transparent,rgba(255,255,255,.18))}
        .divider-line::after{background:linear-gradient(to left,transparent,rgba(255,255,255,.18))}
        .error-shake{animation:shake .4s ease}
        .feature-img-mask{mask-image:linear-gradient(to bottom,rgba(0,0,0,1) 40%,rgba(0,0,0,0) 100%);-webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,1) 40%,rgba(0,0,0,0) 100%)}
        .wave-bar{animation:wave 1.2s ease-in-out infinite}
        ::placeholder{color:rgba(255,255,255,0.28)!important}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px rgba(10,22,40,0.9) inset!important;-webkit-text-fill-color:white!important}
        .step-dot{transition:all .35s ease}
        .progress-bar{transition:width .5s cubic-bezier(.4,0,.2,1)}
      `}</style>

            <div
                className="font-sora min-h-screen w-full relative overflow-hidden flex flex-col"
                style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D1F3C 40%, #0A2847 70%, #071A35 100%)" }}
            >
                {/* Ambient blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute rounded-full" style={{ width: 400, height: 400, top: -100, right: -100, background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)" }} />
                    <div className="absolute rounded-full" style={{ width: 300, height: 300, bottom: 40, left: -80, background: "radial-gradient(circle, rgba(255,107,43,0.1) 0%, transparent 70%)" }} />
                    <div className="absolute rounded-full" style={{ width: 200, height: 200, top: "40%", left: "25%", background: "radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)" }} />
                    <div className="absolute rounded-full" style={{ width: 160, height: 160, top: "20%", right: "30%", background: "radial-gradient(circle, rgba(255,107,43,0.06) 0%, transparent 70%)" }} />
                </div>

                {/* Particles */}
                {particles.map((p, i) => <Particle key={i} style={{ ...p, position: "absolute", borderRadius: "50%", pointerEvents: "none" }} />)}

                {/* ═══ MOBILE ═══ */}
                <div className="lg:hidden flex flex-col min-h-screen">
                    {/* Feature image strip */}
                    <div className="relative w-full overflow-hidden" style={{ height: 200, animation: mounted ? "fadeIn .8s ease forwards" : "none", opacity: 0 }}>
                        <img src="feature-bg.png" alt="" className="w-full h-full object-cover feature-img-mask" style={{ filter: "brightness(0.7) saturate(1.2)" }} />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,22,40,0.15) 0%, rgba(10,22,40,0.9) 100%)" }} />

                        {/* Logo */}
                        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between" style={{ animation: mounted ? "slideRight .7s .3s both" : "none", opacity: 0 }}>
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF6B2B, #F97316)", boxShadow: "0 6px 20px rgba(255,107,43,0.4)" }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity=".9" />
                                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-white font-bold text-lg leading-tight tracking-wide">DAN</div>
                                    <div className="text-xs" style={{ color: "#38BDF8", letterSpacing: "0.15em", fontFamily: "'DM Sans',sans-serif" }}>PLATFORM</div>
                                </div>
                            </div>
                            {/* Progress indicator */}
                            <div className="flex items-center gap-1.5">
                                {[0, 1].map(i => (
                                    <div key={i} className="step-dot rounded-full" style={{ width: i === 0 ? 20 : 6, height: 6, background: i === 0 ? "#FF6B2B" : "rgba(255,255,255,0.25)" }} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form card */}
                    <div className="flex-1 px-4 pb-8 pt-2 relative z-10">
                        {step === 0 ? (
                            <div className="glass-card rounded-3xl p-5" style={{ animation: mounted ? "scaleIn .6s .4s both" : "none", opacity: 0 }}>
                                {/* Header */}
                                <div className="mb-5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #38BDF8, #FF6B2B)" }} />
                                        <span className="text-xs tracking-widest uppercase" style={{ color: "#38BDF8", fontFamily: "'DM Sans',sans-serif" }}>Tạo tài khoản</span>
                                    </div>
                                    <h1 className="text-2xl font-bold text-white leading-tight">Đăng ký</h1>
                                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans',sans-serif" }}>Điền thông tin để bắt đầu hành trình</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-3.5">
                                    {/* Name */}
                                    <InputField label="Tên người dùng" placeholder="Nguyễn Minh Đan" value={form.name} onChange={set("name")}
                                        onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} isFocused={focused === "name"}
                                        icon={icons.user} error={errors.name} accentColor="#38BDF8" />

                                    {/* Phone */}
                                    <InputField label="Số điện thoại" placeholder="98 765 4321" type="tel" value={form.phone}
                                        onChange={(e) => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, "") }))}
                                        onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} isFocused={focused === "phone"}
                                        icon={icons.phone} prefix="+84" error={errors.phone} accentColor="#FF6B2B" />

                                    {/* Email optional */}
                                    <InputField label="Email" placeholder="dan@example.com" type="email" value={form.email} onChange={set("email")}
                                        onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} isFocused={focused === "email"}
                                        icon={icons.mail} error={errors.email} optional accentColor="#38BDF8" />

                                    {/* Password */}
                                    <div>
                                        <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif" }}>Mật khẩu</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: focused === "pass" ? "#FF6B2B" : "rgba(255,255,255,0.4)", transition: "color 0.3s" }}>{icons.lock}</div>
                                            <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")}
                                                onFocus={() => setFocused("pass")} onBlur={() => setFocused(null)}
                                                placeholder="Tối thiểu 6 ký tự"
                                                className={errors.password ? "error-shake" : ""}
                                                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1.5px solid ${focused === "pass" ? "#FF6B2B" : errors.password ? "#FB923C" : "rgba(255,255,255,0.12)"}`, borderRadius: "1rem", color: "white", padding: "14px 48px 14px 44px", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", outline: "none", transition: "all .3s", boxShadow: focused === "pass" ? "0 0 0 3px rgba(255,107,43,0.2)" : "none" }} />
                                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }}>
                                                {showPass ? icons.eyeOff : icons.eye}
                                            </button>
                                        </div>
                                        {/* Strength bar */}
                                        {form.password && (
                                            <div className="mt-2">
                                                <div className="flex gap-1 mb-1">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300" style={{ background: i <= strength ? strengthColor : "rgba(255,255,255,0.1)" }} />
                                                    ))}
                                                </div>
                                                <p className="text-xs" style={{ color: strengthColor, fontFamily: "'DM Sans',sans-serif" }}>{strengthLabel}</p>
                                            </div>
                                        )}
                                        {errors.password && <p className="text-xs mt-1" style={{ color: "#FB923C", fontFamily: "'DM Sans',sans-serif" }}>⚠ {errors.password}</p>}
                                    </div>

                                    {/* Confirm password */}
                                    <div>
                                        <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif" }}>Xác nhận mật khẩu</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: focused === "confirm" ? "#38BDF8" : "rgba(255,255,255,0.4)", transition: "color 0.3s" }}>{icons.lock}</div>
                                            <input type={showConfirm ? "text" : "password"} value={form.confirm} onChange={set("confirm")}
                                                onFocus={() => setFocused("confirm")} onBlur={() => setFocused(null)}
                                                placeholder="Nhập lại mật khẩu"
                                                className={errors.confirm ? "error-shake" : ""}
                                                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1.5px solid ${focused === "confirm" ? "#38BDF8" : errors.confirm ? "#FB923C" : form.confirm && form.confirm === form.password ? "#22C55E" : "rgba(255,255,255,0.12)"}`, borderRadius: "1rem", color: "white", padding: "14px 48px 14px 44px", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", outline: "none", transition: "all .3s", boxShadow: focused === "confirm" ? "0 0 0 3px rgba(56,189,248,0.2)" : "none" }} />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                {form.confirm && form.confirm === form.password && (
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                )}
                                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ color: "rgba(255,255,255,0.4)" }}>
                                                    {showConfirm ? icons.eyeOff : icons.eye}
                                                </button>
                                            </div>
                                        </div>
                                        {errors.confirm && <p className="text-xs mt-1" style={{ color: "#FB923C", fontFamily: "'DM Sans',sans-serif" }}>⚠ {errors.confirm}</p>}
                                    </div>

                                    {/* Agree */}
                                    <div>
                                        <div className="flex items-start gap-2.5 mt-1 cursor-pointer" onClick={() => setAgreed(!agreed)}>
                                            <div className="w-4 h-4 rounded-md flex-shrink-0 flex items-center justify-center mt-0.5 transition-all duration-200"
                                                style={{ border: `1.5px solid ${agreed ? "#FF6B2B" : errors.agreed ? "#FB923C" : "rgba(255,255,255,0.25)"}`, background: agreed ? "#FF6B2B" : "rgba(255,255,255,0.05)" }}>
                                                {agreed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                            </div>
                                            <span className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif" }}>
                                                Tôi đồng ý với <span style={{ color: "#38BDF8" }}>Điều khoản dịch vụ</span> và <span style={{ color: "#38BDF8" }}>Chính sách bảo mật</span>
                                            </span>
                                        </div>
                                        {errors.agreed && <p className="text-xs mt-1 ml-6" style={{ color: "#FB923C", fontFamily: "'DM Sans',sans-serif" }}>⚠ {errors.agreed}</p>}
                                    </div>

                                    {/* Submit */}
                                    <button type="submit" onClick={handleRipple} disabled={isLoading} className="btn-register relative w-full rounded-2xl py-3.5 text-white font-semibold text-sm tracking-wide overflow-hidden mt-1">
                                        {ripples.map(r => (
                                            <span key={r.id} className="absolute rounded-full" style={{ left: r.x, top: r.y, width: 20, height: 20, marginLeft: -10, marginTop: -10, background: "rgba(255,255,255,0.3)", animation: "ripple .7s linear forwards" }} />
                                        ))}
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="flex gap-1">{[0, 1, 2].map(i => <span key={i} className="wave-bar w-1 h-4 rounded-full bg-white inline-block" style={{ animationDelay: `${i * .15}s` }} />)}</span>
                                                Đang tạo tài khoản...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                Tạo tài khoản
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </span>
                                        )}
                                    </button>
                                </form>

                                <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}>
                                    Đã có tài khoản?{" "}<span className="font-semibold cursor-pointer" style={{ color: "#FF6B2B" }}>Đăng nhập</span>
                                </p>
                            </div>
                        ) : (
                            /* Success state */
                            <div className="glass-card rounded-3xl p-8 flex flex-col items-center text-center" style={{ animation: "successPop .6s ease forwards" }}>
                                <div style={{ animation: "successPop .5s .1s both" }}>{icons.check}</div>
                                <h2 className="text-2xl font-bold text-white mt-4 mb-2" style={{ animation: "successFade .5s .3s both", opacity: 0 }}>Đăng ký thành công!</h2>
                                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif", animation: "successFade .5s .45s both", opacity: 0 }}>
                                    Chào mừng <span className="font-semibold text-white">{form.name}</span> đến với DAN Platform 🎉
                                </p>
                                <button className="btn-register mt-6 w-full rounded-2xl py-3.5 text-white font-semibold text-sm" style={{ animation: "successFade .5s .6s both", opacity: 0 }}>
                                    Đăng nhập ngay
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ═══ DESKTOP ═══ */}
                <div className="hidden lg:flex min-h-screen">

                    {/* Left panel — feature image */}
                    <div className="relative w-[45%] xl:w-[50%] overflow-hidden" style={{ animation: mounted ? "fadeIn .8s ease forwards" : "none", opacity: 0 }}>
                        <img src="feature-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.65) saturate(1.3)" }} />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(130deg, rgba(10,22,40,0.55) 0%, rgba(10,22,40,0.15) 55%, rgba(56,189,248,0.08) 100%)" }} />

                        <div className="relative h-full flex flex-col justify-between p-10 xl:p-14">
                            {/* Logo */}
                            <div style={{ animation: mounted ? "slideRight .7s .4s both" : "none", opacity: 0 }}>
                                <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF6B2B, #F97316)", boxShadow: "0 8px 24px rgba(255,107,43,0.4)" }}>
                                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity=".9" />
                                            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-xl tracking-widest">DAN</div>
                                        <div className="text-xs tracking-widest" style={{ color: "#38BDF8", fontFamily: "'DM Sans',sans-serif" }}>PLATFORM</div>
                                    </div>
                                </div>
                            </div>

                            {/* Center content */}
                            <div style={{ animation: mounted ? "slideUp .8s .55s both" : "none", opacity: 0 }}>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}>
                                    <div className="w-2 h-2 rounded-full" style={{ background: "#FF6B2B", boxShadow: "0 0 8px #FF6B2B" }} />
                                    <span className="text-xs tracking-wider" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'DM Sans',sans-serif" }}>Tham gia cộng đồng</span>
                                </div>
                                <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                                    Bắt đầu<br />
                                    <span className="shimmer-text">hành trình mới</span>
                                </h2>
                                <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 340, fontFamily: "'DM Sans',sans-serif" }}>
                                    Chỉ mất vài giây để tạo tài khoản và trải nghiệm toàn bộ tính năng vượt trội của nền tảng.
                                </p>

                                {/* Steps */}
                                <div className="mt-8 space-y-3">
                                    {[
                                        { icon: "01", text: "Điền thông tin cá nhân", color: "#FF6B2B" },
                                        { icon: "02", text: "Thiết lập mật khẩu bảo mật", color: "#38BDF8" },
                                        { icon: "03", text: "Bắt đầu sử dụng ngay", color: "#22C55E" },
                                    ].map((s) => (
                                        <div key={s.icon} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                                                style={{ background: `${s.color}22`, border: `1px solid ${s.color}44`, color: s.color }}>
                                                {s.icon}
                                            </div>
                                            <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans',sans-serif" }}>{s.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom promo card */}
                            <div className="glass-card rounded-2xl p-5" style={{ animation: mounted ? "slideUp .8s .75s both" : "none", opacity: 0 }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex -space-x-2">
                                        {["#38BDF8", "#FF6B2B", "#22C55E", "#A78BFA"].map((c, i) => (
                                            <div key={i} className="w-7 h-7 rounded-full border-2" style={{ background: `linear-gradient(135deg, ${c}, ${c}99)`, borderColor: "rgba(10,22,40,0.8)" }} />
                                        ))}
                                    </div>
                                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif" }}>
                                        <span className="font-semibold text-white">+2,000,000</span> thành viên đang hoạt động
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    {[{ label: "Miễn phí", sub: "Đăng ký", color: "#22C55E" }, { label: "Bảo mật", sub: "Tuyệt đối", color: "#38BDF8" }, { label: "Hỗ trợ", sub: "24/7", color: "#FF6B2B" }].map(s => (
                                        <div key={s.label} className="flex-1 rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                                            <div className="text-sm font-bold" style={{ color: s.color }}>{s.label}</div>
                                            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}>{s.sub}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right panel — Register form */}
                    <div className="w-[55%] xl:w-[50%] flex items-center justify-center p-8 xl:p-12 relative overflow-y-auto">
                        <div className="w-full max-w-lg" style={{ animation: mounted ? "scaleIn .7s .35s both" : "none", opacity: 0 }}>

                            {step === 0 ? (
                                <>
                                    <div className="mb-7">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(180deg, #38BDF8, #FF6B2B)" }} />
                                                <span className="text-xs tracking-widest uppercase" style={{ color: "#38BDF8", fontFamily: "'DM Sans',sans-serif" }}>Tạo tài khoản mới</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>Bước 1/1</span>
                                                <div className="flex gap-1">
                                                    <div className="h-1.5 w-12 rounded-full" style={{ background: "#FF6B2B" }} />
                                                    <div className="h-1.5 w-6 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
                                                </div>
                                            </div>
                                        </div>
                                        <h1 className="text-4xl font-bold text-white mb-1.5">Đăng ký</h1>
                                        <p style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans',sans-serif" }}>Điền thông tin bên dưới để tạo tài khoản</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Row: Name + Phone */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Name */}
                                            <div>
                                                <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif" }}>Tên người dùng</label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: focused === "nameD" ? "#38BDF8" : "rgba(255,255,255,0.4)", transition: "color .3s" }}>{icons.user}</div>
                                                    <input type="text" value={form.name} onChange={set("name")}
                                                        onFocus={() => setFocused("nameD")} onBlur={() => setFocused(null)}
                                                        placeholder="Minh Đan"
                                                        className={errors.name ? "error-shake" : ""}
                                                        style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1.5px solid ${focused === "nameD" ? "#38BDF8" : errors.name ? "#FB923C" : "rgba(255,255,255,0.12)"}`, borderRadius: "1rem", color: "white", padding: "14px 16px 14px 44px", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", outline: "none", transition: "all .3s", boxShadow: focused === "nameD" ? "0 0 0 3px rgba(56,189,248,0.18)" : "none" }} />
                                                </div>
                                                {errors.name && <p className="text-xs mt-1" style={{ color: "#FB923C", fontFamily: "'DM Sans',sans-serif" }}>⚠ {errors.name}</p>}
                                            </div>

                                            {/* Phone */}
                                            <div>
                                                <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif" }}>Số điện thoại</label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                                                        <div style={{ color: focused === "phoneD" ? "#FF6B2B" : "rgba(255,255,255,0.4)", transition: "color .3s" }}>{icons.phone}</div>
                                                        <div className="w-px h-4" style={{ background: "rgba(255,255,255,0.15)" }} />
                                                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans',sans-serif" }}>+84</span>
                                                    </div>
                                                    <input type="tel" value={form.phone}
                                                        onChange={(e) => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, "") }))}
                                                        onFocus={() => setFocused("phoneD")} onBlur={() => setFocused(null)}
                                                        placeholder="987 654 321"
                                                        className={errors.phone ? "error-shake" : ""}
                                                        style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1.5px solid ${focused === "phoneD" ? "#FF6B2B" : errors.phone ? "#FB923C" : "rgba(255,255,255,0.12)"}`, borderRadius: "1rem", color: "white", padding: "14px 12px 14px 84px", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", outline: "none", transition: "all .3s", boxShadow: focused === "phoneD" ? "0 0 0 3px rgba(255,107,43,0.18)" : "none" }} />
                                                </div>
                                                {errors.phone && <p className="text-xs mt-1" style={{ color: "#FB923C", fontFamily: "'DM Sans',sans-serif" }}>⚠ {errors.phone}</p>}
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-xs font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif" }}>Email</label>
                                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(56,189,248,0.1)", color: "#38BDF8", fontFamily: "'DM Sans',sans-serif" }}>Tùy chọn</span>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: focused === "emailD" ? "#38BDF8" : "rgba(255,255,255,0.4)", transition: "color .3s" }}>{icons.mail}</div>
                                                <input type="email" value={form.email} onChange={set("email")}
                                                    onFocus={() => setFocused("emailD")} onBlur={() => setFocused(null)}
                                                    placeholder="dan@example.com"
                                                    style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1.5px solid ${focused === "emailD" ? "#38BDF8" : errors.email ? "#FB923C" : "rgba(255,255,255,0.12)"}`, borderRadius: "1rem", color: "white", padding: "14px 16px 14px 44px", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", outline: "none", transition: "all .3s", boxShadow: focused === "emailD" ? "0 0 0 3px rgba(56,189,248,0.18)" : "none" }} />
                                            </div>
                                            {errors.email && <p className="text-xs mt-1" style={{ color: "#FB923C", fontFamily: "'DM Sans',sans-serif" }}>⚠ {errors.email}</p>}
                                        </div>

                                        {/* Row: Password + Confirm */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Password */}
                                            <div>
                                                <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif" }}>Mật khẩu</label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: focused === "passD" ? "#FF6B2B" : "rgba(255,255,255,0.4)", transition: "color .3s" }}>{icons.lock}</div>
                                                    <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")}
                                                        onFocus={() => setFocused("passD")} onBlur={() => setFocused(null)}
                                                        placeholder="Tối thiểu 6 ký tự"
                                                        className={errors.password ? "error-shake" : ""}
                                                        style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1.5px solid ${focused === "passD" ? "#FF6B2B" : errors.password ? "#FB923C" : "rgba(255,255,255,0.12)"}`, borderRadius: "1rem", color: "white", padding: "14px 44px 14px 44px", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", outline: "none", transition: "all .3s", boxShadow: focused === "passD" ? "0 0 0 3px rgba(255,107,43,0.18)" : "none" }} />
                                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }}>
                                                        {showPass ? icons.eyeOff : icons.eye}
                                                    </button>
                                                </div>
                                                {form.password && (
                                                    <div className="mt-1.5 flex gap-1">
                                                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300" style={{ background: i <= strength ? strengthColor : "rgba(255,255,255,0.1)" }} />)}
                                                    </div>
                                                )}
                                                {errors.password && <p className="text-xs mt-1" style={{ color: "#FB923C", fontFamily: "'DM Sans',sans-serif" }}>⚠ {errors.password}</p>}
                                            </div>

                                            {/* Confirm */}
                                            <div>
                                                <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif" }}>Xác nhận mật khẩu</label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: focused === "confirmD" ? "#38BDF8" : "rgba(255,255,255,0.4)", transition: "color .3s" }}>{icons.lock}</div>
                                                    <input type={showConfirm ? "text" : "password"} value={form.confirm} onChange={set("confirm")}
                                                        onFocus={() => setFocused("confirmD")} onBlur={() => setFocused(null)}
                                                        placeholder="Nhập lại"
                                                        className={errors.confirm ? "error-shake" : ""}
                                                        style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1.5px solid ${focused === "confirmD" ? "#38BDF8" : errors.confirm ? "#FB923C" : form.confirm && form.confirm === form.password ? "#22C55E" : "rgba(255,255,255,0.12)"}`, borderRadius: "1rem", color: "white", padding: "14px 44px 14px 44px", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", outline: "none", transition: "all .3s", boxShadow: focused === "confirmD" ? "0 0 0 3px rgba(56,189,248,0.18)" : "none" }} />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                                        {form.confirm && form.confirm === form.password && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ color: "rgba(255,255,255,0.4)" }}>{showConfirm ? icons.eyeOff : icons.eye}</button>
                                                    </div>
                                                </div>
                                                {errors.confirm && <p className="text-xs mt-1" style={{ color: "#FB923C", fontFamily: "'DM Sans',sans-serif" }}>⚠ {errors.confirm}</p>}
                                            </div>
                                        </div>

                                        {/* Password strength label */}
                                        {form.password && (
                                            <p className="text-xs -mt-1" style={{ color: strengthColor, fontFamily: "'DM Sans',sans-serif" }}>
                                                Độ mạnh mật khẩu: <span className="font-semibold">{strengthLabel}</span>
                                            </p>
                                        )}

                                        {/* Terms */}
                                        <div>
                                            <div className="flex items-start gap-3 cursor-pointer" onClick={() => setAgreed(!agreed)}>
                                                <div className="w-4 h-4 rounded-md flex-shrink-0 flex items-center justify-center mt-0.5 transition-all duration-200"
                                                    style={{ border: `1.5px solid ${agreed ? "#FF6B2B" : errors.agreed ? "#FB923C" : "rgba(255,255,255,0.25)"}`, background: agreed ? "#FF6B2B" : "rgba(255,255,255,0.05)" }}>
                                                    {agreed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                </div>
                                                <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif" }}>
                                                    Tôi đồng ý với <span style={{ color: "#38BDF8" }}>Điều khoản dịch vụ</span> và <span style={{ color: "#38BDF8" }}>Chính sách bảo mật</span> của DAN Platform
                                                </span>
                                            </div>
                                            {errors.agreed && <p className="text-xs mt-1 ml-7" style={{ color: "#FB923C", fontFamily: "'DM Sans',sans-serif" }}>⚠ {errors.agreed}</p>}
                                        </div>

                                        {/* Submit */}
                                        <button type="submit" onClick={handleRipple} disabled={isLoading} className="btn-register relative w-full rounded-2xl py-4 text-white font-semibold tracking-wide overflow-hidden">
                                            {ripples.map(r => (
                                                <span key={r.id} className="absolute rounded-full" style={{ left: r.x, top: r.y, width: 20, height: 20, marginLeft: -10, marginTop: -10, background: "rgba(255,255,255,0.3)", animation: "ripple .7s linear forwards" }} />
                                            ))}
                                            {isLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <span className="flex gap-1 items-end">{[0, 1, 2].map(i => <span key={i} className="wave-bar w-1.5 h-5 rounded-full bg-white inline-block" style={{ animationDelay: `${i * .15}s` }} />)}</span>
                                                    Đang tạo tài khoản...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    Tạo tài khoản ngay
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </span>
                                            )}
                                        </button>
                                    </form>

                                    {/* Divider */}
                                    <div className="flex items-center gap-3 my-5 divider-line">
                                        <span className="text-xs px-3" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>hoặc đăng ký với</span>
                                    </div>

                                    {/* Social */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { name: "Google", icon: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg> },
                                            { name: "Zalo", icon: <svg width="20" height="20" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#0068FF" /><text x="12" y="17" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">Z</text></svg> },
                                        ].map(s => (
                                            <button key={s.name} className="social-btn rounded-2xl py-3.5 flex items-center justify-center gap-3" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'DM Sans',sans-serif" }}>
                                                {s.icon}{s.name}
                                            </button>
                                        ))}
                                    </div>

                                    <p className="text-center text-sm mt-5" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}>
                                        Đã có tài khoản?{" "}<span className="font-semibold cursor-pointer" style={{ color: "#FF6B2B" }}>Đăng nhập ngay</span>
                                    </p>
                                </>
                            ) : (
                                /* Desktop success */
                                <div className="flex flex-col items-center text-center" style={{ animation: "successPop .6s ease forwards" }}>
                                    <div style={{ animation: "successPop .5s .1s both", fontSize: 64 }}>🎉</div>
                                    <div className="mt-4" style={{ animation: "successFade .5s .25s both", opacity: 0 }}>{icons.check}</div>
                                    <h2 className="text-4xl font-bold text-white mt-4 mb-3" style={{ animation: "successFade .5s .35s both", opacity: 0 }}>Đăng ký thành công!</h2>
                                    <p className="text-lg" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif", animation: "successFade .5s .5s both", opacity: 0 }}>
                                        Xin chào <span className="font-semibold text-white">{form.name}</span>!<br />Tài khoản của bạn đã sẵn sàng.
                                    </p>
                                    <button className="btn-register mt-8 rounded-2xl py-4 px-12 text-white font-semibold text-lg" style={{ animation: "successFade .5s .65s both", opacity: 0 }}>
                                        Đăng nhập ngay
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegisterPage;