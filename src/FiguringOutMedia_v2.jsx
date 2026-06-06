import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES injected into <head>
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --black: #030303;
      --charcoal: #0e0e12;
      --dark: #12121a;
      --card: rgba(18,18,26,0.75);
      --blue: #1a8cff;
      --blue-glow: rgba(26,140,255,0.35);
      --purple: #7b2fff;
      --purple-glow: rgba(123,47,255,0.3);
      --silver: #a8b2c0;
      --silver-light: #d4dce8;
      --neon: #00d4ff;
      --neon-glow: rgba(0,212,255,0.4);
      --gold: #c9a84c;
      --font-display: 'Bebas Neue', sans-serif;
      --font-serif: 'Cormorant Garamond', serif;
      --font-body: 'DM Sans', sans-serif;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--black);
      color: var(--silver-light);
      font-family: var(--font-body);
      cursor: none;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 2px; }

    /* Custom Cursor */
    .cursor-outer {
      position: fixed; top: 0; left: 0;
      width: 36px; height: 36px;
      border: 1.5px solid var(--neon);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%,-50%);
      transition: transform 0.12s ease, width 0.2s, height 0.2s, border-color 0.2s, background 0.2s;
      mix-blend-mode: normal;
    }
    .cursor-inner {
      position: fixed; top: 0; left: 0;
      width: 6px; height: 6px;
      background: var(--neon);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%,-50%);
      transition: transform 0.05s ease;
      box-shadow: 0 0 8px var(--neon);
    }
    .cursor-outer.hovering {
      width: 60px; height: 60px;
      background: rgba(0,212,255,0.08);
      border-color: var(--blue);
    }

    /* Noise overlay */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
      pointer-events: none; z-index: 1; opacity: 0.4;
    }

    /* Gradient mesh background */
    .mesh-bg {
      position: absolute; inset: 0; overflow: hidden; z-index: 0;
    }
    .mesh-bg::after {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 80% 60% at 20% 20%, rgba(26,140,255,0.12) 0%, transparent 60%),
                  radial-gradient(ellipse 60% 80% at 80% 80%, rgba(123,47,255,0.1) 0%, transparent 60%),
                  radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%);
      animation: meshFloat 12s ease-in-out infinite alternate;
    }
    @keyframes meshFloat {
      0%   { transform: scale(1) translate(0,0); }
      50%  { transform: scale(1.05) translate(-1%, 1%); }
      100% { transform: scale(1.02) translate(1%, -1%); }
    }

    /* Animated gradient text */
    .grad-text {
      background: linear-gradient(135deg, #ffffff 0%, var(--neon) 40%, var(--blue) 70%, var(--purple) 100%);
      background-size: 300% 300%;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradShift 6s ease infinite;
    }
    @keyframes gradShift {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }

    /* Glowing line */
    .glow-line {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--neon), var(--blue), var(--purple), transparent);
      box-shadow: 0 0 12px var(--neon-glow);
    }

    /* Glass card */
    .glass {
      background: rgba(18,18,26,0.65);
      backdrop-filter: blur(20px) saturate(1.4);
      border: 1px solid rgba(255,255,255,0.07);
    }
    .glass-bright {
      background: rgba(26,26,40,0.8);
      backdrop-filter: blur(24px) saturate(1.6);
      border: 1px solid rgba(0,212,255,0.15);
    }

    /* Section transitions */
    .section-reveal {
      opacity: 0; transform: translateY(40px);
      transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
    }
    .section-reveal.visible { opacity: 1; transform: translateY(0); }

    /* Nav */
    .nav-link {
      position: relative; font-family: var(--font-body); font-size: 13px;
      letter-spacing: 0.12em; text-transform: uppercase; color: var(--silver);
      text-decoration: none; transition: color 0.3s;
    }
    .nav-link::after {
      content: ''; position: absolute; bottom: -3px; left: 0;
      width: 0; height: 1px; background: var(--neon);
      box-shadow: 0 0 6px var(--neon); transition: width 0.3s;
    }
    .nav-link:hover { color: white; }
    .nav-link:hover::after, .nav-link.active::after { width: 100%; }
    .nav-link.active { color: var(--neon); }

    /* Hero video */
    .hero-video {
      position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: cover; opacity: 0.35;
    }

    /* Stat counter */
    .stat-num {
      font-family: var(--font-display);
      font-size: clamp(2.5rem, 5vw, 4.5rem);
      line-height: 1;
      background: linear-gradient(135deg, white, var(--neon));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Service card hover */
    .service-card {
      transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s, border-color 0.4s;
      cursor: none;
    }
    .service-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 24px 60px rgba(26,140,255,0.2), 0 0 0 1px rgba(0,212,255,0.25);
      border-color: rgba(0,212,255,0.3) !important;
    }

    /* Portfolio card */
    .portfolio-card {
      transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s;
      cursor: none; overflow: hidden;
    }
    .portfolio-card:hover { transform: scale(1.03); }
    .portfolio-card .overlay {
      opacity: 0; transition: opacity 0.4s;
    }
    .portfolio-card:hover .overlay { opacity: 1; }
    .portfolio-card img {
      transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
    }
    .portfolio-card:hover img { transform: scale(1.08); }

    /* Team card */
    .team-card:hover .team-img { transform: scale(1.05); }
    .team-img { transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); }

    /* Input */
    .luxury-input {
      background: rgba(18,18,26,0.8);
      border: 1px solid rgba(255,255,255,0.08);
      color: white; font-family: var(--font-body);
      transition: border-color 0.3s, box-shadow 0.3s;
      outline: none;
    }
    .luxury-input:focus {
      border-color: rgba(0,212,255,0.4);
      box-shadow: 0 0 20px rgba(0,212,255,0.1);
    }
    .luxury-input::placeholder { color: rgba(168,178,192,0.4); }

    /* Marquee */
    @keyframes marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .marquee-track { animation: marquee 22s linear infinite; }
    .marquee-track:hover { animation-play-state: paused; }

    /* Ticker line */
    @keyframes ticker {
      0%   { transform: translateX(100vw); }
      100% { transform: translateX(-100%); }
    }
    .ticker { animation: ticker 28s linear infinite; white-space: nowrap; }

    /* Floating particles */
    @keyframes floatUp {
      0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 0.6; }
      100% { transform: translateY(-100vh) translateX(var(--dx)) scale(0.5); opacity: 0; }
    }
    .particle {
      position: absolute; border-radius: 50%;
      animation: floatUp var(--dur) linear infinite;
      animation-delay: var(--delay);
    }

    /* Neon button */
    .btn-neon {
      position: relative; overflow: hidden;
      background: transparent;
      border: 1px solid rgba(0,212,255,0.5);
      color: var(--neon); font-family: var(--font-body);
      letter-spacing: 0.15em; text-transform: uppercase;
      transition: color 0.3s, box-shadow 0.3s;
      cursor: none;
    }
    .btn-neon::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(26,140,255,0.1));
      transform: scaleX(0); transform-origin: left;
      transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
    }
    .btn-neon:hover::before { transform: scaleX(1); }
    .btn-neon:hover {
      box-shadow: 0 0 30px rgba(0,212,255,0.3), inset 0 0 20px rgba(0,212,255,0.05);
      color: white;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--blue), var(--purple));
      border: none; color: white;
      font-family: var(--font-body);
      letter-spacing: 0.1em; text-transform: uppercase;
      transition: opacity 0.3s, box-shadow 0.3s, transform 0.3s;
      cursor: none;
    }
    .btn-primary:hover {
      opacity: 0.9;
      box-shadow: 0 8px 30px rgba(26,140,255,0.4);
      transform: translateY(-2px);
    }

    /* Timeline */
    .timeline-line {
      position: absolute; left: 50%; top: 0; bottom: 0; width: 1px;
      background: linear-gradient(to bottom, transparent, var(--blue), var(--purple), transparent);
      transform: translateX(-50%);
    }

    /* Footer */
    footer a { color: var(--silver); text-decoration: none; transition: color 0.3s; font-size: 14px; }
    footer a:hover { color: var(--neon); }

    /* Responsive */
    @media (max-width: 768px) {
      .timeline-line { left: 20px; }
      .hide-mobile { display: none !important; }
    }
    @media (max-width: 480px) {
      .hero-headline { font-size: clamp(3rem,15vw,6rem) !important; }
    }
  `}</style>
);

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".section-reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let s = null, startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) s = requestAnimationFrame(step);
    };
    s = requestAnimationFrame(step);
    return () => cancelAnimationFrame(s);
  }, [target, duration, start]);
  return count;
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const NAV_LINKS = ["Home", "About", "Services", "Portfolio", "Clients", "Contact"];

const STATS = [
  { value: 500, suffix: "+", label: "Productions Delivered" },
  { value: 120, suffix: "+", label: "Global Clients" },
  { value: 47, suffix: "", label: "Countries Reached" },
  { value: 15, suffix: "B+", label: "Viewers Worldwide" },
];

const SERVICES = [
  {
    icon: "📡",
    title: "Broadcasting",
    desc: "Live and on-demand broadcast solutions engineered for global audiences. From satellite uplinks to OTT delivery, we bring stories to every screen on the planet.",
    features: ["Live Event Coverage", "Satellite Distribution", "OTT Platform Management", "24/7 Broadcast Operations"],
    color: "var(--blue)",
  },
  {
    icon: "🎬",
    title: "Production Services",
    desc: "Full-spectrum production from concept to final cut. Our studios and crews craft cinematic content that commands attention and earns lasting recognition.",
    features: ["Full Studio Facilities", "Cinematography & Direction", "Post-Production & VFX", "Dolby Atmos Sound"],
    color: "var(--purple)",
  },
  {
    icon: "🌐",
    title: "Content Distribution",
    desc: "Strategic content distribution across every major platform and territory. We ensure your story finds its audience — wherever they are in the world.",
    features: ["Multi-Platform Syndication", "Rights Management", "Localization & Subtitling", "Analytics & Insights"],
    color: "var(--neon)",
  },
];

const PORTFOLIO_ITEMS = [
  { id: 1, title: "Echoes of Tomorrow", category: "Broadcasting", year: "2024", color: "#1a3a5c" },
  { id: 2, title: "The Architects", category: "Production", year: "2024", color: "#2d1a5c" },
  { id: 3, title: "Signal & Noise", category: "Distribution", year: "2023", color: "#0d3d2e" },
  { id: 4, title: "Meridian", category: "Broadcasting", year: "2023", color: "#3d1a1a" },
  { id: 5, title: "Unseen Cities", category: "Production", year: "2023", color: "#1a2d3d" },
  { id: 6, title: "The Algorithm", category: "Distribution", year: "2024", color: "#2d2a1a" },
];

const PORTFOLIO_FILTERS = ["All", "Broadcasting", "Production", "Distribution"];

const TIMELINE = [
  { year: "2008", title: "Founded", desc: "Born from a vision to redefine media storytelling in the digital age." },
  { year: "2012", title: "First Broadcast Deal", desc: "Secured landmark broadcasting rights across 12 countries." },
  { year: 2016, title: "Studio Expansion", desc: "Opened our flagship production facility — 40,000 sq ft of cinematic infrastructure." },
  { year: "2019", title: "Global Reach", desc: "Crossed 1 billion viewers milestone with award-winning documentary series." },
  { year: "2022", title: "Digital Pivot", desc: "Launched proprietary OTT distribution platform serving 50+ markets." },
  { year: "2024", title: "New Chapter", desc: "Expanding into AI-augmented production and next-generation broadcast technology." },
];

const TEAM = [
  { name: "Marcus Veil", role: "Founder & CEO", color: "#1a3a5c" },
  { name: "Sophia Crane", role: "Chief Creative Officer", color: "#2d1a5c" },
  { name: "James Okoro", role: "Head of Broadcasting", color: "#0d3d2e" },
  { name: "Lena Vasquez", role: "Director of Production", color: "#3d1a1a" },
];

const CLIENTS = [
  "Netflix", "Sony Pictures", "HBO Max", "Apple TV+", "Amazon Prime",
  "Disney+", "BBC", "National Geographic", "Warner Bros", "Paramount+",
  "Hulu", "Peacock", "Showtime", "A24", "Lionsgate",
];

const TESTIMONIALS = [
  {
    quote: "Figuring Out Media didn't just deliver our content — they transformed it into a global phenomenon. Their production quality is unparalleled.",
    name: "Elena Rhodes",
    title: "Head of Content, StreamCore",
    initial: "E",
  },
  {
    quote: "The distribution strategy they built for us opened markets we never imagined. Professional, visionary, and relentlessly excellent.",
    name: "David Kim",
    title: "VP Programming, NovaBroadcast",
    initial: "D",
  },
  {
    quote: "Working with FOM felt like collaborating with the future of media. Every frame, every decision reflected world-class craftsmanship.",
    name: "Amara Obi",
    title: "Executive Producer, Atlas Films",
    initial: "A",
  },
];

/* ─────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────── */

/* Custom Cursor */
function Cursor() {
  const outer = useRef(null);
  const inner = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (outer.current) {
        outer.current.style.left = e.clientX + "px";
        outer.current.style.top = e.clientY + "px";
      }
      if (inner.current) {
        inner.current.style.left = e.clientX + "px";
        inner.current.style.top = e.clientY + "px";
      }
    };
    const over = () => outer.current?.classList.add("hovering");
    const out  = () => outer.current?.classList.remove("hovering");
    window.addEventListener("mousemove", move);
    document.querySelectorAll("a,button,.service-card,.portfolio-card,.team-card,.btn-neon,.btn-primary")
      .forEach(el => { el.addEventListener("mouseenter", over); el.addEventListener("mouseleave", out); });
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <>
      <div ref={outer} className="cursor-outer" />
      <div ref={inner} className="cursor-inner" />
    </>
  );
}

/* Particles */
function Particles({ count = 20 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    dur: Math.random() * 15 + 10,
    delay: Math.random() * 15,
    dx: (Math.random() - 0.5) * 200,
    color: i % 3 === 0 ? "var(--neon)" : i % 3 === 1 ? "var(--blue)" : "var(--purple)",
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size,
          left: `${p.left}%`, bottom: 0,
          background: p.color,
          boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          "--dur": `${p.dur}s`, "--delay": `${p.delay}s`, "--dx": `${p.dx}px`,
          opacity: 0.6,
        }} />
      ))}
    </div>
  );
}

/* Navbar */
function Navbar({ active, setActive }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "0 5%",
      height: scrolled ? "64px" : "80px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(3,3,3,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "none" }} onClick={() => setActive("Home")}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "linear-gradient(135deg, var(--blue), var(--purple))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, color: "white",
          boxShadow: "0 0 20px rgba(26,140,255,0.4)",
        }}>F</div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: "0.05em", color: "white", lineHeight: 1 }}>FIGURING OUT</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.3em", color: "var(--neon)", textTransform: "uppercase" }}>MEDIA</div>
        </div>
      </div>

      {/* Links */}
      <div className="hide-mobile" style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {NAV_LINKS.map(link => (
          <a key={link} href={`#${link.toLowerCase()}`} className={`nav-link ${active === link ? "active" : ""}`}
            onClick={() => setActive(link)}>{link}</a>
        ))}
      </div>

      {/* CTA */}
      <button className="btn-neon hide-mobile" style={{ padding: "10px 24px", fontSize: 12, borderRadius: 4 }}
        onClick={() => setActive("Contact")}>
        <span style={{ position: "relative", zIndex: 1 }}>Get In Touch</span>
      </button>

      {/* Mobile hamburger */}
      <div style={{ display: "none", flexDirection: "column", gap: 5, cursor: "none" }} className="show-mobile">
        {[0,1,2].map(i => <div key={i} style={{ width: 24, height: 1.5, background: "var(--neon)" }} />)}
      </div>
    </nav>
  );
}

