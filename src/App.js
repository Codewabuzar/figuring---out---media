import React, { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --black: #030303; --charcoal: #0e0e12; --dark: #12121a;
      --blue: #1a8cff; --blue-glow: rgba(26,140,255,0.35);
      --purple: #7b2fff; --purple-glow: rgba(123,47,255,0.3);
      --silver: #a8b2c0; --silver-light: #d4dce8;
      --neon: #00d4ff; --neon-glow: rgba(0,212,255,0.4);
      --gold: #c9a84c;
      --font-display: 'Bebas Neue', sans-serif;
      --font-serif: 'Cormorant Garamond', serif;
      --font-body: 'DM Sans', sans-serif;
    }
    html { scroll-behavior: smooth; }
    body { background: var(--black); color: var(--silver-light); font-family: var(--font-body); cursor: none; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 2px; }

    /* CURSOR */
    .cursor-outer {
      position: fixed; top: 0; left: 0; width: 36px; height: 36px;
      border: 1.5px solid var(--neon); border-radius: 50%; pointer-events: none;
      z-index: 99999; transform: translate(-50%,-50%);
      transition: width 0.2s, height 0.2s, border-color 0.2s, background 0.2s;
    }
    .cursor-inner {
      position: fixed; top: 0; left: 0; width: 6px; height: 6px;
      background: var(--neon); border-radius: 50%; pointer-events: none;
      z-index: 99999; transform: translate(-50%,-50%);
      box-shadow: 0 0 8px var(--neon);
    }
    .cursor-outer.hovering { width: 60px; height: 60px; background: rgba(0,212,255,0.08); border-color: var(--blue); }

    /* NOISE */
    body::before {
      content: ''; position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
      pointer-events: none; z-index: 1; opacity: 0.4;
    }

    /* MESH BG */
    .mesh-bg { position: absolute; inset: 0; overflow: hidden; z-index: 0; }
    .mesh-bg::after {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse 80% 60% at 20% 20%, rgba(26,140,255,0.12) 0%, transparent 60%),
                  radial-gradient(ellipse 60% 80% at 80% 80%, rgba(123,47,255,0.1) 0%, transparent 60%),
                  radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%);
      animation: meshFloat 12s ease-in-out infinite alternate;
    }
    @keyframes meshFloat {
      0% { transform: scale(1) translate(0,0); }
      50% { transform: scale(1.05) translate(-1%,1%); }
      100% { transform: scale(1.02) translate(1%,-1%); }
    }

    /* GRAD TEXT */
    .grad-text {
      background: linear-gradient(135deg, #ffffff 0%, var(--neon) 40%, var(--blue) 70%, var(--purple) 100%);
      background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; animation: gradShift 6s ease infinite;
    }
    @keyframes gradShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

    .glow-line {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--neon), var(--blue), var(--purple), transparent);
      box-shadow: 0 0 12px var(--neon-glow);
    }
    .glass { background: rgba(18,18,26,0.65); backdrop-filter: blur(20px) saturate(1.4); border: 1px solid rgba(255,255,255,0.07); }
    .glass-bright { background: rgba(26,26,40,0.8); backdrop-filter: blur(24px) saturate(1.6); border: 1px solid rgba(0,212,255,0.15); }

    /* REVEAL */
    .section-reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
    .section-reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
    .reveal-left.visible { opacity: 1; transform: translateX(0); }
    .reveal-right { opacity: 0; transform: translateX(40px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
    .reveal-right.visible { opacity: 1; transform: translateX(0); }
    .reveal-scale { opacity: 0; transform: scale(0.92); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
    .reveal-scale.visible { opacity: 1; transform: scale(1); }

    /* NAV */
    .nav-link { position: relative; font-family: var(--font-body); font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--silver); text-decoration: none; transition: color 0.3s; }
    .nav-link::after { content: ''; position: absolute; bottom: -3px; left: 0; width: 0; height: 1px; background: var(--neon); box-shadow: 0 0 6px var(--neon); transition: width 0.3s; }
    .nav-link:hover { color: white; }
    .nav-link:hover::after, .nav-link.active::after { width: 100%; }
    .nav-link.active { color: var(--neon); }

    /* PAGE TRANSITION */
    .page-enter { animation: pageIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
    @keyframes pageIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

    /* VIDEO HERO */
    .hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.28; }

    /* STAT */
    .stat-num {
      font-family: var(--font-display); font-size: clamp(2.5rem,5vw,4.5rem); line-height: 1;
      background: linear-gradient(135deg, white, var(--neon)); -webkit-background-clip: text;
      -webkit-text-fill-color: transparent; background-clip: text;
    }

    /* CARDS */
    .service-card { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s, border-color 0.4s; cursor: none; }
    .service-card:hover { transform: translateY(-10px); box-shadow: 0 28px 70px rgba(26,140,255,0.22), 0 0 0 1px rgba(0,212,255,0.28); border-color: rgba(0,212,255,0.3) !important; }
    .portfolio-card { transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s; cursor: none; overflow: hidden; }
    .portfolio-card:hover { transform: scale(1.03); box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
    .portfolio-card .overlay { opacity: 0; transition: opacity 0.4s; }
    .portfolio-card:hover .overlay { opacity: 1; }
    .portfolio-card .thumb { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
    .portfolio-card:hover .thumb { transform: scale(1.08); }
    .team-card { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s, border-color 0.3s; cursor: none; }
    .team-card:hover { transform: translateY(-6px); box-shadow: 0 16px 50px rgba(0,212,255,0.12); border-color: rgba(0,212,255,0.25) !important; }

    /* INPUTS */
    .luxury-input { background: rgba(18,18,26,0.8); border: 1px solid rgba(255,255,255,0.08); color: white; font-family: var(--font-body); transition: border-color 0.3s, box-shadow 0.3s; outline: none; }
    .luxury-input:focus { border-color: rgba(0,212,255,0.4); box-shadow: 0 0 20px rgba(0,212,255,0.1); }
    .luxury-input::placeholder { color: rgba(168,178,192,0.4); }

    /* MARQUEE */
    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    .marquee-track { animation: marquee 22s linear infinite; }
    .marquee-track:hover { animation-play-state: paused; }

    /* TICKER */
    @keyframes ticker { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
    .ticker { animation: ticker 28s linear infinite; white-space: nowrap; }

    /* PARTICLES */
    @keyframes floatUp {
      0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
      10% { opacity: 1; } 90% { opacity: 0.6; }
      100% { transform: translateY(-100vh) translateX(var(--dx)) scale(0.5); opacity: 0; }
    }
    .particle { position: absolute; border-radius: 50%; animation: floatUp var(--dur) linear infinite; animation-delay: var(--delay); }

    /* BUTTONS */
    .btn-neon {
      position: relative; overflow: hidden; background: transparent;
      border: 1px solid rgba(0,212,255,0.5); color: var(--neon);
      font-family: var(--font-body); letter-spacing: 0.15em; text-transform: uppercase;
      transition: color 0.3s, box-shadow 0.3s; cursor: none;
    }
    .btn-neon::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(26,140,255,0.1));
      transform: scaleX(0); transform-origin: left; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
    }
    .btn-neon:hover::before { transform: scaleX(1); }
    .btn-neon:hover { box-shadow: 0 0 30px rgba(0,212,255,0.3); color: white; }
    .btn-primary {
      background: linear-gradient(135deg, var(--blue), var(--purple)); border: none; color: white;
      font-family: var(--font-body); letter-spacing: 0.1em; text-transform: uppercase;
      transition: opacity 0.3s, box-shadow 0.3s, transform 0.3s; cursor: none;
    }
    .btn-primary:hover { opacity: 0.9; box-shadow: 0 8px 30px rgba(26,140,255,0.4); transform: translateY(-2px); }

    /* TIMELINE */
    .timeline-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, var(--blue), var(--purple), transparent); transform: translateX(-50%); }

    /* SCROLL INDICATOR */
    @keyframes scrollPulse { 0%,100%{opacity:.4;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.3)} }

    /* FLOATING BADGE */
    @keyframes badgeFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .badge-float { animation: badgeFloat 3s ease-in-out infinite; }

    /* PULSE RING */
    @keyframes pulseRing { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(2.5);opacity:0} }
    .pulse-ring { animation: pulseRing 2s ease-out infinite; }

    /* VIDEO OVERLAY GRADIENT */
    .video-overlay {
      position: absolute; inset: 0; z-index: 1;
      background: linear-gradient(to bottom, rgba(3,3,3,0.3) 0%, rgba(3,3,3,0.1) 40%, rgba(3,3,3,0.6) 80%, rgba(3,3,3,0.95) 100%),
                  linear-gradient(to right, rgba(3,3,3,0.5) 0%, transparent 50%);
    }

    /* GRID OVERLAY */
    .grid-overlay {
      position: absolute; inset: 0;
      background-image: linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px);
      background-size: 80px 80px;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
    }

    footer a { color: var(--silver); text-decoration: none; transition: color 0.3s; font-size: 14px; }
    footer a:hover { color: var(--neon); }

    @media (max-width: 768px) {
      .timeline-line { left: 20px; }
      .hide-mobile { display: none !important; }
      .contact-grid { grid-template-columns: 1fr !important; }
      .footer-grid { grid-template-columns: 1fr 1fr !important; }
      .vision-grid { grid-template-columns: 1fr !important; }
    }
    @media (max-width: 480px) {
      .hero-headline { font-size: clamp(3rem,15vw,6rem) !important; }
      .stat-grid { grid-template-columns: 1fr 1fr !important; }
    }
  `}</style>
);

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const NAV_LINKS = ["Home","About","Services","Portfolio","Clients","Contact"];

const STATS = [
  { value: 500, suffix: "+", label: "Productions Delivered" },
  { value: 120, suffix: "+", label: "Global Clients" },
  { value: 47, suffix: "", label: "Countries Reached" },
  { value: 15, suffix: "B+", label: "Viewers Worldwide" },
];

const SERVICES = [
  {
    icon: "📡", title: "Broadcasting", color: "var(--blue)",
    desc: "Live and on-demand broadcast solutions engineered for global audiences. From satellite uplinks to OTT delivery, we bring stories to every screen on the planet.",
    features: ["Live Event Coverage","Satellite Distribution","OTT Platform Management","24/7 Broadcast Operations"],
  },
  {
    icon: "🎬", title: "Production Services", color: "var(--purple)",
    desc: "Full-spectrum production from concept to final cut. Our studios and crews craft cinematic content that commands attention and earns lasting recognition.",
    features: ["Full Studio Facilities","Cinematography & Direction","Post-Production & VFX","Dolby Atmos Sound"],
  },
  {
    icon: "🌐", title: "Content Distribution", color: "var(--neon)",
    desc: "Strategic content distribution across every major platform and territory. We ensure your story finds its audience — wherever they are in the world.",
    features: ["Multi-Platform Syndication","Rights Management","Localization & Subtitling","Analytics & Insights"],
  },
];

const PORTFOLIO_ITEMS = [
  { id:1, title:"Echoes of Tomorrow", category:"Broadcasting", year:"2024", color:"#1a3a5c", award:"Emmy Nominated" },
  { id:2, title:"The Architects", category:"Production", year:"2024", color:"#2d1a5c", award:"Sundance Selection" },
  { id:3, title:"Signal & Noise", category:"Distribution", year:"2023", color:"#0d3d2e", award:"Global Distribution" },
  { id:4, title:"Meridian", category:"Broadcasting", year:"2023", color:"#3d1a1a", award:"Peabody Honoree" },
  { id:5, title:"Unseen Cities", category:"Production", year:"2023", color:"#1a2d3d", award:"Tribeca Premiere" },
  { id:6, title:"The Algorithm", category:"Distribution", year:"2024", color:"#2d2a1a", award:"50+ Markets" },
];

const PORTFOLIO_FILTERS = ["All","Broadcasting","Production","Distribution"];

const TIMELINE = [
  { year:"2008", title:"Founded", desc:"Born from a vision to redefine media storytelling in the digital age.", side:"right" },
  { year:"2012", title:"First Broadcast Deal", desc:"Secured landmark broadcasting rights across 12 countries.", side:"left" },
  { year:"2016", title:"Studio Expansion", desc:"Opened our flagship 40,000 sq ft production facility.", side:"right" },
  { year:"2019", title:"1 Billion Viewers", desc:"Crossed the billion viewers milestone with award-winning documentary series.", side:"left" },
  { year:"2022", title:"Digital Pivot", desc:"Launched OTT distribution platform serving 50+ markets.", side:"right" },
  { year:"2024", title:"New Chapter", desc:"Expanding into AI-augmented production and next-gen broadcast technology.", side:"left" },
];

const TEAM = [
  { name:"Marcus Veil", role:"Founder & CEO", color:"#1a3a5c", quote:"Stories shape civilizations." },
  { name:"Sophia Crane", role:"Chief Creative Officer", color:"#2d1a5c", quote:"Every frame is a choice." },
  { name:"James Okoro", role:"Head of Broadcasting", color:"#0d3d2e", quote:"Live media is raw truth." },
  { name:"Lena Vasquez", role:"Director of Production", color:"#3d1a1a", quote:"Craft before content." },
];

const CLIENTS = [
  "Netflix","Sony Pictures","HBO Max","Apple TV+","Amazon Prime",
  "Disney+","BBC","National Geographic","Warner Bros","Paramount+",
  "Hulu","Peacock","Showtime","A24","Lionsgate",
];

const TESTIMONIALS = [
  { quote:"Figuring Out Media didn't just deliver our content — they transformed it into a global phenomenon. Their production quality is unparalleled.", name:"Elena Rhodes", title:"Head of Content, StreamCore", initial:"E", color:"#1a3a5c" },
  { quote:"The distribution strategy they built for us opened markets we never imagined. Professional, visionary, and relentlessly excellent.", name:"David Kim", title:"VP Programming, NovaBroadcast", initial:"D", color:"#2d1a5c" },
  { quote:"Working with FOM felt like collaborating with the future of media. Every frame, every decision reflected world-class craftsmanship.", name:"Amara Obi", title:"Executive Producer, Atlas Films", initial:"A", color:"#0d3d2e" },
];

/* FREE PEXELS video URLs (no API key needed, direct mp4) */
const HERO_VIDEOS = [
  "https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/2795405/2795405-uhd_2560_1440_24fps.mp4",
  "https://videos.pexels.com/video-files/2278095/2278095-uhd_2560_1440_25fps.mp4",
];

/* ═══════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════ */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".section-reveal,.reveal-left,.reveal-right,.reveal-scale");
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

function useCounter(target, duration = 2200, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf, startTime = null;
    const step = ts => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(ease * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
}

/* ═══════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════ */
function Cursor() {
  const outer = useRef(null);
  const inner = useRef(null);
  useEffect(() => {
    const move = e => {
      if (outer.current) { outer.current.style.left = e.clientX+"px"; outer.current.style.top = e.clientY+"px"; }
      if (inner.current) { inner.current.style.left = e.clientX+"px"; inner.current.style.top = e.clientY+"px"; }
    };
    const addHover = () => outer.current?.classList.add("hovering");
    const rmHover  = () => outer.current?.classList.remove("hovering");
    window.addEventListener("mousemove", move);
    const targets = document.querySelectorAll("a,button,.service-card,.portfolio-card,.team-card");
    targets.forEach(el => { el.addEventListener("mouseenter", addHover); el.addEventListener("mouseleave", rmHover); });
    return () => window.removeEventListener("mousemove", move);
  });
  return (
    <>
      <div ref={outer} className="cursor-outer" />
      <div ref={inner} className="cursor-inner" />
    </>
  );
}

/* ═══════════════════════════════════════════
   PARTICLES
═══════════════════════════════════════════ */
function Particles({ count = 20 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i, size: Math.random() * 3 + 1, left: Math.random() * 100,
    dur: Math.random() * 15 + 10, delay: Math.random() * 15,
    dx: (Math.random() - 0.5) * 200,
    color: i % 3 === 0 ? "var(--neon)" : i % 3 === 1 ? "var(--blue)" : "var(--purple)",
  }));
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:1 }}>
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size, left:`${p.left}%`, bottom:0,
          background: p.color, boxShadow:`0 0 ${p.size*2}px ${p.color}`,
          "--dur":`${p.dur}s`, "--delay":`${p.delay}s`, "--dx":`${p.dx}px`, opacity:0.6,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════ */
function Navbar({ activePage, setActivePage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleNav = (link) => {
    setActivePage(link);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        padding:"0 5%", height: scrolled ? "64px" : "80px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background: scrolled ? "rgba(3,3,3,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12, cursor:"none" }} onClick={() => handleNav("Home")}>
          <div style={{
            width:38, height:38, borderRadius:9,
            background:"linear-gradient(135deg, var(--blue), var(--purple))",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, fontWeight:700, color:"white",
            boxShadow:"0 0 20px rgba(26,140,255,0.4)",
          }}>F</div>
          <div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:18, letterSpacing:"0.05em", color:"white", lineHeight:1 }}>FIGURING OUT</div>
            <div style={{ fontFamily:"var(--font-body)", fontSize:10, letterSpacing:"0.3em", color:"var(--neon)", textTransform:"uppercase" }}>MEDIA</div>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hide-mobile" style={{ display:"flex", gap:36, alignItems:"center" }}>
          {NAV_LINKS.map(link => (
            <a key={link} href="#" className={`nav-link ${activePage===link?"active":""}`}
              onClick={e => { e.preventDefault(); handleNav(link); }}>{link}</a>
          ))}
        </div>

        <button className="btn-neon hide-mobile" style={{ padding:"10px 24px", fontSize:12, borderRadius:4 }}
          onClick={() => handleNav("Contact")}>
          <span style={{ position:"relative", zIndex:1 }}>Get In Touch</span>
        </button>

        {/* Mobile hamburger */}
        <div onClick={() => setMobileOpen(!mobileOpen)} style={{ display:"flex", flexDirection:"column", gap:5, cursor:"none", padding:8 }}
          className="show-mobile">
          {[0,1,2].map(i => (
            <div key={i} style={{
              width:24, height:1.5,
              background: mobileOpen && i===1 ? "transparent" : "var(--neon)",
              transform: mobileOpen ? (i===0?"rotate(45deg) translate(4px,4px)":i===2?"rotate(-45deg) translate(4px,-4px)":"none") : "none",
              transition:"all 0.3s",
            }} />
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position:"fixed", inset:0, zIndex:999,
          background:"rgba(3,3,3,0.97)", backdropFilter:"blur(20px)",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:32,
        }}>
          {NAV_LINKS.map((link, i) => (
            <a key={link} href="#" style={{
              fontFamily:"var(--font-display)", fontSize:40, letterSpacing:"0.1em",
              color: activePage===link ? "var(--neon)" : "white", textDecoration:"none",
              opacity:0, animation:`fadeInUp 0.4s ease ${i*0.08}s forwards`,
            }}
              onClick={e => { e.preventDefault(); handleNav(link); }}>{link}</a>
          ))}
          <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   PAGE WRAPPER
═══════════════════════════════════════════ */
function PageWrapper({ children }) {
  return <div className="page-enter">{children}</div>;
}

/* ═══════════════════════════════════════════
   NEWS TICKER
═══════════════════════════════════════════ */
function NewsTicker() {
  const text = "BROADCASTING · PRODUCTION · DISTRIBUTION · AWARD-WINNING CONTENT · GLOBAL REACH · PREMIUM MEDIA · BROADCASTING · PRODUCTION · DISTRIBUTION · AWARD-WINNING CONTENT · GLOBAL REACH · ";
  return (
    <div style={{
      background:"rgba(26,140,255,0.07)", borderTop:"1px solid rgba(26,140,255,0.15)",
      borderBottom:"1px solid rgba(26,140,255,0.15)", padding:"9px 0", overflow:"hidden",
    }}>
      <div className="ticker" style={{ fontFamily:"var(--font-body)", fontSize:11, letterSpacing:"0.3em", color:"var(--blue)", textTransform:"uppercase" }}>
        {text}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════ */
function HomePage({ setActivePage }) {
  useScrollReveal();
  return (
    <PageWrapper>
      <HeroSection setActivePage={setActivePage} />
      <NewsTicker />
      <StatsSection />
      <FeaturedServicesSection setActivePage={setActivePage} />
      <FeaturedPortfolioSection setActivePage={setActivePage} />
      <ClientsMarquee />
      <TestimonialsSection />
      <CTABanner setActivePage={setActivePage} />
    </PageWrapper>
  );
}

/* ── HERO ── */
function HeroSection({ setActivePage }) {
  const [loaded, setLoaded] = useState(false);
  const [videoIdx] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <section id="home" style={{ position:"relative", height:"100vh", minHeight:700, overflow:"hidden",
      display:"flex", alignItems:"center", justifyContent:"center" }}>

      {/* REAL VIDEO BACKGROUND */}
      <video
        ref={videoRef}
        className="hero-video"
        src={HERO_VIDEOS[videoIdx]}
        autoPlay muted loop playsInline
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.3 }}
      />

      {/* Overlays */}
      <div className="video-overlay" />
      <div className="grid-overlay" />
      <Particles count={28} />

      {/* Scanlines */}
      <div style={{
        position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
        background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)",
      }} />

      {/* Content */}
      <div style={{ position:"relative", zIndex:3, textAlign:"center", padding:"0 5%", maxWidth:1100 }}>

        {/* Pre-title */}
        <div style={{
          opacity: loaded?1:0, transform: loaded?"none":"translateY(20px)",
          transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s",
          display:"inline-flex", alignItems:"center", gap:12, marginBottom:28,
        }}>
          <div style={{ width:40, height:1, background:"var(--neon)", boxShadow:"0 0 8px var(--neon)" }} />
          <span style={{ fontFamily:"var(--font-body)", fontSize:11, letterSpacing:"0.35em", textTransform:"uppercase", color:"var(--neon)" }}>
            Est. 2008 — Global Media House
          </span>
          <div style={{ width:40, height:1, background:"var(--neon)", boxShadow:"0 0 8px var(--neon)" }} />
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily:"var(--font-display)", fontSize:"clamp(3.5rem,9vw,9.5rem)",
          lineHeight:0.93, letterSpacing:"0.02em", marginBottom:8,
          opacity:loaded?1:0, transform:loaded?"none":"translateY(30px)",
          transition:"all 1s cubic-bezier(0.16,1,0.3,1) 0.4s",
        }}>
          <span style={{ color:"white", display:"block" }}>BROADCASTING</span>
          <span className="grad-text" style={{ display:"block" }}>STORIES THAT</span>
          <span style={{ color:"white", display:"block" }}>MOVE THE</span>
          <span style={{
            display:"block", WebkitTextStroke:"1.5px rgba(0,212,255,0.5)",
            WebkitTextFillColor:"transparent", color:"transparent",
          }}>WORLD</span>
        </h1>

        <p style={{
          fontFamily:"var(--font-serif)", fontStyle:"italic",
          fontSize:"clamp(1rem,2vw,1.3rem)", color:"var(--silver)",
          maxWidth:560, margin:"28px auto 44px",
          opacity:loaded?1:0, transform:loaded?"none":"translateY(20px)",
          transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 0.7s",
        }}>
          Premium broadcasting, production, and distribution for the stories that define our era.
        </p>

        {/* CTAs */}
        <div style={{
          display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap",
          opacity:loaded?1:0, transform:loaded?"none":"translateY(20px)",
          transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 0.9s",
        }}>
          <button className="btn-primary" style={{ padding:"16px 44px", fontSize:13, borderRadius:4 }}
            onClick={() => { setActivePage("Portfolio"); window.scrollTo({top:0}); }}>
            View Our Work
          </button>
          <button className="btn-neon" style={{ padding:"16px 44px", fontSize:13, borderRadius:4 }}
            onClick={() => { setActivePage("Contact"); window.scrollTo({top:0}); }}>
            <span style={{ position:"relative", zIndex:1 }}>Start a Project</span>
          </button>
        </div>

        {/* Floating badges */}
        <div className="badge-float hide-mobile" style={{
          position:"absolute", right:"5%", top:"50%", transform:"translateY(-50%)",
        }}>
          <div className="glass" style={{ borderRadius:12, padding:"16px 20px", textAlign:"center",
            borderColor:"rgba(0,212,255,0.2)" }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:28, color:"var(--neon)" }}>15B+</div>
            <div style={{ fontFamily:"var(--font-body)", fontSize:10, letterSpacing:"0.2em",
              color:"var(--silver)", textTransform:"uppercase" }}>Viewers</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)",
        display:"flex", flexDirection:"column", alignItems:"center", gap:8, zIndex:4,
        opacity:loaded?0.7:0, transition:"opacity 0.8s 1.4s",
      }}>
        <span style={{ fontSize:10, letterSpacing:"0.3em", color:"var(--silver)", textTransform:"uppercase" }}>Scroll</span>
        <div style={{ width:1, height:44, background:"linear-gradient(to bottom, var(--neon), transparent)",
          animation:"scrollPulse 2s ease-in-out infinite" }} />
      </div>

      <div className="glow-line" style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:5 }} />
    </section>
  );
}

/* ── STATS ── */
function StatsSection() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setStarted(true), { threshold:0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding:"80px 5%", background:"var(--charcoal)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 100% at 50% 50%, rgba(26,140,255,0.06), transparent)" }} />
      <div className="stat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2, maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
        {STATS.map((s, i) => <StatCard key={i} stat={s} started={started} delay={i*150} />)}
      </div>
    </section>
  );
}

function StatCard({ stat, started, delay }) {
  const count = useCounter(stat.value, 2200, started);
  return (
    <div style={{ textAlign:"center", padding:"40px 20px", borderRight:"1px solid rgba(255,255,255,0.05)" }}>
      <div className="stat-num" style={{ transitionDelay:`${delay}ms` }}>{count}{stat.suffix}</div>
      <div style={{ fontFamily:"var(--font-body)", fontSize:12, letterSpacing:"0.2em",
        textTransform:"uppercase", color:"var(--silver)", marginTop:8 }}>{stat.label}</div>
    </div>
  );
}

/* ── FEATURED SERVICES (homepage mini) ── */
function FeaturedServicesSection({ setActivePage }) {
  return (
    <section style={{ padding:"100px 5%", position:"relative", overflow:"hidden" }}>
      <div className="mesh-bg" />
      <div style={{ maxWidth:1200, margin:"0 auto", position:"relative", zIndex:2 }}>
        <div className="section-reveal" style={{ textAlign:"center", marginBottom:60 }}>
          <div style={{ fontFamily:"var(--font-body)", fontSize:11, letterSpacing:"0.3em", color:"var(--purple)", textTransform:"uppercase", marginBottom:12 }}>What We Do</div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2rem,5vw,4.5rem)", color:"white", letterSpacing:"0.05em" }}>
            SERVICES BUILT<br /><span className="grad-text">FOR THE BEST</span>
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
          {SERVICES.map((svc, i) => (
            <div key={i} className="service-card glass section-reveal" style={{
              borderRadius:14, padding:"40px 32px", borderColor:"rgba(255,255,255,0.07)",
              transitionDelay:`${i*100}ms`,
            }}>
              <div style={{ fontSize:38, marginBottom:20, filter:`drop-shadow(0 0 12px ${svc.color})` }}>{svc.icon}</div>
              <h3 style={{ fontFamily:"var(--font-display)", fontSize:24, letterSpacing:"0.08em", color:"white", marginBottom:12 }}>{svc.title.toUpperCase()}</h3>
              <p style={{ fontFamily:"var(--font-body)", fontSize:14, lineHeight:1.8, color:"var(--silver)" }}>{svc.desc}</p>
              <div style={{ marginTop:24 }}>
                <button className="btn-neon" style={{ padding:"9px 20px", fontSize:11, borderRadius:4, borderColor:`${svc.color}80`, color:svc.color }}
                  onClick={() => { setActivePage("Services"); window.scrollTo({top:0}); }}>
                  <span style={{ position:"relative", zIndex:1 }}>Learn More →</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FEATURED PORTFOLIO (homepage) ── */
function FeaturedPortfolioSection({ setActivePage }) {
  return (
    <section style={{ padding:"80px 5%", background:"var(--charcoal)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="section-reveal" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:48, flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ fontFamily:"var(--font-body)", fontSize:11, letterSpacing:"0.3em", color:"var(--neon)", textTransform:"uppercase", marginBottom:12 }}>Featured Work</div>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2rem,5vw,4rem)", color:"white", letterSpacing:"0.05em" }}>LATEST<br /><span className="grad-text">PRODUCTIONS</span></h2>
          </div>
          <button className="btn-neon" style={{ padding:"12px 28px", fontSize:12, borderRadius:4 }}
            onClick={() => { setActivePage("Portfolio"); window.scrollTo({top:0}); }}>
            <span style={{ position:"relative", zIndex:1 }}>View All →</span>
          </button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
          {PORTFOLIO_ITEMS.slice(0,4).map((item, i) => (
            <PortfolioCard key={item.id} item={item} delay={i*80} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CLIENTS MARQUEE ── */
function ClientsMarquee() {
  return (
    <section style={{ padding:"70px 0", overflow:"hidden" }}>
      <div className="section-reveal" style={{ textAlign:"center", marginBottom:40, padding:"0 5%" }}>
        <div style={{ fontFamily:"var(--font-body)", fontSize:11, letterSpacing:"0.3em", color:"var(--blue)", textTransform:"uppercase", marginBottom:10 }}>Trusted By</div>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.8rem,4vw,3.5rem)", color:"white", letterSpacing:"0.05em" }}>
          THE WORLD'S GREATEST<br /><span className="grad-text">NETWORKS & STUDIOS</span>
        </h2>
      </div>
      <div style={{ overflow:"hidden", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"22px 0" }}>
        <div className="marquee-track" style={{ display:"flex", gap:0, width:"max-content" }}>
          {[...CLIENTS,...CLIENTS].map((c,i) => (
            <div key={i} style={{ padding:"0 44px", fontFamily:"var(--font-display)", fontSize:20,
              color:"rgba(168,178,192,0.35)", letterSpacing:"0.12em", whiteSpace:"nowrap",
              transition:"color 0.3s", cursor:"none" }}
              onMouseEnter={e=>e.currentTarget.style.color="var(--neon)"}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(168,178,192,0.35)"}
            >{c}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ── */
function TestimonialsSection() {
  return (
    <section style={{ padding:"80px 5%", background:"var(--charcoal)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="section-reveal" style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontFamily:"var(--font-display)", fontSize:36, color:"white", letterSpacing:"0.05em" }}>WHAT CLIENTS SAY</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
          {TESTIMONIALS.map((t,i) => (
            <div key={i} className="section-reveal glass" style={{
              borderRadius:14, padding:"36px 30px", borderColor:"rgba(255,255,255,0.06)",
              transitionDelay:`${i*100}ms`,
            }}>
              <div style={{ fontSize:40, color:"var(--blue)", fontFamily:"serif", lineHeight:0.8, marginBottom:18, opacity:0.5 }}>"</div>
              <p style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:16, lineHeight:1.9, color:"var(--silver-light)", marginBottom:26 }}>{t.quote}</p>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:44, height:44, borderRadius:"50%",
                  background:`linear-gradient(135deg, ${t.color}, var(--purple))`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"var(--font-display)", fontSize:18, color:"white" }}>{t.initial}</div>
                <div>
                  <div style={{ fontFamily:"var(--font-body)", fontWeight:500, color:"white", fontSize:14 }}>{t.name}</div>
                  <div style={{ fontFamily:"var(--font-body)", fontSize:12, color:"var(--silver)" }}>{t.title}</div>
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
function CTABanner({ setActivePage }) {
  return (
    <section style={{ padding:"100px 5%", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(26,140,255,0.12),rgba(123,47,255,0.1),rgba(0,212,255,0.08))" }} />
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)", backgroundSize:"40px 40px" }} />
      <div className="glow-line" style={{ position:"absolute", top:0, left:0, right:0 }} />
      <div className="glow-line" style={{ position:"absolute", bottom:0, left:0, right:0 }} />
      <div className="section-reveal" style={{ textAlign:"center", position:"relative", zIndex:1, maxWidth:700, margin:"0 auto" }}>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.5rem,6vw,5rem)", color:"white", letterSpacing:"0.05em", marginBottom:22 }}>
          READY TO<br /><span className="grad-text">TELL YOUR STORY?</span>
        </h2>
        <p style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:18, color:"var(--silver)", marginBottom:38, lineHeight:1.7 }}>
          Partner with Figuring Out Media and let us broadcast your vision to the world.
        </p>
        <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-primary" style={{ padding:"17px 48px", fontSize:13, borderRadius:4 }}
            onClick={() => { setActivePage("Contact"); window.scrollTo({top:0}); }}>Begin Your Project</button>
          <button className="btn-neon" style={{ padding:"17px 48px", fontSize:13, borderRadius:4 }}
            onClick={() => { setActivePage("Portfolio"); window.scrollTo({top:0}); }}>
            <span style={{ position:"relative", zIndex:1 }}>View Portfolio</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   ABOUT PAGE
═══════════════════════════════════════════ */
function AboutPage() {
  useScrollReveal();
  return (
    <PageWrapper>
      {/* Hero Banner */}
      <div style={{ paddingTop:120, paddingBottom:80, padding:"120px 5% 80px", position:"relative", background:"var(--charcoal)", overflow:"hidden" }}>
        <div className="mesh-bg" />
        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center", position:"relative", zIndex:2 }}>
          <div style={{ fontFamily:"var(--font-body)", fontSize:11, letterSpacing:"0.3em", color:"var(--neon)", textTransform:"uppercase", marginBottom:16 }}>Who We Are</div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3rem,8vw,7rem)", color:"white", letterSpacing:"0.04em", lineHeight:0.95 }}>
            CRAFTING THE<br /><span className="grad-text">FUTURE OF MEDIA</span>
          </h1>
          <p style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"clamp(1rem,2vw,1.2rem)", color:"var(--silver)", maxWidth:600, margin:"24px auto 0", lineHeight:1.8 }}>
            Since 2008, we've been at the intersection of art, technology, and storytelling — building a global media legacy one frame at a time.
          </p>
        </div>
        <div className="glow-line" style={{ position:"absolute", bottom:0, left:0, right:0 }} />
      </div>

      {/* Vision / Mission */}
      <section style={{ padding:"80px 5%", position:"relative", overflow:"hidden" }}>
        <div className="mesh-bg" />
        <div style={{ maxWidth:1200, margin:"0 auto", position:"relative", zIndex:2 }}>
          <div className="vision-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:80 }}>
            {[
              { label:"Our Vision", icon:"◈", color:"var(--blue)", text:"To become the world's most trusted creative media force — shaping culture, amplifying voices, and connecting humanity through storytelling that transcends borders and generations." },
              { label:"Our Mission", icon:"◇", color:"var(--purple)", text:"To deliver uncompromising broadcast, production, and distribution services that empower creators, brands, and networks to reach their audiences with maximum impact and artistic integrity." },
            ].map((item,i) => (
              <div key={i} className={`glass ${i===0?"reveal-left":"reveal-right"}`} style={{ padding:"44px 40px", borderRadius:14, borderColor:`${i===0?"rgba(26,140,255,0.2)":"rgba(123,47,255,0.2)"}` }}>
                <div style={{ fontSize:26, marginBottom:12, color:item.color }}>{item.icon}</div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:24, letterSpacing:"0.1em", color:"white", marginBottom:16 }}>{item.label.toUpperCase()}</div>
                <p style={{ fontFamily:"var(--font-serif)", fontSize:17, lineHeight:1.9, color:"var(--silver)", fontStyle:"italic" }}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="section-reveal" style={{ marginBottom:100 }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:38, color:"white", letterSpacing:"0.05em", textAlign:"center", marginBottom:64 }}>OUR JOURNEY</div>
            <div style={{ position:"relative" }}>
              <div className="timeline-line" />
              {TIMELINE.map((item,i) => (
                <div key={i} className="section-reveal" style={{
                  display:"flex",
                  justifyContent: item.side==="right" ? "flex-start" : "flex-end",
                  paddingLeft: item.side==="right" ? "calc(50% + 30px)" : 0,
                  paddingRight: item.side==="left" ? "calc(50% + 30px)" : 0,
                  marginBottom:40,
                  transitionDelay:`${i*100}ms`,
                }}>
                  <div className="glass" style={{ padding:"24px 28px", borderRadius:12, maxWidth:320,
                    borderColor:`rgba(${i%2===0?"26,140,255":"123,47,255"},0.2)` }}>
                    <div style={{ fontFamily:"var(--font-display)", fontSize:30, color:i%2===0?"var(--blue)":"var(--purple)", marginBottom:4 }}>{item.year}</div>
                    <div style={{ fontFamily:"var(--font-body)", fontWeight:500, color:"white", marginBottom:8, fontSize:15 }}>{item.title}</div>
                    <div style={{ fontFamily:"var(--font-body)", fontSize:13, color:"var(--silver)", lineHeight:1.7 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="section-reveal">
            <div style={{ fontFamily:"var(--font-display)", fontSize:38, color:"white", letterSpacing:"0.05em", textAlign:"center", marginBottom:48 }}>LEADERSHIP TEAM</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20 }}>
              {TEAM.map((m,i) => (
                <div key={i} className="team-card glass" style={{ borderRadius:14, overflow:"hidden", borderColor:"rgba(255,255,255,0.05)", transitionDelay:`${i*80}ms` }}>
                  <div style={{ height:200, background:`linear-gradient(135deg,${m.color},#0a0a12)`,
                    display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                    <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.08)",
                      border:"2px solid rgba(255,255,255,0.15)", display:"flex", alignItems:"center",
                      justifyContent:"center", fontFamily:"var(--font-display)", fontSize:32, color:"white" }}>
                      {m.name[0]}
                    </div>
                  </div>
                  <div style={{ padding:"22px 22px" }}>
                    <div style={{ fontFamily:"var(--font-body)", fontWeight:500, color:"white", fontSize:15, marginBottom:4 }}>{m.name}</div>
                    <div style={{ fontFamily:"var(--font-body)", fontSize:12, color:"var(--neon)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>{m.role}</div>
                    <div style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:13, color:"var(--silver)" }}>"{m.quote}"</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

