import { useEffect, useRef } from "react";

const REASONS = [
  {
    n: "01",
    t: "Trực tiếp từ tàu",
    b: "Bạch tuộc được thu mua trực tiếp từ tàu đánh bắt tại Hòn Đá Bạc, không qua trung gian."
  },
  {
    n: "02",
    t: "Tươi sống mỗi ngày",
    b: "Hải sản được lựa chọn và xử lý ngay sau khi cập bến, giữ trọn độ giòn tự nhiên."
  },
  {
    n: "03",
    t: "Chuyên một sản phẩm",
    b: "Chúng tôi chỉ tập trung vào bạch tuộc để đảm bảo chất lượng tốt nhất."
  },
  {
    n: "04",
    t: "Cam kết rõ ràng",
    b: "Đảm bảo 100% hàng tươi mới, không pha trộn, không cấp đông lâu ngày."
  },
];

const HomePage = () => {
  const refs = useRef([]);
  const r = (el) => { if (el && !refs.current.includes(el)) refs.current.push(el); };

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const d = parseFloat(e.target.dataset.delay || 0);
          setTimeout(() => e.target.classList.add("on"), d * 1000);
        }
      }),
      { threshold: 0.08 }
    );
    refs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="pg">

      {/* ════ HERO ════ */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-splash" />

        {/* Floating Octopus */}
        <div className="hero-float float-octopus img-float">
          <img src="/bach-tuoc.png" alt="Bạch tuộc" />
        </div>

        {/* Background word */}
        <div style={{
          position: "absolute",
          bottom: "2%",
          right: "-1%",
          fontFamily: "'Playfair Display',serif",
          fontWeight: 900,
          fontSize: "clamp(120px,22vw,280px)",
          lineHeight: 1,
          color: "rgba(27,42,59,.03)",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 1,
          letterSpacing: "-.04em",
        }}>
          DAN
        </div>

        <div className="hero-inner" style={{ animation: "rise .9s .1s both" }}>
          <div className="hero-vline" />

          <div className="hero-badge">
            <span className="hero-dot" />&nbsp;Hòn Đá Bạc · Cà Mau
          </div>

          <div className="hero-title-wrap">
            <span className="hero-t1">MINH<br />HOÀNG</span>
            <span className="hero-t2">Bạch Tuộc Tươi Ngon</span>
            <span className="hero-t3">Chuyên bạch tuộc tươi · trực tiếp từ biển</span>
          </div>

          <p className="hero-desc">
            Chúng tôi chỉ bán duy nhất bạch tuộc tươi đánh bắt trong ngày,
            tuyển chọn kỹ lưỡng và giao đến tay khách khi còn nguyên độ giòn tự nhiên.
          </p>

          <div className="hero-cta animate-bounce">
            <a href="tel:0869518622" className="btn btn-fill ">📞 Đặt hàng ngay</a>
          </div>
        </div>

        <div className="hero-stats">
          {[{ v: "100%", l: "Bạch tuộc tươi" }, { v: "24h", l: "Làm lạnh nhanh" }, { v: "0%", l: "Pha trộn" }].map((s) => (
            <div key={s.l} className="hstat">
              <div className="hstat-v">{s.v}</div>
              <div className="hstat-l">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ WHOLESALE ════ */}
      <section className="wholesale-sec">
        {/* Decorative blobs */}
        <div className="wh-blob wh-blob-1" />
        <div className="wh-blob wh-blob-2" />

        <div className="wholesale-inner">

          {/* Left — text content */}
          <div className="wh-left">
            <div className="wh-badge-wrap">
              <span className="wh-badge">
                <span className="wh-badge-dot" />
                Dành cho khách sỉ
              </span>
            </div>

            <h3 className="wh-title">
              Cần đặt<br />
              <em>số lượng lớn?</em>
            </h3>

            <p className="wh-desc">
              Ngoài bạch tuộc, chúng tôi còn cung cấp
              các mặt hàng hải sản tươi khác theo số lượng lớn.
              Liên hệ trực tiếp để được báo giá tốt nhất từ vựa.
            </p>

            {/* Seafood chips */}
            <div className="wh-tags">
              {["🐙 Bạch tuộc", "🦐 Tôm", "🦀 Cua", "🦀 Ghẹ", "🦑 Mực"].map(tag => (
                <span className="wh-tag" key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Right — CTA card */}
          <div className="wh-cta-card">
            <div className="wh-cta-icon">🚢</div>
            <div className="wh-cta-label">Trực tiếp từ vựa</div>
            <div className="wh-cta-sub">Giá tốt · Hàng tươi · Số lượng lớn</div>
            <a href="tel:0869518622" className="btn btn-fill wh-btn">
              📞 Liên hệ tư vấn sỉ
            </a>
            <div className="wh-phone">0869 518 622</div>
          </div>

        </div>
      </section>

      {/* ════ PRODUCT SECTION ════ */}
      <section className="prod-sec">
        <div style={{ maxWidth: 980, margin: "0 auto" }}>

          <div ref={r} className="rv" style={{ marginBottom: 40 }}>
            <span className="sec-label">Sản phẩm duy nhất</span>
            <h2 className="sec-h">
              Bạch tuộc tươi<br />
              <em>đánh bắt trong ngày</em>
            </h2>
          </div>

          <div ref={r} className="rvs feat-card" data-delay="0.05">
            <div className="feat-img">
              <img
                src="/bach-tuoc.png"
                alt="Bạch tuộc tươi"
                style={{
                  width: "clamp(200px,25vw,320px)",
                  height: "auto",
                  objectFit: "contain",
                  zIndex: 2
                }}
              />
            </div>

            <div className="feat-body">
              <span className="ptag" style={{ marginBottom: 14, display: "inline-block" }}>
                Bán chạy
              </span>

              <h3 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(1.5rem,4vw,2.2rem)",
                fontWeight: 900,
                color: "white",
                marginBottom: 12,
                lineHeight: 1.1
              }}>
                Bạch Tuộc Cà Mau
              </h3>

              <p style={{
                color: "rgba(255,255,255,.55)",
                fontSize: ".88rem",
                lineHeight: 1.8,
                fontWeight: 300,
                marginBottom: 24
              }}>
                Thịt giòn tự nhiên · ngọt thanh · phù hợp nướng, hấp,
                xào, nhúng lẩu hoặc chế biến món hải sản cao cấp.
              </p>

              <a href="tel:0869518622" className="btn btn-fill" style={{ alignSelf: "flex-start" }}>
                Đặt ngay →
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ════ WHY US ════ */}
      <section className="why-sec">
        <div style={{ maxWidth: 980, margin: "0 auto", paddingTop: 40 }}>
          <div ref={r} className="rv" style={{ marginBottom: 48, textAlign: "center" }}>
            <span className="sec-label" style={{ color: "rgba(143,164,181,.7)", marginBottom: 12 }}>
              Tại sao chọn chúng tôi
            </span>
            <h2 style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(1.8rem,5vw,3rem)",
              fontWeight: 900,
              color: "var(--white)",
              lineHeight: 1.1
            }}>
              Chuyên biệt<br />
              <em style={{ fontStyle: "italic", color: "var(--mist)" }}>chất lượng cao</em>
            </h2>
          </div>

          <div className="why-grid">
            {REASONS.map((re, i) => (
              <div key={re.n} ref={r} className="rv why-card" data-delay={`${i * .1}`}>
                <div className="why-num">{re.n}</div>
                <div className="why-t">{re.t}</div>
                <div className="why-b">{re.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CONTACT ════ */}
      <section className="contact-sec">
        <div className="contact-inner">
          <div ref={r} className="rvr">
            <span className="sec-label">Liên hệ đặt hàng</span>
            <h2 className="contact-h">
              Đặt bạch tuộc<br />ngay hôm nay
            </h2>

            <p style={{
              color: "var(--muted)",
              lineHeight: 1.88,
              fontSize: ".9rem",
              fontWeight: 300,
              marginBottom: 28
            }}>
              Tư vấn miễn phí · phản hồi nhanh chóng
            </p>

            <a href="tel:0869518622" className="btn btn-fill" style={{ fontSize: "1rem", padding: "16px 32px" }}>
              📲 Gọi ngay
            </a>
          </div>

          <div ref={r} className="rvl contact-card">
            <div className="irow">
              <div>
                <div className="ilabel">Thương hiệu</div>
                <div className="ival" style={{ color: "rgba(255,255,255,.88)", fontWeight: 500 }}>
                  Hải Sản Minh Hoàng Cà Mau
                </div>
              </div>
            </div>

            <div className="irow">
              <div>
                <div className="ilabel">Hotline</div>
                <a href="tel:0869518622" className="phone-big">0869 518 622</a>
              </div>
            </div>

            <a href="tel:0869518622" className="btn btn-fill" style={{ width: "100%", justifyContent: "center", fontSize: ".95rem", padding: "15px" }}>
              Gọi ngay — 0869 518 622
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;