/* ── HERO SECTION ── */
function Hero({ setActive }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section id="home" style={{ position: "relative", height: "100vh", minHeight: 700, overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center" }}>

      {/* Video BG (canvas-simulated since no external video) */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        background: `
          radial-gradient(ellipse 70% 70% at 50% 50%, rgba(26,140,255,0.08) 0%, transparent 70%),
          radial-gradient(ellipse 40% 60% at 10% 80%, rgba(123,47,255,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 90% 20%, rgba(0,212,255,0.08) 0%, transparent 60%),
          linear-gradient(180deg, #030303 0%, #080812 50%, #030303 100%)
        `,
      }} />

      {/* Cinematic grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)",
      }} />

      <Particles count={25} />

      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 5%", maxWidth: 1100 }}>
        {/* Pre-title */}
        <div style={{
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s",
          display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 28,
        }}>
          <div style={{ width: 40, height: 1, background: "var(--neon)", boxShadow: "0 0 8px var(--neon)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.35em",
            textTransform: "uppercase", color: "var(--neon)" }}>Est. 2008 — Global Media House</span>
          <div style={{ width: 40, height: 1, background: "var(--neon)", boxShadow: "0 0 8px var(--neon)" }} />
        </div>

        {/* Main headline */}
        <h1 className="hero-headline" style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(3.5rem, 9vw, 9rem)",
          lineHeight: 0.95, letterSpacing: "0.02em",
          marginBottom: 8,
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(30px)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.4s",
        }}>
          <span style={{ color: "white", display: "block" }}>BROADCASTING</span>
          <span className="grad-text" style={{ display: "block" }}>STORIES THAT</span>
          <span style={{ color: "white", display: "block" }}>MOVE THE</span>
          <span style={{
            display: "block",
            WebkitTextStroke: "1px rgba(0,212,255,0.5)",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}>WORLD</span>
        </h1>

        <p style={{
          fontFamily: "var(--font-serif)", fontStyle: "italic",
          fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "var(--silver)",
          maxWidth: 560, margin: "28px auto 44px",
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.7s",
        }}>
          Premium broadcasting, production, and distribution for the stories that define our era.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.9s",
        }}>
          <button className="btn-primary" style={{ padding: "16px 40px", fontSize: 13, borderRadius: 4 }}
            onClick={() => { document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" }); setActive("Portfolio"); }}>
            View Our Work
          </button>
          <button className="btn-neon" style={{ padding: "16px 40px", fontSize: 13, borderRadius: 4 }}
            onClick={() => { document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); setActive("Contact"); }}>
            <span style={{ position: "relative", zIndex: 1 }}>Start a Project</span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 2,
        opacity: loaded ? 0.7 : 0, transition: "opacity 0.8s 1.4s",
      }}>
        <span style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--silver)", textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, var(--neon), transparent)",
          animation: "scrollPulse 2s ease-in-out infinite" }} />
        <style>{`@keyframes scrollPulse { 0%,100%{opacity:.4;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.2)} }`}</style>
      </div>

      {/* Bottom glow line */}
      <div className="glow-line" style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3 }} />
    </section>
  );
}

