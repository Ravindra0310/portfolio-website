import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useScroll, useSpring } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, ExternalLink, Code2, Cpu, Database,
  Palette, Menu, X, ChevronRight, ChevronUp, Download, Terminal, Briefcase,
  GraduationCap, Trophy, Star, MapPin, Phone, Copy, Check, Send, Gamepad2
} from 'lucide-react';
import { Game2048 } from './components/Game2048';

/* ─── Custom Cursor ───────────────────────────────────────────────────────── */
const CustomCursor = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    let rx = 0, ry = 0, dx = 0, dy = 0;
    let raf: number;
    const move = (e: MouseEvent) => { dx = e.clientX; dy = e.clientY; };
    const loop = () => {
      rx += (dx - rx) * 0.12;
      ry += (dy - ry) * 0.12;
      if (ringRef.current) { ringRef.current.style.left = `${rx}px`; ringRef.current.style.top = `${ry}px`; }
      if (dotRef.current)  { dotRef.current.style.left  = `${dx}px`; dotRef.current.style.top  = `${dy}px`; }
      raf = requestAnimationFrame(loop);
    };
    const onEnter = () => setHovering(true);
    const onLeave = () => setHovering(false);
    window.addEventListener('mousemove', move);
    document.querySelectorAll('a,button,[role=button]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={ringRef} className={`cursor-ring ${hovering ? 'hovering' : ''}`} />
      <div ref={dotRef}  className="cursor-dot" />
    </>
  );
};

