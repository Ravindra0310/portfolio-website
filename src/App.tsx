import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, ExternalLink, Code2, Cpu, Database,
  Palette, Menu, X, ChevronRight, Download, Terminal, Briefcase, GraduationCap,
  Trophy, Star, MapPin, Phone
} from 'lucide-react';

/* ─── Cursor Sparkles ─────────────────────────────────────────────────────── */
const CursorSparkles = () => {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  useEffect(() => {
    let lastSpawn = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawn > 40) {
        setSparkles(prev => [...prev.slice(-20), { id: now, x: e.clientX, y: e.clientY }]);
        lastSpawn = now;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <AnimatePresence>
        {sparkles.map(s => (
          <motion.div
            key={s.id}
            initial={{ opacity: 1, scale: 0, x: s.x - 4, y: s.y - 4 }}
            animate={{
              opacity: 0,
              scale: Math.random() * 2 + 1,
              x: s.x - 4 + (Math.random() - 0.5) * 50,
              y: s.y - 4 + (Math.random() + 0.5) * 50,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 + Math.random() * 0.4, ease: 'easeOut' }}
            className="absolute w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]"
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ─── Data ────────────────────────────────────────────────────────────────── */
const projects = [
  {
    title: 'CalFit & ML Kit Maps',
    description: 'Fitness tracking app with interactive map integration using Google ML Kit. Features offline caching via Room Database and advanced sensor-based workout metrics.',
    tags: ['Kotlin', 'Room DB', 'Google ML Kit'],
    icon: <Code2 className="w-6 h-6" />,
    color: '#ff8c00',
    url: 'https://github.com/Ravindra0310/Calfit',
  },
  {
    title: 'LinkedIn Clone',
    description: 'Full-stack professional networking platform clone with real-time database sync, secure Firebase authentication, and MVVM architecture.',
    tags: ['Kotlin', 'Firebase', 'MVVM'],
    icon: <Linkedin className="w-6 h-6" />,
    color: '#0077b5',
    url: 'https://github.com/Ravindra0310/LinkedIn_Clone',
  },
  {
    title: 'Edit Me',
    description: 'Published Photo Editor App on Google Play Store. Advanced image manipulation with custom filters, pixel-level editing and real-time preview.',
    tags: ['Java', 'Canvas API', 'Play Store'],
    icon: <Palette className="w-6 h-6" />,
    color: '#a3cfbb',
    url: 'https://github.com/Ravindra0310/Edit-Me',
  },
  {
    title: 'PotLuck',
    description: 'Community food-sharing platform connecting people through culinary events, shared recipes, and real-time location-based discovery.',
    tags: ['Android SDK', 'Maps API', 'Firebase'],
    icon: <Code2 className="w-6 h-6" />,
    color: '#ffc107',
    url: 'https://github.com/Ravindra0310/PotLuck',
  },
  {
    title: 'CNN News App Clone',
    description: 'Full-stack news application with real-time feed, Spring Boot backend, MySQL database, offline reading mode and background data sync.',
    tags: ['Kotlin', 'Spring Boot', 'MySQL'],
    icon: <Terminal className="w-6 h-6" />,
    color: '#cc0000',
    url: 'https://github.com/Ravindra0310',
  },
];

const experience = [
  {
    role: 'Android Developer',
    company: 'Neosoft Technologies',
    client: 'Network18 | Moneycontrol App',
    period: 'May 2025 – Present',
    location: 'Mumbai, India',
    bullets: [
      'Spearheading UI modernization by migrating legacy XML layouts to Jetpack Compose and integrating Flutter modules for new business verticals.',
      'Implementing Kotlin Multiplatform (KMM) to unify business logic across platforms, significantly reducing code redundancy and testing overhead.',
      'Optimizing WebViews and hybrid bridges to ensure seamless, native-like rendering of dynamic content and advertisements.',
    ],
    color: '#00e5ff',
  },
  {
    role: 'Android Developer',
    company: 'Robosoft Technologies',
    client: 'Network18 | Moneycontrol App',
    period: 'Aug 2023 – May 2025',
    location: 'Mumbai, India',
    bullets: [
      'Orchestrated application release cycles on the Google Play Store, managing version control and release notes for millions of users.',
      'Deployed shared business logic using KMM, streamlining the development process across Android and iOS teams.',
      'Enhanced app stability by optimizing hybrid view performance and fixing critical rendering issues in high-traffic sections.',
    ],
    color: '#7c3aed',
  },
  {
    role: 'Mobile Application Developer',
    company: 'Enrich Beauty',
    client: '',
    period: 'Nov 2022 – Aug 2023',
    location: 'Mumbai, India',
    bullets: [
      'Architected a scalable, modular codebase using Clean Architecture to ensure long-term maintainability and testability.',
      'Integrated Flutter modules into the existing native environment (Add-to-App), enabling rapid feature deployment without compromising performance.',
      'Reduced load times for critical HR modules (Attendance, Payroll) by optimizing background services and API synchronization logic.',
    ],
    color: '#10b981',
  },
  {
    role: 'Android Developer',
    company: 'Sugar Cosmetics',
    client: '',
    period: 'July 2021 – Nov 2022',
    location: 'Mumbai, India',
    bullets: [
      'Engineered the consumer-facing app using Kotlin and MVVM architecture, delivering clean and scalable code.',
      'Built end-to-end payment processing logic and order lifecycle management systems with high data accuracy.',
      'Boosted app responsiveness on low-end devices by analyzing bottlenecks with Android Profiler and eliminating memory leaks with LeakCanary.',
    ],
    color: '#f59e0b',
  },
];

const skillCategories = [
  {
    title: 'Languages',
    icon: <Terminal />,
    skills: ['Kotlin', 'Java', 'Dart'],
  },
  {
    title: 'Frameworks',
    icon: <Code2 />,
    skills: ['Android SDK', 'Flutter', 'Jetpack Compose', 'KMM'],
  },
  {
    title: 'Architecture',
    icon: <Cpu />,
    skills: ['Clean Architecture', 'MVVM', 'Multimodule Development'],
  },
  {
    title: 'Database & Tools',
    icon: <Database />,
    skills: ['Firebase', 'Room Database', 'MySQL', 'REST APIs', 'Git', 'Android Profiler', 'LeakCanary'],
  },
];

const achievements = [
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Published Play Store App',
    description: 'Developed and published a fully functional Photo Editor App on the Google Play Store.',
    color: '#f59e0b',
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Hackathon Winner',
    description: 'Secured 3rd Prize in a highly competitive 48-hour coding hackathon.',
    color: '#00e5ff',
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Shutterstock Shortlisted',
    description: 'Shortlisted by Shutterstock for designing innovative mobile app concepts.',
    color: '#7c3aed',
  },
];

/* ─── App ─────────────────────────────────────────────────────────────────── */
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'experience', 'skills', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) { setActiveSection(section); break; }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home',       label: 'HOME',       icon: <Terminal size={20} /> },
    { id: 'about',      label: 'ABOUT',      icon: <Code2 size={20} /> },
    { id: 'projects',   label: 'PROJECTS',   icon: <ExternalLink size={20} /> },
    { id: 'experience', label: 'EXPERIENCE', icon: <Briefcase size={20} /> },
    { id: 'skills',     label: 'SKILLS',     icon: <Cpu size={20} /> },
    { id: 'contact',    label: 'CONTACT',    icon: <Mail size={20} /> },
  ];

  const bgTemplate = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(0, 229, 255, 0.08), transparent 80%)`;

  return (
    <div className="app">
      <CursorSparkles />
      <div className="grid-background" />
      <motion.div className="glow-overlay" style={{ background: bgTemplate }} />

      {/* ── Navigation ── */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${activeSection !== 'home' ? 'bg-[#0a0a0aee] backdrop-blur-md border-b border-white/5' : ''}`}>
        <div className="container py-4 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <div className="bg-accent-color p-1.5 rounded-md">
              <Code2 className="text-black w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tighter">RAVINDRA.DEV</span>
          </motion.div>

          <div className="hidden md:flex gap-6">
            {navItems.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`text-xs font-bold tracking-widest transition-colors flex items-center gap-1.5 ${activeSection === item.id ? 'text-[#00e5ff]' : 'text-text-secondary hover:text-white'}`}
              >
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

      {/* Mobile nav overlay */}
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
        <section id="home" className="min-h-screen flex items-center pt-20">
          <div className="container">
            <div className="max-w-4xl">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-[#111] border border-white/10 px-4 py-2 rounded-full mb-8">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-xs font-bold tracking-widest text-text-secondary">AVAILABLE FOR HIGH-IMPACT PROJECTS</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.8 }} className="text-6xl md:text-8xl font-black leading-[0.9] mb-6">
                Hi, I'm <span className="text-white">Ravindra Solanki.</span>
              </motion.h1>

              <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl font-black neon-text leading-[1.1] mb-8">
                Android Developer. Jetpack Compose Specialist.
              </motion.h2>

              <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }} className="text-xl text-text-secondary mb-4 leading-relaxed max-w-2xl">
                Result-oriented engineer specializing in <span className="text-[#e2e8f0] font-bold">Kotlin</span>, <span className="text-[#e2e8f0] font-bold">Jetpack Compose</span>, and <span className="text-[#e2e8f0] font-bold">Flutter</span>.
                Building high-performance mobile experiences for millions of users.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-wrap gap-3 text-sm text-text-secondary mb-10">
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

        {/* ── About ── */}
        <section id="about">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                ABOUT <span className="neon-text">ME.</span>
              </h2>
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
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Years Experience', value: '5+', color: '#00e5ff' },
                  { label: 'Apps Shipped', value: '5+', color: '#7c3aed' },
                  { label: 'Companies Worked', value: '4', color: '#10b981' },
                  { label: 'Play Store Apps', value: '1+', color: '#f59e0b' },
                ].map((stat, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.05 }} className="glass-card p-6 text-center">
                    <div className="text-4xl font-black mb-2" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-xs font-bold tracking-widest uppercase text-text-secondary">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Projects ── */}
        <section id="projects" className="relative">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                SELECTED <br /><span className="neon-text">WORKS.</span>
              </h2>
              <p className="max-w-xl text-text-secondary">
                A curated gallery of mobile ecosystems and technical experiments, engineered with Kotlin and Java for high-performance Android experiences.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }} whileHover={{ y: -6 }} className="glass-card group overflow-hidden">
                  <div className="p-8 h-full flex flex-col">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500"
                      style={{ backgroundColor: `${project.color}20`, border: `1px solid ${project.color}40` }}>
                      <div style={{ color: project.color }}>{project.icon}</div>
                    </div>
                    <h3 className="text-2xl font-black mb-3">{project.title}</h3>
                    <p className="text-text-secondary mb-6 flex-grow text-sm leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-black tracking-widest uppercase px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-text-secondary">{tag}</span>
                      ))}
                    </div>
                    <a href={project.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-black tracking-widest uppercase hover:text-[#00e5ff] transition-colors">
                      VIEW SOURCE <ExternalLink size={14} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Experience ── */}
        <section id="experience">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                WORK <span className="neon-text">EXPERIENCE.</span>
              </h2>
              <p className="max-w-xl text-text-secondary">5+ years building production-grade Android apps serving millions of users.</p>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-white/10" />
              <div className="space-y-8">
                {experience.map((exp, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }} className="relative md:pl-24">
                    {/* Dot */}
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
                          <div className="text-xs text-text-secondary mt-1 flex items-center justify-end gap-1">
                            <MapPin size={11} /> {exp.location}
                          </div>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: exp.color }} />
                            {b}
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

        {/* ── Skills ── */}
        <section id="skills">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                Tech Stack & <span className="neon-text">Toolkit</span>
              </h2>
              <p className="max-w-xl text-text-secondary">
                Engineering fluid digital experiences through a curated selection of modern technologies and architectural patterns.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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

            {/* CS Fundamentals */}
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

        {/* ── Achievements ── */}
        <section id="achievements">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                ACHIEVEMENTS <span className="neon-text">&amp; HIGHLIGHTS.</span>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {achievements.map((a, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }} whileHover={{ scale: 1.04 }} className="glass-card p-8 text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 border"
                    style={{ backgroundColor: `${a.color}15`, borderColor: `${a.color}40`, color: a.color }}>
                    {a.icon}
                  </div>
                  <h3 className="text-xl font-black mb-3">{a.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{a.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Education */}
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

        {/* ── Contact ── */}
        <section id="contact" className="pb-32">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-20">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:w-1/2">
                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                  LET'S <br /><span className="neon-text">CONNECT</span>
                </h2>
                <p className="text-xl text-text-secondary mb-12">
                  Currently open to high-impact engineering roles and architectural consulting. If you have a vision that needs technical precision, reach out.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'GitHub', handle: 'Ravindra0310', icon: <Github />, url: 'https://github.com/Ravindra0310' },
                    { label: 'LinkedIn', handle: 'ravindra0310', icon: <Linkedin />, url: 'https://www.linkedin.com/in/ravindra0310/' },
                    { label: 'Twitter', handle: '@ravirdx', icon: <Twitter />, url: 'https://twitter.com/ravirdx' },
                    { label: 'Email', handle: 'ravi.solanki146783', icon: <Mail />, url: 'mailto:ravi.solanki146783@gmail.com' },
                  ].map((social, idx) => (
                    <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer"
                      className="glass-card p-6 group hover:border-[#00e5ff] transition-all">
                      <div className="text-text-secondary group-hover:text-[#00e5ff] mb-4 transition-colors">{social.icon}</div>
                      <div className="text-xs font-black tracking-widest uppercase mb-1">{social.label}</div>
                      <div className="text-sm font-bold truncate">{social.handle}</div>
                    </a>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:w-1/2">
                <div className="glass-card p-10">
                  <h3 className="text-2xl font-black mb-8 uppercase tracking-widest">Get in Touch</h3>
                  <form className="space-y-6">
                    <div>
                      <label className="text-xs font-black tracking-widest uppercase text-text-secondary mb-2 block">Name</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-[#00e5ff] transition-colors outline-none" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="text-xs font-black tracking-widest uppercase text-text-secondary mb-2 block">Email</label>
                      <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-[#00e5ff] transition-colors outline-none" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="text-xs font-black tracking-widest uppercase text-text-secondary mb-2 block">Message</label>
                      <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-[#00e5ff] transition-colors outline-none resize-none" placeholder="How can I help you?" />
                    </div>
                    <button className="w-full bg-[#00e5ff] text-black font-black py-4 rounded-lg hover:bg-[#00c2d9] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 uppercase tracking-widest">
                      Transmit Message <ChevronRight size={20} />
                    </button>
                  </form>
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