/* ── STATS SECTION ── */
function StatsSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: "80px 5%", background: "var(--charcoal)", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(26,140,255,0.06), transparent)",
      }} />
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        gap: 2, maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1,
      }}>
        {STATS.map((s, i) => (
          <StatCard key={i} stat={s} started={visible} delay={i * 150} />
        ))}
      </div>
    </section>
  );
}

function StatCard({ stat, started, delay }) {
  const count = useCounter(stat.value, 2000, started);
  return (
    <div style={{
      textAlign: "center", padding: "40px 20px",
      borderRight: "1px solid rgba(255,255,255,0.05)",
      transition: "transform 0.6s",
      transitionDelay: `${delay}ms`,
    }}>
      <div className="stat-num">{count}{stat.suffix}</div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.2em",
        textTransform: "uppercase", color: "var(--silver)", marginTop: 8 }}>{stat.label}</div>
    </div>
  );
}

/* ── ABOUT SECTION ── */
function AboutSection() {
  return (
    <section id="about" style={{ padding: "120px 5%", position: "relative", overflow: "hidden" }}>
      <div className="mesh-bg" />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div className="section-reveal" style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.3em",
            color: "var(--neon)", textTransform: "uppercase", marginBottom: 16 }}>Our Story</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,6vw,5rem)",
            color: "white", letterSpacing: "0.05em" }}>CRAFTING THE<br /><span className="grad-text">FUTURE OF MEDIA</span></h2>
        </div>

        {/* Mission / Vision */}
        <div className="section-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 80 }}>
          {[
            { label: "Our Vision", icon: "◈", text: "To become the world's most trusted creative media force — shaping culture, amplifying voices, and connecting humanity through storytelling that transcends borders and generations." },
            { label: "Our Mission", icon: "◇", text: "To deliver uncompromising broadcast, production, and distribution services that empower creators, brands, and networks to reach their audiences with maximum impact and artistic integrity." },
          ].map((item, i) => (
            <div key={i} className="glass" style={{ padding: "40px", borderRadius: 12,
              borderColor: i === 0 ? "rgba(26,140,255,0.2)" : "rgba(123,47,255,0.2)" }}>
              <div style={{ fontSize: 24, marginBottom: 12, color: i === 0 ? "var(--blue)" : "var(--purple)" }}>{item.icon}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "0.1em",
                color: "white", marginBottom: 16 }}>{item.label.toUpperCase()}</div>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: 17, lineHeight: 1.8,
                color: "var(--silver)", fontStyle: "italic" }}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="section-reveal" style={{ marginBottom: 100 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "white",
            letterSpacing: "0.05em", textAlign: "center", marginBottom: 60 }}>OUR JOURNEY</div>
          <div style={{ position: "relative" }}>
            <div className="timeline-line" />
            {TIMELINE.map((item, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: i % 2 === 0 ? "flex-end" : "flex-start",
                paddingRight: i % 2 === 0 ? "calc(50% + 30px)" : 0,
                paddingLeft: i % 2 !== 0 ? "calc(50% + 30px)" : 0,
                marginBottom: 40,
              }}>
                <div className="glass" style={{ padding: "24px 28px", borderRadius: 10, maxWidth: 320,
                  borderColor: `rgba(${i % 2 === 0 ? "26,140,255" : "123,47,255"},0.2)` }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 28,
                    color: i % 2 === 0 ? "var(--blue)" : "var(--purple)", marginBottom: 4 }}>{item.year}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "white",
                    marginBottom: 8, fontSize: 15 }}>{item.title}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--silver)", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="section-reveal">
          <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "white",
            letterSpacing: "0.05em", textAlign: "center", marginBottom: 48 }}>LEADERSHIP TEAM</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
            {TEAM.map((member, i) => (
              <div key={i} className="team-card glass" style={{ borderRadius: 12, overflow: "hidden",
                borderColor: "rgba(255,255,255,0.05)", transition: "border-color 0.3s, box-shadow 0.3s",
                cursor: "none" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.25)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,212,255,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div className="team-img" style={{ height: 200, background: `linear-gradient(135deg, ${member.color}, #0a0a12)`,
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontSize: 32, color: "white" }}>
                    {member.name[0]}
                  </div>
                </div>
                <div style={{ padding: "20px 22px" }}>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "white",
                    fontSize: 15, marginBottom: 4 }}>{member.name}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--neon)",
                    letterSpacing: "0.1em", textTransform: "uppercase" }}>{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── SERVICES SECTION ── */
function ServicesSection() {
  return (
    <section id="services" style={{ padding: "120px 5%", background: "var(--charcoal)", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(123,47,255,0.05), transparent)" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>

        <div className="section-reveal" style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.3em",
            color: "var(--purple)", textTransform: "uppercase", marginBottom: 16 }}>What We Do</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,6vw,5rem)",
            color: "white", letterSpacing: "0.05em" }}>
            SERVICES BUILT<br /><span className="grad-text">FOR THE BEST</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {SERVICES.map((svc, i) => (
            <div key={i} className="service-card glass" style={{
              borderRadius: 16, padding: "44px 36px",
              borderColor: "rgba(255,255,255,0.07)",
              transitionDelay: `${i * 80}ms`,
            }}>
              <div style={{ fontSize: 40, marginBottom: 24,
                filter: `drop-shadow(0 0 12px ${svc.color})` }}>{svc.icon}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28,
                letterSpacing: "0.08em", color: "white", marginBottom: 16 }}>{svc.title.toUpperCase()}</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.8,
                color: "var(--silver)", marginBottom: 28 }}>{svc.desc}</p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}>
                {svc.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 10,
                    marginBottom: 10, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--silver-light)" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: svc.color,
                      boxShadow: `0 0 8px ${svc.color}`, flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 28 }}>
                <button className="btn-neon" style={{ padding: "10px 22px", fontSize: 11, borderRadius: 4,
                  borderColor: `${svc.color}80`, color: svc.color }}>
                  <span style={{ position: "relative", zIndex: 1 }}>Learn More →</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PORTFOLIO SECTION ── */