/* ─── Cursor Sparkles ─────────────────────────────────────────────────────── */
const CursorSparkles = () => {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  useEffect(() => {
    let lastSpawn = 0;
    const h = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawn > 50) {
        setSparkles(p => [...p.slice(-15), { id: now, x: e.clientX, y: e.clientY }]);
        lastSpawn = now;
      }
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <AnimatePresence>
        {sparkles.map(s => (
          <motion.div key={s.id}
            initial={{ opacity: 0.9, scale: 0, x: s.x - 4, y: s.y - 4 }}
            animate={{ opacity: 0, scale: Math.random() * 1.5 + 0.5,
              x: s.x - 4 + (Math.random() - 0.5) * 40,
              y: s.y - 4 + (Math.random() + 0.3) * 40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 + Math.random() * 0.3, ease: 'easeOut' }}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]"
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ─── Scroll Progress Bar ─────────────────────────────────────────────────── */
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <motion.div className="scroll-progress" style={{ scaleX, width: '100%' }} />;
};

/* ─── Back to Top ─────────────────────────────────────────────────────────── */
const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top">
          <ChevronUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* ─── Typewriter ──────────────────────────────────────────────────────────── */
const ROLES = ['Android Developer', 'Kotlin Expert', 'Jetpack Compose Specialist', 'Flutter Engineer', 'Clean Architecture Advocate'];
const Typewriter = () => {
  const [idx, setIdx]     = useState(0);
  const [text, setText]   = useState('');
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const full = ROLES[idx];
    let timer: ReturnType<typeof setTimeout>;
    if (!deleting && text.length < full.length) {
      timer = setTimeout(() => setText(full.slice(0, text.length + 1)), 60);
    } else if (!deleting && text.length === full.length) {
      timer = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && text.length > 0) {
      timer = setTimeout(() => setText(text.slice(0, -1)), 35);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setIdx(i => (i + 1) % ROLES.length);
    }
    return () => clearTimeout(timer);
  }, [text, deleting, idx]);
  return (
    <span className="neon-text">
      {text}<span className="cursor-blink">|</span>
    </span>
  );
};

/* ─── Animated Stat ───────────────────────────────────────────────────────── */
const AnimatedStat = ({ value, label, color }: { value: string; label: string; color: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const num = parseInt(value);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = Math.ceil(num / 40);
        const timer = setInterval(() => {
          start += step;
          if (start >= num) { setCount(num); clearInterval(timer); }
          else setCount(start);
        }, 40);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [num]);
  return (
    <motion.div ref={ref} whileHover={{ scale: 1.05 }} className="glass-card corner-accent p-6 text-center">
      <div className="text-4xl font-black mb-2" style={{ color }}>{count}{value.includes('+') ? '+' : ''}</div>
      <div className="text-xs font-bold tracking-widest uppercase text-text-secondary">{label}</div>
    </motion.div>
  );
};

/* ─── Skill Bar ───────────────────────────────────────────────────────────── */
const SkillBar = ({ skill, level }: { skill: string; level: number }) => {
  const [filled, setFilled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setFilled(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-bold text-white/80">{skill}</span>
        <span className="text-[#00e5ff] font-bold text-xs">{level}%</span>
      </div>
      <div className="skill-bar-track">
        <div className="skill-bar-fill" style={{ width: filled ? `${level}%` : '0%' }} />
      </div>
    </div>
  );
};

/* ─── Tech Ticker ─────────────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  'Kotlin','Jetpack Compose','Flutter','KMM','Android SDK','Java','Dart',
  'Clean Architecture','MVVM','Firebase','Room DB','REST APIs','Git',
  'Android Profiler','LeakCanary','Figma','Material 3','Coroutines','Dagger Hilt',
];
const Ticker = () => {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden py-6 border-y border-white/5 relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-text-secondary">
            <span className="text-[#00e5ff] text-lg">✦</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── Data ────────────────────────────────────────────────────────────────── */
const projects = [
  {
    title: 'CalFit & ML Kit Maps',
    description: 'Fitness tracking app with interactive map integration using Google ML Kit. Features offline caching via Room Database and advanced sensor-based workout metrics.',
    tags: ['Kotlin', 'Room DB', 'Google ML Kit'],
    icon: <Code2 className="w-6 h-6" />, color: '#ff8c00',
    url: 'https://github.com/Ravindra0310/Calfit',
  },
  {
    title: 'LinkedIn Clone',
    description: 'Full-stack professional networking platform clone with real-time database sync, secure Firebase authentication, and MVVM architecture.',
    tags: ['Kotlin', 'Firebase', 'MVVM'],
    icon: <Linkedin className="w-6 h-6" />, color: '#0077b5',
    url: 'https://github.com/Ravindra0310/LinkedIn_Clone',
  },
  {
    title: 'Edit Me',
    description: 'Published Photo Editor App on Google Play Store. Advanced image manipulation with custom filters, pixel-level editing and real-time preview.',
    tags: ['Java', 'Canvas API', 'Play Store'],
    icon: <Palette className="w-6 h-6" />, color: '#a3cfbb',
    url: 'https://github.com/Ravindra0310/Edit-Me',
  },
  {
    title: 'PotLuck',
    description: 'Community food-sharing platform connecting people through culinary events, shared recipes, and real-time location-based discovery.',
    tags: ['Android SDK', 'Maps API', 'Firebase'],
    icon: <Code2 className="w-6 h-6" />, color: '#ffc107',
    url: 'https://github.com/Ravindra0310/PotLuck',
  },
  {
    title: 'CNN News App Clone',
    description: 'Full-stack news application with real-time feed, Spring Boot backend, MySQL database, offline reading mode and background data sync.',
    tags: ['Kotlin', 'Spring Boot', 'MySQL'],
    icon: <Terminal className="w-6 h-6" />, color: '#cc0000',
    url: 'https://github.com/Ravindra0310',
  },
];

const experience = [
  {
    role: 'Android Developer', company: 'Neosoft Technologies',
    client: 'Network18 | Moneycontrol App', period: 'May 2025 – Present',
    location: 'Mumbai, India', color: '#00e5ff',
    bullets: [
      'Spearheading UI modernization by migrating legacy XML layouts to Jetpack Compose and integrating Flutter modules for new business verticals.',
      'Implementing Kotlin Multiplatform (KMM) to unify business logic across platforms, significantly reducing code redundancy and testing overhead.',
      'Optimizing WebViews and hybrid bridges to ensure seamless, native-like rendering of dynamic content and advertisements.',
    ],
  },
  {
    role: 'Android Developer', company: 'Robosoft Technologies',
    client: 'Network18 | Moneycontrol App', period: 'Aug 2023 – May 2025',
    location: 'Mumbai, India', color: '#7c3aed',
    bullets: [
      'Orchestrated application release cycles on the Google Play Store, managing version control and release notes for millions of users.',
      'Deployed shared business logic using KMM, streamlining the development process across Android and iOS teams.',
      'Enhanced app stability by optimizing hybrid view performance and fixing critical rendering issues in high-traffic sections.',
    ],
  },
  {
    role: 'Mobile Application Developer', company: 'Enrich Beauty',
    client: '', period: 'Nov 2022 – Aug 2023',
    location: 'Mumbai, India', color: '#10b981',
    bullets: [
      'Architected a scalable, modular codebase using Clean Architecture to ensure long-term maintainability and testability.',
      'Integrated Flutter modules into the existing native environment (Add-to-App), enabling rapid feature deployment without compromising performance.',
      'Reduced load times for critical HR modules (Attendance, Payroll) by optimizing background services and API synchronization logic.',
    ],
  },
  {
    role: 'Android Developer', company: 'Sugar Cosmetics',
    client: '', period: 'July 2021 – Nov 2022',
    location: 'Mumbai, India', color: '#f59e0b',
    bullets: [
      'Engineered the consumer-facing app using Kotlin and MVVM architecture, delivering clean and scalable code.',
      'Built end-to-end payment processing logic and order lifecycle management systems with high data accuracy.',
      'Boosted app responsiveness on low-end devices by analyzing bottlenecks with Android Profiler and eliminating memory leaks with LeakCanary.',
    ],
  },
];

const skills = [
  { skill: 'Kotlin', level: 95 },
  { skill: 'Jetpack Compose', level: 90 },
  { skill: 'Android SDK', level: 92 },
  { skill: 'Flutter / Dart', level: 78 },
  { skill: 'KMM', level: 75 },
  { skill: 'Firebase', level: 85 },
  { skill: 'Clean Architecture / MVVM', level: 90 },
  { skill: 'Java', level: 80 },
];

const skillCategories = [
  { title: 'Languages',       icon: <Terminal />, skills: ['Kotlin', 'Java', 'Dart'] },
  { title: 'Frameworks',      icon: <Code2 />,    skills: ['Android SDK', 'Flutter', 'Jetpack Compose', 'KMM'] },
  { title: 'Architecture',    icon: <Cpu />,      skills: ['Clean Architecture', 'MVVM', 'Multimodule Development'] },
  { title: 'Database & Tools',icon: <Database />, skills: ['Firebase', 'Room DB', 'MySQL', 'REST APIs', 'Git', 'Android Profiler', 'LeakCanary'] },
];

const achievements = [
  { icon: <Star className="w-6 h-6" />, title: 'Published Play Store App', color: '#f59e0b',
    description: 'Developed and published a fully functional Photo Editor App on the Google Play Store.' },
  { icon: <Trophy className="w-6 h-6" />, title: 'Hackathon Winner', color: '#00e5ff',
    description: 'Secured 3rd Prize in a highly competitive 48-hour coding hackathon.' },
  { icon: <Star className="w-6 h-6" />, title: 'Shutterstock Shortlisted', color: '#7c3aed',
    description: 'Shortlisted by Shutterstock for designing innovative mobile app concepts.' },
];

/* ─── App ─────────────────────────────────────────────────────────────────── */
const App = () => {
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [copied, setCopied]           = useState(false);
  const [toast, setToast]             = useState('');
  const [sending, setSending]         = useState(false);
  const [sent, setSent]               = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const h = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  useEffect(() => {
    const h = () => {
      const sections = ['home','about','projects','experience','skills','contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) { const r = el.getBoundingClientRect(); if (r.top <= 100 && r.bottom >= 100) { setActiveSection(id); break; } }
      }
    };
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const bgTemplate = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(0, 229, 255, 0.07), transparent 80%)`;

  const copyEmail = () => {
    navigator.clipboard.writeText('ravi.solanki146783@gmail.com');
    setCopied(true);
    setToast('📋 Email copied to clipboard!');
    setTimeout(() => { setCopied(false); setToast(''); }, 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setSending(true);
    try {
      // Replace with your EmailJS credentials from emailjs.com
      await emailjs.sendForm(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        formRef.current,
        'YOUR_PUBLIC_KEY'
      );
      setSent(true);
      setToast('✅ Message sent successfully!');
      formRef.current.reset();
    } catch {
      setToast('❌ Failed to send. Try emailing directly.');
    } finally {
      setSending(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const navItems = [
    { id: 'home',       label: 'HOME',       icon: <Terminal size={18} /> },
    { id: 'about',      label: 'ABOUT',      icon: <Code2 size={18} /> },
    { id: 'projects',   label: 'PROJECTS',   icon: <ExternalLink size={18} /> },
    { id: 'experience', label: 'EXPERIENCE', icon: <Briefcase size={18} /> },
    { id: 'skills',     label: 'SKILLS',     icon: <Cpu size={18} /> },
    { id: 'play',       label: 'PLAY',       icon: <Gamepad2 size={18} /> },
    { id: 'contact',    label: 'CONTACT',    icon: <Mail size={18} /> },
  ];

  return (
    <div className="app">
      {/* ── Utility UI ── */}
      <CustomCursor />
      <CursorSparkles />
      <ScrollProgressBar />
      <BackToTop />

      {/* ── Background layers ── */}
      <div className="noise-overlay" />
      <div className="scanlines" />
      <div className="grid-background" />
      <motion.div className="glow-overlay" style={{ background: bgTemplate }} />
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="toast">{toast}</motion.div>
        )}
      </AnimatePresence>

      {/* ── Navigation ── */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${activeSection !== 'home' ? 'bg-[#0a0a0aee] backdrop-blur-md border-b border-white/5' : ''}`}>
        <div className="container py-4 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <div className="bg-accent-color p-1.5 rounded-md"><Code2 className="text-black w-5 h-5" /></div>
            <span className="font-black text-xl tracking-tighter">RAVINDRA.DEV</span>
          </motion.div>
          <div className="hidden md:flex gap-6">
            {navItems.map(item => (
              <a key={item.id} href={`#${item.id}`}
                className={`text-xs font-bold tracking-widest transition-colors flex items-center gap-1.5 ${activeSection === item.id ? 'text-[#00e5ff]' : 'text-text-secondary hover:text-white'}`}>
                {activeSection === item.id && <motion.span layoutId="active-dot" className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full" />}
                {item.label}
              </a>
            ))}
          </div>
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-24 px-6 md:hidden">
            <div className="flex flex-col gap-6">
              {navItems.map(item => (
                <a key={item.id} href={`#${item.id}`} onClick={() => setIsMenuOpen(false)}
                  className={`text-2xl font-black tracking-tighter ${activeSection === item.id ? 'text-[#00e5ff]' : 'text-text-secondary'}`}>
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* ── Hero ── */}
        <section id="home" className="min-h-screen flex items-center pt-20 relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 section-number hidden xl:block" aria-hidden>01</div>
          <div className="absolute right-8 top-32 hidden lg:grid grid-cols-6 gap-3 opacity-20" aria-hidden>
            {Array.from({ length: 42 }).map((_, i) => (
              <motion.div key={i} className="w-1 h-1 rounded-full bg-[#00e5ff]"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2 + (i % 5) * 0.3, repeat: Infinity, delay: (i % 7) * 0.15 }} />
            ))}
          </div>
          <div className="container">
            <div className="max-w-4xl">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-[#111] border border-white/10 px-4 py-2 rounded-full mb-8">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-xs font-bold tracking-widest text-text-secondary">
                  🟢 CURRENTLY AT NEOSOFT TECHNOLOGIES
                </span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.8 }} className="text-6xl md:text-8xl font-black leading-[0.9] mb-6">
                Hi, I'm <span className="text-white">Ravindra Solanki.</span>
              </motion.h1>

              <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }} className="text-3xl md:text-5xl font-black leading-[1.2] mb-8 min-h-[4rem]">
                <Typewriter />
              </motion.h2>

              <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }} className="text-xl text-text-secondary mb-4 leading-relaxed max-w-2xl">
                Result-oriented engineer specializing in <span className="text-[#e2e8f0] font-bold">Kotlin</span>, <span className="text-[#e2e8f0] font-bold">Jetpack Compose</span>, and <span className="text-[#e2e8f0] font-bold">Flutter</span>. Building high-performance mobile experiences for millions of users.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-wrap gap-4 text-sm text-text-secondary mb-10">
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#00e5ff]" /> Mumbai, India</span>
                <span className="flex items-center gap-1.5"><Phone size={14} className="text-[#00e5ff]" /> +91-7021371629</span>
                <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-[#00e5ff]" /> 5+ Years Experience</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-col sm:flex-row gap-4">
                <a href="#projects" className="bg-[#00e5ff] text-black px-8 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-[#00c2d9] transition-all transform hover:scale-105">
                  View Projects <ChevronRight size={20} />
                </a>
                <a href="/Ravindra_android_dev.pdf" download="Ravindra_CV.pdf"
                  className="border border-white/10 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                  Download CV <Download size={20} />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        <Ticker />

        {/* ── About ── */}
        <section id="about" className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 section-number hidden xl:block" aria-hidden>02</div>
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">ABOUT <span className="neon-text">ME.</span></h2>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card p-8">
                <p className="text-lg text-text-secondary leading-relaxed mb-6">
                  Result-oriented Android Developer specializing in building <span className="text-white font-bold">high-performance native and cross-platform mobile applications</span>. Expert in modernizing legacy codebases using Jetpack Compose and scaling architecture with Flutter and Kotlin Multiplatform (KMM).
                </p>
                <p className="text-lg text-text-secondary leading-relaxed">
                  Proven ability to optimize app performance, minimize code redundancy, and deliver robust, <span className="text-white font-bold">user-centric solutions</span> in Agile environments. I've shipped products used by <span className="text-[#00e5ff] font-bold">millions of users</span>.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Years Experience', value: '5+', color: '#00e5ff' },
                  { label: 'Apps Shipped',      value: '5+', color: '#7c3aed' },
                  { label: 'Companies Worked',  value: '4',  color: '#10b981' },
                  { label: 'Play Store Apps',   value: '1+', color: '#f59e0b' },
                ].map((s, i) => <AnimatedStat key={i} {...s} />)}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Projects ── */}
        <section id="projects" className="relative">
          <div className="absolute right-0 top-24 section-number hidden xl:block" aria-hidden>03</div>
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">SELECTED <br /><span className="neon-text">WORKS.</span></h2>
              <p className="max-w-xl text-text-secondary">A curated gallery of mobile ecosystems and technical experiments.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {projects.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="glass-card group overflow-hidden">
                  <div className="p-8 h-full flex flex-col">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500"
                      style={{ backgroundColor: `${p.color}20`, border: `1px solid ${p.color}40` }}>
                      <div style={{ color: p.color }}>{p.icon}</div>
                    </div>
                    <h3 className="text-2xl font-black mb-3">{p.title}</h3>
                    <p className="text-text-secondary mb-6 flex-grow text-sm leading-relaxed">{p.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {p.tags.map(t => <span key={t} className="text-[10px] font-black tracking-widest uppercase px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-text-secondary">{t}</span>)}
                    </div>
                    <a href={p.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-black tracking-widest uppercase hover:text-[#00e5ff] transition-colors">
                      VIEW SOURCE <ExternalLink size={14} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <hr className="glow-divider" />

        {/* ── Experience ── */}
        <section id="experience" className="relative">
          <div className="absolute left-0 top-24 section-number hidden xl:block" aria-hidden>04</div>
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">WORK <span className="neon-text">EXPERIENCE.</span></h2>
              <p className="max-w-xl text-text-secondary">5+ years building production-grade Android apps serving millions of users.</p>
            </motion.div>
            <div className="relative">
              <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-white/10" />
              <div className="space-y-8">
                {experience.map((exp, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }} className="relative md:pl-24">
                    <div className="hidden md:flex absolute left-5 top-6 w-6 h-6 rounded-full items-center justify-center border-2"
                      style={{ backgroundColor: `${exp.color}20`, borderColor: exp.color }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: exp.color }} />
                    </div>
                    <div className="glass-card p-8">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                        <div>
                          <h3 className="text-xl font-black">{exp.role}</h3>
                          <div className="font-bold" style={{ color: exp.color }}>{exp.company}</div>
                          {exp.client && <div className="text-xs text-text-secondary font-bold tracking-widest mt-1">{exp.client}</div>}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-white/80 bg-white/5 px-3 py-1 rounded-full">{exp.period}</div>
                          <div className="text-xs text-text-secondary mt-1 flex items-center justify-end gap-1"><MapPin size={11} /> {exp.location}</div>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: exp.color }} />{b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Ticker />

        {/* ── Skills ── */}
        <section id="skills" className="relative">
          <div className="absolute right-0 top-24 section-number hidden xl:block" aria-hidden>05</div>
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                Tech Stack & <span className="neon-text">Toolkit</span>
              </h2>
              <p className="max-w-xl text-text-secondary">Engineering fluid digital experiences through a curated selection of modern technologies.</p>
            </motion.div>

            {/* Skill bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2 mb-16">
              {skills.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                  <SkillBar skill={s.skill} level={s.level} />
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {skillCategories.map((cat, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }} className="glass-card p-6">
                  <div className="text-[#00e5ff] mb-6">{cat.icon}</div>
                  <h4 className="text-lg font-black uppercase tracking-widest mb-6">{cat.title}</h4>
                  <ul className="space-y-3">
                    {cat.skills.map(s => (
                      <li key={s} className="flex items-center gap-2 text-sm text-text-secondary">
                        <span className="w-1 h-1 bg-[#00e5ff] rounded-full" />{s}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8">
              <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-text-secondary">Computer Science Fundamentals</h4>
              <div className="flex flex-wrap gap-3">
                {['Data Structures & Algorithms', 'Object-Oriented Programming', 'System Design', 'Design Patterns', 'Agile / Scrum'].map(s => (
                  <span key={s} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-white/70 hover:border-[#00e5ff]/50 hover:text-white transition-all">{s}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <hr className="glow-divider" />

        {/* ── 2048 Game ── */}
        <section id="play" className="relative">
          <div className="absolute right-0 top-24 section-number hidden xl:block" aria-hidden>06</div>
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                TAKE A <span className="neon-text">BREAK.</span>
              </h2>
              <p className="max-w-xl text-text-secondary">
                Merge the tech stack from HTML all the way up to <span className="text-[#00e5ff] font-bold">KMM 🚀</span>. Arrows or swipe to play.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Game2048 />
            </motion.div>
          </div>
        </section>

        <hr className="glow-divider" />

        {/* ── Achievements ── */}
        <section id="achievements" className="relative">
          <div className="absolute left-0 top-24 section-number hidden xl:block" aria-hidden>07</div>
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">ACHIEVEMENTS <span className="neon-text">&amp; HIGHLIGHTS.</span></h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {achievements.map((a, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }} whileHover={{ scale: 1.04 }} className="glass-card p-8 text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 border"
                    style={{ backgroundColor: `${a.color}15`, borderColor: `${a.color}40`, color: a.color }}>{a.icon}</div>
                  <h3 className="text-xl font-black mb-3">{a.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{a.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] shrink-0">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <div className="text-xs font-black tracking-widest uppercase text-text-secondary mb-1">Education</div>
                  <h3 className="text-2xl font-black mb-1">Computer Technology</h3>
                  <div className="text-[#00e5ff] font-bold">Bhausaheb Vartak College</div>
                  <div className="flex items-center gap-1 text-sm text-text-secondary mt-1"><MapPin size={13} /> Mumbai, India</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <hr className="glow-divider" />

        {/* ── Contact ── */}
        <section id="contact" className="pb-32 relative">
          <div className="absolute right-0 top-24 section-number hidden xl:block" aria-hidden>07</div>
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-20">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:w-1/2">
                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                  LET'S <br /><span className="neon-text">CONNECT</span>
                </h2>
                <p className="text-xl text-text-secondary mb-12">
                  Currently open to high-impact engineering roles and architectural consulting. If you have a vision that needs technical precision, reach out.
                </p>

                {/* Copy email button */}
                <button onClick={copyEmail}
                  className="mb-8 flex items-center gap-3 glass-card px-6 py-4 rounded-xl hover:border-[#00e5ff] transition-all group w-full">
                  <Mail size={18} className="text-[#00e5ff]" />
                  <span className="flex-1 text-sm font-bold text-left">ravi.solanki146783@gmail.com</span>
                  <span className="text-text-secondary group-hover:text-[#00e5ff] transition-colors">
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'GitHub',   handle: 'Ravindra0310',     icon: <Github />,   url: 'https://github.com/Ravindra0310' },
                    { label: 'LinkedIn', handle: 'ravindra0310',     icon: <Linkedin />, url: 'https://www.linkedin.com/in/ravindra0310/' },
                    { label: 'Twitter',  handle: '@ravirdx',         icon: <Twitter />,  url: 'https://twitter.com/ravirdx' },
                    { label: 'Email',    handle: 'ravi.solanki146783',icon: <Mail />,    url: 'mailto:ravi.solanki146783@gmail.com' },
                  ].map((s, idx) => (
                    <a key={idx} href={s.url} target="_blank" rel="noopener noreferrer"
                      className="glass-card p-6 group hover:border-[#00e5ff] transition-all">
                      <div className="text-text-secondary group-hover:text-[#00e5ff] mb-4 transition-colors">{s.icon}</div>
                      <div className="text-xs font-black tracking-widest uppercase mb-1">{s.label}</div>
                      <div className="text-sm font-bold truncate">{s.handle}</div>
                    </a>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:w-1/2">
                <div className="glass-card p-10">
                  <h3 className="text-2xl font-black mb-2 uppercase tracking-widest">Get in Touch</h3>
                  <p className="text-text-secondary text-sm mb-8">Fill in the form — I'll reply within 24 hours.</p>
                  {sent ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16">
                      <div className="text-[#00e5ff] text-6xl mb-4">✓</div>
                      <h4 className="text-2xl font-black mb-2">Message Sent!</h4>
                      <p className="text-text-secondary">I'll get back to you soon.</p>
                    </motion.div>
                  ) : (
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="text-xs font-black tracking-widest uppercase text-text-secondary mb-2 block">Name</label>
                        <input name="user_name" type="text" required className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-[#00e5ff] transition-colors outline-none" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="text-xs font-black tracking-widest uppercase text-text-secondary mb-2 block">Email</label>
                        <input name="user_email" type="email" required className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-[#00e5ff] transition-colors outline-none" placeholder="john@example.com" />
                      </div>
                      <div>
                        <label className="text-xs font-black tracking-widest uppercase text-text-secondary mb-2 block">Message</label>
                        <textarea name="message" rows={4} required className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-[#00e5ff] transition-colors outline-none resize-none" placeholder="How can I help you?" />
                      </div>
                      <button type="submit" disabled={sending}
                        className="w-full bg-[#00e5ff] text-black font-black py-4 rounded-lg hover:bg-[#00c2d9] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-60 disabled:scale-100">
                        {sending ? 'Sending...' : <><Send size={18} /> Transmit Message</>}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="py-20 border-t border-white/5">
        <div className="container flex flex-col items-center">
          <div className="flex gap-8 mb-12">
            <a href="https://github.com/Ravindra0310" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white transition-colors">Github</a>
            <a href="https://www.linkedin.com/in/ravindra0310/" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white transition-colors">LinkedIn</a>
            <a href="https://twitter.com/ravirdx" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white transition-colors">Twitter</a>
            <a href="mailto:ravi.solanki146783@gmail.com" className="text-text-secondary hover:text-white transition-colors">Email</a>
          </div>
          <p className="text-xs font-black tracking-[0.2em] text-text-secondary uppercase">
            © 2025 RAVINDRA SOLANKI — ENGINEERED FOR MOTION
          </p>
        </div>
      </footer>

      {/* ── Mobile Bottom Nav ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-2">
          {navItems.map(item => (
            <a key={item.id} href={`#${item.id}`}
              className={`p-3 rounded-xl transition-all ${activeSection === item.id ? 'bg-[#00e5ff]/20 text-[#00e5ff]' : 'text-text-secondary'}`}>
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