/* ═══════════════════════════════════════════
   SERVICES PAGE
═══════════════════════════════════════════ */
function ServicesPage({ setActivePage }) {
  useScrollReveal();
  return (
    <PageWrapper>
      <div style={{ paddingTop:120, paddingBottom:80, padding:"120px 5% 80px", position:"relative", background:"var(--charcoal)", overflow:"hidden" }}>
        <div className="mesh-bg" />
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center", position:"relative", zIndex:2 }}>
          <div style={{ fontFamily:"var(--font-body)", fontSize:11, letterSpacing:"0.3em", color:"var(--purple)", textTransform:"uppercase", marginBottom:16 }}>What We Offer</div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3rem,8vw,7rem)", color:"white", letterSpacing:"0.04em", lineHeight:0.95 }}>
            WORLD-CLASS<br /><span className="grad-text">MEDIA SERVICES</span>
          </h1>
        </div>
        <div className="glow-line" style={{ position:"absolute", bottom:0, left:0, right:0 }} />
      </div>

      <section style={{ padding:"80px 5% 100px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% 50%, rgba(123,47,255,0.05), transparent)" }} />
        <div style={{ maxWidth:1200, margin:"0 auto", position:"relative", zIndex:1 }}>
          {SERVICES.map((svc, i) => (
            <div key={i} className={`section-reveal glass`} style={{
              borderRadius:16, padding:"52px 48px", marginBottom:24,
              borderColor:`${svc.color}25`,
              transitionDelay:`${i*120}ms`,
            }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:48, alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:52, marginBottom:22, filter:`drop-shadow(0 0 16px ${svc.color})` }}>{svc.icon}</div>
                  <h2 style={{ fontFamily:"var(--font-display)", fontSize:42, letterSpacing:"0.06em", color:"white", marginBottom:16, lineHeight:1 }}>{svc.title.toUpperCase()}</h2>
                  <p style={{ fontFamily:"var(--font-body)", fontSize:15, lineHeight:1.8, color:"var(--silver)" }}>{svc.desc}</p>
                  <button className="btn-primary" style={{ marginTop:28, padding:"13px 32px", fontSize:12, borderRadius:4 }}
                    onClick={() => { setActivePage("Contact"); window.scrollTo({top:0}); }}>
                    Get Started →
                  </button>
                </div>
                <div>
                  <div style={{ fontFamily:"var(--font-body)", fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--silver)", marginBottom:20 }}>What's Included</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    {[...svc.features, "Custom Strategy", "Dedicated Support", "Real-time Analytics", "Global Network"].map((f,j) => (
                      <div key={j} style={{ display:"flex", alignItems:"center", gap:10,
                        padding:"14px 16px", borderRadius:8,
                        background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ width:5, height:5, borderRadius:"50%", background:svc.color, boxShadow:`0 0 8px ${svc.color}`, flexShrink:0 }} />
                        <span style={{ fontFamily:"var(--font-body)", fontSize:13, color:"var(--silver-light)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}

/* ═══════════════════════════════════════════
   PORTFOLIO CARD (shared)
═══════════════════════════════════════════ */
function PortfolioCard({ item, delay=0, onClick }) {
  return (
    <div className="portfolio-card glass section-reveal" style={{
      borderRadius:12, borderColor:"rgba(255,255,255,0.06)",
      transitionDelay:`${delay}ms`,
    }} onClick={onClick}>
      <div style={{ position:"relative", height:220, overflow:"hidden" }}>
        <div className="thumb" style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,${item.color} 0%,#0a0a14 100%)` }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(circle at 30% 40%, rgba(255,255,255,0.06) 0%, transparent 50%)` }} />
          <div style={{ position:"absolute", bottom:16, left:16, fontFamily:"var(--font-display)", fontSize:52, color:"rgba(255,255,255,0.05)", letterSpacing:"0.05em" }}>
            {String(item.id).padStart(2,"0")}
          </div>
          {item.award && (
            <div style={{ position:"absolute", top:14, right:14, background:"rgba(0,212,255,0.12)",
              border:"1px solid rgba(0,212,255,0.25)", borderRadius:20, padding:"4px 10px",
              fontFamily:"var(--font-body)", fontSize:10, color:"var(--neon)", letterSpacing:"0.1em" }}>
              {item.award}
            </div>
          )}
        </div>
        <div className="overlay" style={{ position:"absolute", inset:0, zIndex:2, background:"rgba(3,3,3,0.65)",
          display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:10 }}>
          <div style={{ width:50, height:50, borderRadius:"50%", border:"1.5px solid white",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>▶</div>
          <span style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"white" }}>View Project</span>
        </div>
      </div>
      <div style={{ padding:"18px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontFamily:"var(--font-body)", fontWeight:500, color:"white", fontSize:14, marginBottom:4 }}>{item.title}</div>
            <div style={{ fontFamily:"var(--font-body)", fontSize:11, color:"var(--neon)", letterSpacing:"0.1em", textTransform:"uppercase" }}>{item.category}</div>
          </div>
          <div style={{ fontFamily:"var(--font-body)", fontSize:12, color:"var(--silver)" }}>{item.year}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PORTFOLIO PAGE
═══════════════════════════════════════════ */
function PortfolioPage() {
  useScrollReveal();
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const filtered = filter==="All" ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter(p=>p.category===filter);

  return (
    <PageWrapper>
      <div style={{ padding:"120px 5% 80px", position:"relative", background:"var(--charcoal)", overflow:"hidden" }}>
        <div className="mesh-bg" />
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center", position:"relative", zIndex:2 }}>
          <div style={{ fontFamily:"var(--font-body)", fontSize:11, letterSpacing:"0.3em", color:"var(--neon)", textTransform:"uppercase", marginBottom:16 }}>Our Work</div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3rem,8vw,7rem)", color:"white", letterSpacing:"0.04em", lineHeight:0.95 }}>
            AWARD-WINNING<br /><span className="grad-text">PRODUCTIONS</span>
          </h1>
        </div>
        <div className="glow-line" style={{ position:"absolute", bottom:0, left:0, right:0 }} />
      </div>

      <section style={{ padding:"70px 5% 100px", position:"relative", overflow:"hidden" }}>
        <div className="mesh-bg" />
        <div style={{ maxWidth:1200, margin:"0 auto", position:"relative", zIndex:2 }}>
          {/* Filters */}
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:48 }}>
            {PORTFOLIO_FILTERS.map(f => (
              <button key={f} onClick={()=>setFilter(f)} style={{
                padding:"9px 24px", fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase",
                borderRadius:4, cursor:"none",
                background: filter===f ? "linear-gradient(135deg, var(--blue), var(--purple))" : "transparent",
                border: filter===f ? "none" : "1px solid rgba(255,255,255,0.12)",
                color: filter===f ? "white" : "var(--silver)",
                transition:"all 0.3s", fontFamily:"var(--font-body)",
              }}>{f}</button>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
            {filtered.map((item,i) => (
              <PortfolioCard key={item.id} item={item} delay={i*60} onClick={()=>setModal(item)} />
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {modal && (
        <div onClick={()=>setModal(null)} style={{
          position:"fixed", inset:0, zIndex:2000, background:"rgba(0,0,0,0.9)",
          backdropFilter:"blur(20px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20,
        }}>
          <div onClick={e=>e.stopPropagation()} className="glass-bright" style={{ borderRadius:20, maxWidth:680, width:"100%", overflow:"hidden" }}>
            <div style={{ height:280, background:`linear-gradient(135deg,${modal.color},#0a0a14)`,
              display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
              <div style={{ width:70, height:70, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, background:"rgba(255,255,255,0.08)" }}>▶</div>
              <button onClick={()=>setModal(null)} style={{
                position:"absolute", top:16, right:16, background:"rgba(255,255,255,0.1)",
                border:"none", color:"white", width:36, height:36, borderRadius:"50%", fontSize:18, cursor:"none",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>×</button>
              {modal.award && (
                <div style={{ position:"absolute", bottom:16, left:16, background:"rgba(0,212,255,0.12)",
                  border:"1px solid rgba(0,212,255,0.3)", borderRadius:20, padding:"5px 14px",
                  fontFamily:"var(--font-body)", fontSize:11, color:"var(--neon)", letterSpacing:"0.1em" }}>
                  🏆 {modal.award}
                </div>
              )}
            </div>
            <div style={{ padding:"32px 36px" }}>
              <div style={{ fontFamily:"var(--font-body)", fontSize:11, color:"var(--neon)", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:8 }}>{modal.category} · {modal.year}</div>
              <h3 style={{ fontFamily:"var(--font-display)", fontSize:36, color:"white", letterSpacing:"0.05em", marginBottom:14 }}>{modal.title.toUpperCase()}</h3>
              <p style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:15, lineHeight:1.9, color:"var(--silver)", marginBottom:24 }}>
                An ambitious production that pushed the boundaries of storytelling. Distributed across 40+ markets and celebrated at international festivals for its cinematic vision and cultural impact.
              </p>
              <button className="btn-primary" style={{ padding:"12px 28px", fontSize:12, borderRadius:4 }}>Full Case Study →</button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

/* ═══════════════════════════════════════════
   CLIENTS PAGE
═══════════════════════════════════════════ */
function ClientsPage() {
  useScrollReveal();
  return (
    <PageWrapper>
      <div style={{ padding:"120px 5% 80px", position:"relative", background:"var(--charcoal)", overflow:"hidden" }}>
        <div className="mesh-bg" />
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center", position:"relative", zIndex:2 }}>
          <div style={{ fontFamily:"var(--font-body)", fontSize:11, letterSpacing:"0.3em", color:"var(--blue)", textTransform:"uppercase", marginBottom:16 }}>Our Network</div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3rem,8vw,7rem)", color:"white", letterSpacing:"0.04em", lineHeight:0.95 }}>
            GLOBAL<br /><span className="grad-text">PARTNERSHIPS</span>
          </h1>
        </div>
        <div className="glow-line" style={{ position:"absolute", bottom:0, left:0, right:0 }} />
      </div>

      <ClientsMarquee />

      <section style={{ padding:"60px 5% 100px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="section-reveal" style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:36, color:"white", letterSpacing:"0.05em" }}>TRUSTED BY INDUSTRY LEADERS</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12 }}>
            {CLIENTS.map((c,i) => (
              <div key={i} className="section-reveal glass" style={{
                borderRadius:10, padding:"28px 20px", textAlign:"center",
                borderColor:"rgba(255,255,255,0.06)", transitionDelay:`${i*40}ms`,
                transition:"border-color 0.3s, box-shadow 0.3s", cursor:"none",
              }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(0,212,255,0.25)"; e.currentTarget.style.boxShadow="0 8px 30px rgba(0,212,255,0.1)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow="none"; }}
              >
                <div style={{ fontFamily:"var(--font-display)", fontSize:20, color:"rgba(168,178,192,0.5)", letterSpacing:"0.08em",
                  transition:"color 0.3s" }}>{c}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:80 }}>
            <TestimonialsSection />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

/* ═══════════════════════════════════════════
   CONTACT PAGE
═══════════════════════════════════════════ */
function ContactPage() {
  useScrollReveal();
  const [form, setForm] = useState({ name:"", email:"", company:"", service:"", message:"" });
  const [sent, setSent] = useState(false);
  const handleSubmit = () => { if (form.name && form.email) setSent(true); };

  return (
    <PageWrapper>
      <div style={{ padding:"120px 5% 80px", position:"relative", background:"var(--charcoal)", overflow:"hidden" }}>
        <div className="mesh-bg" />
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center", position:"relative", zIndex:2 }}>
          <div style={{ fontFamily:"var(--font-body)", fontSize:11, letterSpacing:"0.3em", color:"var(--neon)", textTransform:"uppercase", marginBottom:16 }}>Reach Out</div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3rem,8vw,7rem)", color:"white", letterSpacing:"0.04em", lineHeight:0.95 }}>
            LET'S CREATE<br /><span className="grad-text">SOMETHING ICONIC</span>
          </h1>
        </div>
        <div className="glow-line" style={{ position:"absolute", bottom:0, left:0, right:0 }} />
      </div>

      <section style={{ padding:"80px 5% 100px", position:"relative" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 80% at 80% 50%, rgba(26,140,255,0.06), transparent)" }} />
        <div style={{ maxWidth:1200, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div className="contact-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1.3fr", gap:44 }}>

            {/* Info panel */}
            <div className="reveal-left">
              <div className="glow-line" style={{ marginBottom:40 }} />
              {[
                { label:"Email", value:"hello@figuringoutmedia.com", icon:"✉" },
                { label:"Phone", value:"+1 (310) 555-0192", icon:"☎" },
                { label:"Headquarters", value:"Los Angeles, California", icon:"◎" },
                { label:"Studios", value:"New York · London · Dubai", icon:"🎬" },
              ].map((item,i) => (
                <div key={i} style={{ display:"flex", gap:18, marginBottom:28 }}>
                  <div style={{ width:46, height:46, borderRadius:10, background:"rgba(26,140,255,0.1)",
                    border:"1px solid rgba(26,140,255,0.2)", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:18, flexShrink:0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily:"var(--font-body)", fontSize:11, letterSpacing:"0.2em",
                      textTransform:"uppercase", color:"var(--silver)", marginBottom:4 }}>{item.label}</div>
                    <div style={{ fontFamily:"var(--font-body)", fontSize:14, color:"white" }}>{item.value}</div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop:44 }}>
                <div style={{ fontFamily:"var(--font-body)", fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--silver)", marginBottom:16 }}>Follow Us</div>
                <div style={{ display:"flex", gap:10 }}>
                  {[
                    { label:"TW", url:"https://twitter.com" },
                    { label:"IG", url:"https://instagram.com" },
                    { label:"LI", url:"https://linkedin.com" },
                    { label:"YT", url:"https://youtube.com" },
                  ].map((s,i) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{
                      width:42, height:42, borderRadius:9, border:"1px solid rgba(255,255,255,0.1)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontFamily:"var(--font-body)", fontSize:11, color:"var(--silver)",
                      textDecoration:"none", letterSpacing:"0.05em",
                      transition:"border-color 0.3s, color 0.3s, box-shadow 0.3s",
                    }}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--neon)"; e.currentTarget.style.color="var(--neon)"; e.currentTarget.style.boxShadow="0 0 12px rgba(0,212,255,0.2)"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="var(--silver)"; e.currentTarget.style.boxShadow="none"; }}
                    >{s.label}</a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div style={{ marginTop:44, borderRadius:12, overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)", height:180,
                background:"linear-gradient(135deg,#0a1520,#0d0a1a)", position:"relative",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>📍</div>
                  <div style={{ fontFamily:"var(--font-body)", fontSize:12, color:"var(--silver)", letterSpacing:"0.1em" }}>LOS ANGELES, CA</div>
                  <div style={{ fontFamily:"var(--font-body)", fontSize:11, color:"var(--neon)", marginTop:4 }}>34.0522° N, 118.2437° W</div>
                </div>
                <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)`, backgroundSize:"20px 20px" }} />
              </div>
            </div>

            {/* Form */}
            <div className="reveal-right glass-bright" style={{ borderRadius:16, padding:"44px 40px" }}>
              {sent ? (
                <div style={{ textAlign:"center", padding:"60px 0" }}>
                  <div style={{ width:70, height:70, borderRadius:"50%", background:"rgba(0,212,255,0.1)",
                    border:"2px solid var(--neon)", display:"flex", alignItems:"center", justifyContent:"center",
                    margin:"0 auto 24px", fontSize:28 }}>✓</div>
                  <h3 style={{ fontFamily:"var(--font-display)", fontSize:30, color:"var(--neon)", letterSpacing:"0.05em", marginBottom:12 }}>MESSAGE SENT</h3>
                  <p style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", color:"var(--silver)", fontSize:16 }}>We'll be in touch within 24 hours.</p>
                  <button className="btn-neon" style={{ marginTop:28, padding:"12px 28px", fontSize:12, borderRadius:4 }}
                    onClick={()=>setSent(false)}>
                    <span style={{ position:"relative", zIndex:1 }}>Send Another</span>
                  </button>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontFamily:"var(--font-display)", fontSize:28, color:"white", letterSpacing:"0.05em", marginBottom:28 }}>START A PROJECT</h3>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                    {[
                      { field:"name", label:"Full Name", placeholder:"Marcus Veil", type:"text" },
                      { field:"email", label:"Email", placeholder:"hello@studio.com", type:"email" },
                    ].map(({field,label,placeholder,type}) => (
                      <div key={field}>
                        <label style={{ fontFamily:"var(--font-body)", fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--silver)", display:"block", marginBottom:7 }}>{label}</label>
                        <input type={type} className="luxury-input" style={{ width:"100%", padding:"12px 15px", borderRadius:8, fontSize:14 }}
                          placeholder={placeholder} value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})} />
                      </div>
                    ))}
                  </div>
                  {[
                    { field:"company", label:"Company", placeholder:"Your Company", type:"text" },
                  ].map(({field,label,placeholder,type}) => (
                    <div key={field} style={{ marginBottom:14 }}>
                      <label style={{ fontFamily:"var(--font-body)", fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--silver)", display:"block", marginBottom:7 }}>{label}</label>
                      <input type={type} className="luxury-input" style={{ width:"100%", padding:"12px 15px", borderRadius:8, fontSize:14 }}
                        placeholder={placeholder} value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})} />
                    </div>
                  ))}
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontFamily:"var(--font-body)", fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--silver)", display:"block", marginBottom:7 }}>Service Needed</label>
                    <select className="luxury-input" style={{ width:"100%", padding:"12px 15px", borderRadius:8, fontSize:14 }}
                      value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
                      <option value="" style={{ background:"#0e0e12" }}>Select a service</option>
                      <option value="Broadcasting" style={{ background:"#0e0e12" }}>Broadcasting</option>
                      <option value="Production" style={{ background:"#0e0e12" }}>Production Services</option>
                      <option value="Distribution" style={{ background:"#0e0e12" }}>Content Distribution</option>
                      <option value="Other" style={{ background:"#0e0e12" }}>Other / Consultation</option>
                    </select>
                  </div>
                  <div style={{ marginBottom:26 }}>
                    <label style={{ fontFamily:"var(--font-body)", fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--silver)", display:"block", marginBottom:7 }}>Your Message</label>
                    <textarea className="luxury-input" rows={5} style={{ width:"100%", padding:"12px 15px", borderRadius:8, fontSize:14, resize:"vertical" }}
                      placeholder="Tell us about your project, timeline, and vision..."
                      value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
                  </div>
                  <button className="btn-primary" style={{ width:"100%", padding:"16px", fontSize:13, borderRadius:8 }}
                    onClick={handleSubmit}>Send Message →</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════ */
function Footer({ setActivePage }) {
  return (
    <footer style={{ background:"#020202", padding:"60px 5% 28px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:48 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18, cursor:"none" }}
              onClick={() => { setActivePage("Home"); window.scrollTo({top:0}); }}>
              <div style={{ width:38, height:38, borderRadius:9, background:"linear-gradient(135deg,var(--blue),var(--purple))",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:"white" }}>F</div>
              <div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:16, letterSpacing:"0.05em", color:"white" }}>FIGURING OUT MEDIA</div>
                <div style={{ fontFamily:"var(--font-body)", fontSize:9, letterSpacing:"0.3em", color:"var(--neon)", textTransform:"uppercase" }}>Global Media House</div>
              </div>
            </div>
            <p style={{ fontFamily:"var(--font-body)", fontSize:13, color:"var(--silver)", lineHeight:1.8, maxWidth:260 }}>
              Broadcasting stories that move the world. Premium media production, distribution, and broadcasting since 2008.
            </p>
          </div>
          {[
            { title:"Company", items:[{label:"About",page:"About"},{label:"Services",page:"Services"},{label:"Portfolio",page:"Portfolio"},{label:"Clients",page:"Clients"},{label:"Contact",page:"Contact"}] },
            { title:"Services", items:[{label:"Broadcasting"},{label:"Production"},{label:"Distribution"},{label:"Live Events"},{label:"Post Production"}] },
            { title:"Connect", items:[{label:"Twitter",url:"https://twitter.com"},{label:"Instagram",url:"https://instagram.com"},{label:"LinkedIn",url:"https://linkedin.com"},{label:"YouTube",url:"https://youtube.com"},{label:"hello@fom.com"}] },
          ].map((col,i) => (
            <div key={i}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:15, color:"white", letterSpacing:"0.1em", marginBottom:18 }}>{col.title.toUpperCase()}</div>
              {col.items.map((item,j) => (
                <div key={j} style={{ marginBottom:10 }}>
                  {item.page ? (
                    <a href="#" onClick={e=>{ e.preventDefault(); setActivePage(item.page); window.scrollTo({top:0}); }}>{item.label}</a>
                  ) : item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer">{item.label}</a>
                  ) : (
                    <a href="#">{item.label}</a>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="glow-line" style={{ marginBottom:22 }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ fontFamily:"var(--font-body)", fontSize:12, color:"rgba(168,178,192,0.35)" }}>© 2024 Figuring Out Media. All rights reserved.</div>
          <div style={{ fontFamily:"var(--font-body)", fontSize:12, color:"rgba(168,178,192,0.35)" }}>Crafted with precision · Los Angeles, CA</div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   ROOT APP — React Router (hash-based)
═══════════════════════════════════════════ */
export default function App() {
  const [activePage, setActivePage] = useState("Home");

  const renderPage = () => {
    switch (activePage) {
      case "Home":      return <HomePage setActivePage={setActivePage} />;
      case "About":     return <AboutPage />;
      case "Services":  return <ServicesPage setActivePage={setActivePage} />;
      case "Portfolio": return <PortfolioPage />;
      case "Clients":   return <ClientsPage />;
      case "Contact":   return <ContactPage />;
      default:          return <HomePage setActivePage={setActivePage} />;
    }
  };

  return (
    <>
      <GlobalStyles />
      <Cursor />
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main style={{ minHeight:"100vh" }}>
        {renderPage()}
      </main>
      <Footer setActivePage={setActivePage} />
    </>
  );
}