function PortfolioSection() {
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);

  const filtered = filter === "All" ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter(p => p.category === filter);

  return (
    <section id="portfolio" style={{ padding: "120px 5%", position: "relative", overflow: "hidden" }}>
      <div className="mesh-bg" />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>

        <div className="section-reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.3em",
            color: "var(--neon)", textTransform: "uppercase", marginBottom: 16 }}>Our Work</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,6vw,5rem)",
            color: "white", letterSpacing: "0.05em" }}>
            FEATURED<br /><span className="grad-text">PRODUCTIONS</span>
          </h2>
        </div>

        {/* Filters */}
        <div className="section-reveal" style={{ display: "flex", gap: 12, justifyContent: "center",
          flexWrap: "wrap", marginBottom: 48 }}>
          {PORTFOLIO_FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "9px 22px", fontSize: 12, letterSpacing: "0.12em",
              textTransform: "uppercase", borderRadius: 4, cursor: "none",
              background: filter === f ? "linear-gradient(135deg, var(--blue), var(--purple))" : "transparent",
              border: filter === f ? "none" : "1px solid rgba(255,255,255,0.12)",
              color: filter === f ? "white" : "var(--silver)",
              transition: "all 0.3s", fontFamily: "var(--font-body)",
            }}>{f}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {filtered.map((item, i) => (
            <div key={item.id} className="portfolio-card glass" style={{
              borderRadius: 12, borderColor: "rgba(255,255,255,0.06)",
              transitionDelay: `${i * 60}ms`,
            }} onClick={() => setModal(item)}>
              <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: `linear-gradient(135deg, ${item.color} 0%, #0a0a14 100%)`,
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `radial-gradient(circle at 30% 40%, rgba(255,255,255,0.06) 0%, transparent 50%),
                      linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.03) 41%, rgba(255,255,255,0.03) 42%, transparent 43%)`,
                  }} />
                  <div style={{
                    position: "absolute", bottom: 20, left: 20,
                    fontFamily: "var(--font-display)", fontSize: 48,
                    color: "rgba(255,255,255,0.06)", letterSpacing: "0.05em",
                  }}>{String(item.id).padStart(2, "0")}</div>
                </div>

                <div className="overlay" style={{
                  position: "absolute", inset: 0, zIndex: 2,
                  background: "rgba(3,3,3,0.65)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10,
                }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%",
                    border: "1.5px solid white", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20 }}>▶</div>
                  <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "white" }}>View Project</span>
                </div>
              </div>
              <div style={{ padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "white",
                      fontSize: 15, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--neon)",
                      letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.category}</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--silver)" }}>{item.year}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div onClick={() => setModal(null)} style={{
          position: "fixed", inset: 0, zIndex: 2000,
          background: "rgba(0,0,0,0.9)", backdropFilter: "blur(20px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }}>
          <div onClick={e => e.stopPropagation()} className="glass-bright" style={{
            borderRadius: 20, maxWidth: 700, width: "100%", overflow: "hidden",
          }}>
            <div style={{ height: 300, background: `linear-gradient(135deg, ${modal.color}, #0a0a14)`,
              position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
                background: "rgba(255,255,255,0.08)", cursor: "none" }}>▶</div>
              <button onClick={() => setModal(null)} style={{
                position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.1)",
                border: "none", color: "white", width: 36, height: 36, borderRadius: "50%",
                fontSize: 18, cursor: "none", display: "flex", alignItems: "center", justifyContent: "center",
              }}>×</button>
            </div>
            <div style={{ padding: "32px 36px" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--neon)",
                letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>{modal.category} · {modal.year}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "white",
                letterSpacing: "0.05em", marginBottom: 16 }}>{modal.title.toUpperCase()}</h3>
              <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16,
                lineHeight: 1.8, color: "var(--silver)", marginBottom: 24 }}>
                An ambitious production that pushed the boundaries of storytelling, distributed across 40+ markets and celebrated at international festivals for its cinematic vision and cultural impact.
              </p>
              <button className="btn-primary" style={{ padding: "12px 28px", fontSize: 12, borderRadius: 4 }}>
                Full Case Study →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ── CLIENTS SECTION ── */
