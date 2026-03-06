import { useEffect, useRef } from "react";

const PRODUCTS = [
  {
    icon: "🦑",
    name: "Mực Tua",
    desc: "Mực tua tươi / đông lạnh chất lượng cao, thịt dày giòn ngọt, phù hợp nướng, chiên, xào.",
  },
  {
    icon: "🦑",
    name: "Mực Ống",
    desc: "Mực ống tươi / đông lạnh, thịt trắng dai ngon, lý tưởng cho hấp, nhúng lẩu, làm sushi.",
  },
  {
    icon: "🌊",
    name: "Mực Khô",
    desc: "Cung cấp theo yêu cầu. Mực khô nguyên con, phơi nắng tự nhiên, hương vị đậm đà.",
  },
];

const REASONS = [
  {
    n: "01",
    t: "Nguồn gốc rõ ràng",
    b: "Mực được thu mua trực tiếp từ tàu đánh bắt tại Hòn Đá Bạc, Cà Mau — không qua trung gian.",
  },
  {
    n: "02",
    t: "Tươi & đông lạnh đúng chuẩn",
    b: "Sản phẩm tươi xử lý ngay sau khi cập bến; hàng đông lạnh cấp đông nhanh giữ trọn chất lượng.",
  },
  {
    n: "03",
    t: "Chuyên mực các loại",
    b: "Tập trung chuyên sâu vào mực tua, mực ống và mực khô để đảm bảo chất lượng tốt nhất.",
  },
  {
    n: "04",
    t: "Cam kết minh bạch",
    b: "100% hàng thật, không pha trộn, không gian lận trọng lượng. Hài lòng hoặc hoàn tiền.",
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

        {/* Floating image */}
        <div className="hero-float float-octopus img-float">
          <img src="/bach-tuoc.png" alt="Mực tươi" />
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
          MUC
        </div>

        <div className="hero-inner" style={{ animation: "rise .9s .1s both" }}>
          <div className="hero-vline" />

          <div className="hero-badge">
            <span className="hero-dot" />&nbsp;Hòn Đá Bạc · Cà Mau
          </div>

          <div className="hero-title-wrap">
            <span className="hero-t1">MINH<br />HOÀNG</span>
            <span className="hero-t2">Mực Tươi & Đông Lạnh</span>
            <span className="hero-t3">Chuyên mực tươi · đông lạnh · trực tiếp từ biển</span>
          </div>

          <p className="hero-desc">
            Chuyên cung cấp mực tua, mực ống tươi và đông lạnh đánh bắt tại Cà Mau.
            Có mực khô theo yêu cầu. Hải sản khác cung cấp số lượng lớn — liên hệ tư vấn.
          </p>

          <div className="hero-cta animate-bounce">
            <a href="tel:0869518622" className="btn btn-fill">📞 Đặt hàng ngay</a>
          </div>
        </div>

        <div className="hero-stats">
          {[
            { v: "Tươi &", l: "Đông lạnh" },
            { v: "100%", l: "Không pha trộn" },
            { v: "SL lớn", l: "Hải sản khác" },
          ].map((s) => (
            <div key={s.l} className="hstat">
              <div className="hstat-v">{s.v}</div>
              <div className="hstat-l">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ PRODUCT SECTION ════ */}
      <section className="prod-sec">
        <div style={{ maxWidth: 980, margin: "0 auto" }}>

          <div ref={r} className="rv" style={{ marginBottom: 40 }}>
            <span className="sec-label">Sản phẩm chính</span>
            <h2 className="sec-h">
              Mực tươi & đông lạnh<br />
              <em>các loại từ Cà Mau</em>
            </h2>
          </div>

          {/* Product cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginBottom: 40,
          }}>
            {PRODUCTS.map((p, i) => (
              <div
                key={p.name}
                ref={r}
                className="rv why-card"
                data-delay={`${i * 0.1}`}
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <div style={{ fontSize: "2rem" }}>{p.icon}</div>
                <div className="why-t">{p.name}</div>
                <div className="why-b">{p.desc}</div>
                <a
                  href="tel:0869518622"
                  className="btn btn-fill"
                  style={{ marginTop: "auto", alignSelf: "flex-start", fontSize: ".82rem", padding: "10px 18px" }}
                >
                  Đặt ngay →
                </a>
              </div>
            ))}
          </div>

          {/* Mực khô note */}
          <div ref={r} className="rv feat-card" data-delay="0.1" style={{ alignItems: "center", gap: 24 }}>
            <div style={{ fontSize: "3rem" }}>🌞</div>
            <div className="feat-body" style={{ padding: 0 }}>
              <span className="ptag" style={{ marginBottom: 10, display: "inline-block" }}>Theo yêu cầu</span>
              <h3 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(1.3rem,3vw,1.8rem)",
                fontWeight: 900,
                color: "white",
                marginBottom: 10,
                lineHeight: 1.2,
              }}>
                Mực Khô Cà Mau
              </h3>
              <p style={{
                color: "rgba(255,255,255,.55)",
                fontSize: ".88rem",
                lineHeight: 1.8,
                fontWeight: 300,
                marginBottom: 0,
              }}>
                Cung cấp mực khô nguyên con theo số lượng yêu cầu.
                Phơi nắng tự nhiên, hương đậm đà. Liên hệ để đặt và báo giá.
              </p>
            </div>
            <a href="tel:0869518622" className="btn btn-fill" style={{ alignSelf: "center", whiteSpace: "nowrap" }}>
              Liên hệ →
            </a>
          </div>

        </div>
      </section>

      {/* ════ WHOLESALE ════ */}
      <section className="wholesale-sec">
        <div className="wh-blob wh-blob-1" />
        <div className="wh-blob wh-blob-2" />

        <div className="wholesale-inner">

          <div className="wh-left">
            <div className="wh-badge-wrap">
              <span className="wh-badge">
                <span className="wh-badge-dot" />
                Hải sản khác theo yêu cầu
              </span>
            </div>

            <h3 className="wh-title">
              Cần hải sản<br />
              <em>số lượng lớn?</em>
            </h3>

            <p className="wh-desc">
              Ngoài mực, chúng tôi có thể cung cấp các loại hải sản tươi khác
              theo yêu cầu với số lượng lớn. Liên hệ trực tiếp để trao đổi và
              được báo giá tốt nhất từ vựa.
            </p>

            <div className="wh-tags">
              {["🦑 Mực tua", "🦑 Mực ống", "🌊 Mực khô", "🦐 Tôm", "🦀 Cua", "🦀 Ghẹ"].map(tag => (
                <span className="wh-tag" key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="wh-cta-card">
            <div className="wh-cta-icon">🚢</div>
            <div className="wh-cta-label">Trực tiếp từ vựa</div>
            <div className="wh-cta-sub">Giá tốt · Hàng tươi & đông lạnh · Số lượng lớn</div>
            <a href="tel:0869518622" className="btn btn-fill wh-btn">
              📞 Liên hệ tư vấn
            </a>
            <div className="wh-phone">0869 518 622</div>
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
              lineHeight: 1.1,
            }}>
              Chuyên biệt<br />
              <em style={{ fontStyle: "italic", color: "var(--mist)" }}>chất lượng cao</em>
            </h2>
          </div>

          <div className="why-grid">
            {REASONS.map((re, i) => (
              <div key={re.n} ref={r} className="rv why-card" data-delay={`${i * 0.1}`}>
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
              Đặt mực tươi<br />ngay hôm nay
            </h2>

            <p style={{
              color: "var(--muted)",
              lineHeight: 1.88,
              fontSize: ".9rem",
              fontWeight: 300,
              marginBottom: 28,
            }}>
              Tư vấn miễn phí · phản hồi nhanh chóng · hải sản khác theo yêu cầu
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