function ClientsSection() {
  return (
    <section id="clients" style={{ padding: "100px 0", background: "var(--charcoal)", overflow: "hidden" }}>
      <div style={{ textAlign: "center", marginBottom: 60, padding: "0 5%" }}>
        <div className="section-reveal">
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.3em",
            color: "var(--blue)", textTransform: "uppercase", marginBottom: 16 }}>Trusted By</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,4rem)",
            color: "white", letterSpacing: "0.05em" }}>
            THE WORLD'S<br /><span className="grad-text">GREATEST NETWORKS</span>
          </h2>
        </div>
      </div>

      {/* Marquee */}
      <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "24px 0" }}>
        <div className="marquee-track" style={{ display: "flex", gap: 0, width: "max-content" }}>
          {[...CLIENTS, ...CLIENTS].map((c, i) => (
            <div key={i} style={{
              padding: "0 40px", fontFamily: "var(--font-display)",
              fontSize: 20, color: "rgba(168,178,192,0.4)", letterSpacing: "0.12em",
              whiteSpace: "nowrap", transition: "color 0.3s", cursor: "none",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--neon)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(168,178,192,0.4)"}
            >{c}</div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: "80px 5% 20px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="section-reveal" style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "white", letterSpacing: "0.05em" }}>WHAT THEY SAY</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="section-reveal glass" style={{
              borderRadius: 12, padding: "36px 32px",
              borderColor: "rgba(255,255,255,0.06)",
              transitionDelay: `${i * 100}ms`,
            }}>
              <div style={{ fontSize: 40, color: "var(--blue)", fontFamily: "serif",
                lineHeight: 0.8, marginBottom: 20, opacity: 0.5 }}>"</div>
              <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
                fontSize: 16, lineHeight: 1.9, color: "var(--silver-light)", marginBottom: 28 }}>
                {t.quote}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%",
                  background: `linear-gradient(135deg, var(--blue), var(--purple))`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontSize: 18, color: "white" }}>{t.initial}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "white", fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--silver)" }}>{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA BANNER ── */
function CTABanner({ setActive }) {
  return (
    <section style={{ padding: "100px 5%", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(26,140,255,0.12) 0%, rgba(123,47,255,0.1) 50%, rgba(0,212,255,0.08) 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />
      <div className="glow-line" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
      <div className="glow-line" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />

      <div className="section-reveal" style={{
        textAlign: "center", position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto",
      }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,6vw,5rem)",
          color: "white", letterSpacing: "0.05em", marginBottom: 24 }}>
          READY TO<br /><span className="grad-text">TELL YOUR STORY?</span>
        </h2>
        <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18,
          color: "var(--silver)", marginBottom: 40, lineHeight: 1.7 }}>
          Partner with Figuring Out Media and let us broadcast your vision to the world.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" style={{ padding: "18px 48px", fontSize: 13, borderRadius: 4 }}
            onClick={() => { document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); setActive("Contact"); }}>
            Begin Your Project
          </button>
          <button className="btn-neon" style={{ padding: "18px 48px", fontSize: 13, borderRadius: 4 }}
            onClick={() => { document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" }); setActive("Portfolio"); }}>
            <span style={{ position: "relative", zIndex: 1 }}>View Portfolio</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT SECTION ── */
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" style={{ padding: "120px 5%", background: "var(--charcoal)", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(26,140,255,0.06), transparent)" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>

        <div className="section-reveal" style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.3em",
            color: "var(--neon)", textTransform: "uppercase", marginBottom: 16 }}>Contact</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,6vw,5rem)",
            color: "white", letterSpacing: "0.05em" }}>
            LET'S CREATE<br /><span className="grad-text">SOMETHING ICONIC</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 40 }}>

          {/* Info */}
          <div className="section-reveal">
            <div className="glow-line" style={{ marginBottom: 40 }} />

            {[
              { label: "Email", value: "hello@figuringoutmedia.com", icon: "✉" },
              { label: "Phone", value: "+1 (310) 555-0192", icon: "☎" },
              { label: "HQ", value: "Los Angeles, California", icon: "◎" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 18, marginBottom: 32 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10,
                  background: "rgba(26,140,255,0.1)", border: "1px solid rgba(26,140,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 11,
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "var(--silver)", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "white" }}>{item.value}</div>
                </div>
              </div>
            ))}

            {/* Social */}
            <div style={{ marginTop: 48 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "var(--silver)", marginBottom: 20 }}>Follow Us</div>
              <div style={{ display: "flex", gap: 12 }}>
                {["TW", "IG", "LI", "YT"].map((s, i) => (
                  <div key={i} style={{ width: 40, height: 40, borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)", display: "flex",
                    alignItems: "center", justifyContent: "center", cursor: "none",
                    fontFamily: "var(--font-body)", fontSize: 11, color: "var(--silver)",
                    transition: "border-color 0.3s, color 0.3s, box-shadow 0.3s",
                    letterSpacing: "0.05em" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--neon)"; e.currentTarget.style.color = "var(--neon)"; e.currentTarget.style.boxShadow = "0 0 12px rgba(0,212,255,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "var(--silver)"; e.currentTarget.style.boxShadow = "none"; }}
                  >{s}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="section-reveal glass-bright" style={{ borderRadius: 16, padding: "44px 40px" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>✓</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--neon)",
                  letterSpacing: "0.05em", marginBottom: 12 }}>MESSAGE SENT</h3>
                <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--silver)", fontSize: 16 }}>
                  We'll be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <div onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {["name", "email"].map(field => (
                    <div key={field}>
                      <label style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.15em",
                        textTransform: "uppercase", color: "var(--silver)", display: "block", marginBottom: 8 }}>
                        {field === "name" ? "Full Name" : "Email"}
                      </label>
                      <input type={field === "email" ? "email" : "text"}
                        className="luxury-input" style={{ width: "100%", padding: "13px 16px", borderRadius: 8, fontSize: 14 }}
                        placeholder={field === "name" ? "Marcus Veil" : "hello@studio.com"}
                        value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.15em",
                    textTransform: "uppercase", color: "var(--silver)", display: "block", marginBottom: 8 }}>Company</label>
                  <input type="text" className="luxury-input" style={{ width: "100%", padding: "13px 16px", borderRadius: 8, fontSize: 14 }}
                    placeholder="Your Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.15em",
                    textTransform: "uppercase", color: "var(--silver)", display: "block", marginBottom: 8 }}>Service</label>
                  <select className="luxury-input" style={{ width: "100%", padding: "13px 16px", borderRadius: 8, fontSize: 14 }}
                    value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                    <option value="" style={{ background: "#0e0e12" }}>Select a service</option>
                    <option value="Broadcasting" style={{ background: "#0e0e12" }}>Broadcasting</option>
                    <option value="Production" style={{ background: "#0e0e12" }}>Production Services</option>
                    <option value="Distribution" style={{ background: "#0e0e12" }}>Content Distribution</option>
                    <option value="Other" style={{ background: "#0e0e12" }}>Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.15em",
                    textTransform: "uppercase", color: "var(--silver)", display: "block", marginBottom: 8 }}>Message</label>
                  <textarea className="luxury-input" rows={5}
                    style={{ width: "100%", padding: "13px 16px", borderRadius: 8, fontSize: 14, resize: "vertical" }}
                    placeholder="Tell us about your project..."
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <button className="btn-primary" style={{ width: "100%", padding: "16px", fontSize: 13, borderRadius: 8 }}
                  onClick={handleSubmit}>
                  Send Message →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer style={{ background: "#020202", padding: "60px 5% 30px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 50 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8,
                background: "linear-gradient(135deg, var(--blue), var(--purple))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 700, color: "white" }}>F</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: "0.05em", color: "white" }}>FIGURING OUT MEDIA</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.3em", color: "var(--neon)", textTransform: "uppercase" }}>Global Media House</div>
              </div>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--silver)", lineHeight: 1.8, maxWidth: 260 }}>
              Broadcasting stories that move the world. Premium media production, distribution, and broadcasting since 2008.
            </p>
          </div>

          {[
            { title: "Company", links: ["About", "Services", "Portfolio", "Clients", "Contact"] },
            { title: "Services", links: ["Broadcasting", "Production", "Distribution", "Live Events", "Post Production"] },
            { title: "Connect", links: ["Twitter", "Instagram", "LinkedIn", "YouTube", "hello@fom.com"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "white",
                letterSpacing: "0.1em", marginBottom: 20 }}>{col.title.toUpperCase()}</div>
              {col.links.map((link, j) => (
                <div key={j} style={{ marginBottom: 10 }}>
                  <a href="#">{link}</a>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="glow-line" style={{ marginBottom: 24 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(168,178,192,0.4)" }}>
            © 2024 Figuring Out Media. All rights reserved.
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(168,178,192,0.4)" }}>
            Crafted with precision · Los Angeles, CA
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   TICKER
───────────────────────────────────────────── */
function NewsTicker() {
  const items = ["BROADCASTING · PRODUCTION · DISTRIBUTION · BROADCASTING · PRODUCTION · DISTRIBUTION · BROADCASTING · PRODUCTION · DISTRIBUTION · BROADCASTING · PRODUCTION · DISTRIBUTION ·"];
  return (
    <div style={{ background: "rgba(26,140,255,0.08)", borderTop: "1px solid rgba(26,140,255,0.15)",
      borderBottom: "1px solid rgba(26,140,255,0.15)", padding: "8px 0", overflow: "hidden" }}>
      <div className="ticker" style={{ fontFamily: "var(--font-body)", fontSize: 11,
        letterSpacing: "0.3em", color: "var(--blue)", textTransform: "uppercase" }}>
        {items[0]}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function App() {
  const [active, setActive] = useState("Home");
  useScrollReveal();

  // Update active based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map(l => ({ id: l.toLowerCase(), label: l }));
      for (const s of [...sections].reverse()) {
        const el = document.getElementById(s.id);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActive(s.label);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <GlobalStyles />
      <Cursor />
      <Navbar active={active} setActive={setActive} />

      <main>
        <Hero setActive={setActive} />
        <NewsTicker />
        <StatsSection />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection />
        <ClientsSection />
        <CTABanner setActive={setActive} />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}