import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';

import { Github, Linkedin, Twitter, Mail, ExternalLink, Code2, Cpu, Database, Palette, Menu, X, ChevronRight, Download, Terminal } from 'lucide-react';

const CursorSparkles = () => {
  const [sparkles, setSparkles] = useState<{ id: number, x: number; y: number }[]>([]);

  useEffect(() => {
    let lastSpawn = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawn > 40) { // Throttle spawn rate to 40ms
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
        {sparkles.map(sparkle => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 1, scale: 0, x: sparkle.x - 4, y: sparkle.y - 4 }}
            animate={{ 
              opacity: 0, 
              scale: Math.random() * 2 + 1, 
              x: sparkle.x - 4 + (Math.random() - 0.5) * 50, 
              y: sparkle.y - 4 + (Math.random() + 0.5) * 50 // Drift downwards like sparks
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 + Math.random() * 0.4, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]"
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const projects = [
  {
    title: "CalFit",
    description: "A fitness and health tracking Android application built for calculating workout metrics and managing personal wellness.",
    tags: ["Kotlin", "Java", "Android SDK"],
    icon: <Code2 className="w-6 h-6" />,
    color: "#ff8c00",
    url: "https://github.com/Ravindra0310/Calfit"
  },
  {
    title: "LinkedIn Clone",
    description: "Full-stack Android application with a clean UI, real-time networking, and professional profile management.",
    tags: ["Kotlin", "Firebase", "MVVM"],
    icon: <Linkedin className="w-6 h-6" />,
    color: "#0077b5",
    url: "https://github.com/Ravindra0310/LinkedIn_Clone"
  },
  {
    title: "Edit Me",
    description: "Advanced photo editing application built with Java, featuring custom filters and pixel-perfect manipulation tools.",
    tags: ["Java", "Canvas API"],
    icon: <Palette className="w-6 h-6" />,
    color: "#a3cfbb",
    url: "https://github.com/Ravindra0310/Edit-Me"
  },
  {
    title: "PotLuck",
    description: "A shared food experience platform designed to connect communities through culinary events and resource sharing.",
    tags: ["Android SDK", "Maps API"],
    icon: <Code2 className="w-6 h-6" />,
    color: "#ffc107",
    url: "https://github.com/Ravindra0310/PotLuck"
  },
  {
    title: "CNN NEWS APP CLONE",
    description: "Real-time news aggregator with category filtering, offline reading mode, and dynamic notification handling.",
    tags: ["Retrofit", "Coroutines", "Dagger Hilt"],
    icon: <Terminal className="w-6 h-6" />,
    color: "#cc0000",
    url: "https://github.com/Ravindra0310"
  }
];

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
      const sections = ['home', 'projects', 'skills', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'HOME', icon: <Terminal size={20} /> },
    { id: 'projects', label: 'PROJECTS', icon: <Code2 size={20} /> },
    { id: 'skills', label: 'SKILLS', icon: <Cpu size={20} /> },
    { id: 'contact', label: 'CONTACT', icon: <Mail size={20} /> },
  ];

  const bgTemplate = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(0, 229, 255, 0.08), transparent 80%)`;

  return (
    <div className="app">
      <CursorSparkles />
      <div className="grid-background" />
      <motion.div className="glow-overlay" style={{ background: bgTemplate }} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${activeSection !== 'home' ? 'bg-[#0a0a0aee] backdrop-blur-md border-b border-white/5' : ''}`}>
        <div className="container py-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="bg-accent-color p-1.5 rounded-md">
              <Code2 className="text-black w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tighter">RAVINDRA.DEV</span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <a 
                key={item.id}
                href={`#${item.id}`}
                className={`text-sm font-bold tracking-widest transition-colors flex items-center gap-2 ${activeSection === item.id ? 'text-[#00e5ff]' : 'text-text-secondary hover:text-white'}`}
              >
                {item.id === activeSection && <motion.span layoutId="active-dot" className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full" />}
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <a 
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-2xl font-black tracking-tighter ${activeSection === item.id ? 'text-[#00e5ff]' : 'text-text-secondary'}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center pt-20">
          <div className="container">
            <div className="max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-[#111] border border-white/10 px-4 py-2 rounded-full mb-8"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-xs font-bold tracking-widest text-text-secondary">AVAILABLE FOR HIGH-IMPACT PROJECTS</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-6xl md:text-8xl font-black leading-[0.9] mb-6"
              >
                Hi, I'm <span className="text-white">Ravindra Solanki.</span>
              </motion.h1>

              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl font-black neon-text leading-[0.9] mb-12"
              >
                I build high-motion Android experiences.
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-text-secondary mb-12 leading-relaxed"
              >
                Frontend Android Developer | Crafting dynamic digital experiences with <span className="text-[#e2e8f0] font-bold">Kotlin</span> and <span className="text-[#e2e8f0] font-bold">Figma</span>. Focused on fluid performance and pixel-perfect execution.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a href="#projects" className="bg-[#00e5ff] text-black px-8 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-[#00c2d9] transition-all transform hover:scale-105">
                  View Projects <ChevronRight size={20} />
                </a>
                <a href="#" className="border border-white/10 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                  Download CV <Download size={20} />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="relative">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                SELECTED <br />
                <span className="neon-text">WORKS.</span>
              </h2>
              <p className="max-w-xl text-text-secondary">
                A curated gallery of mobile ecosystems and technical experiments, engineered with Kotlin and Java for high-performance Android experiences.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card group overflow-hidden"
                >
                  <div className="p-8 h-full flex flex-col">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-500"
                      style={{ backgroundColor: `${project.color}20`, border: `1px solid ${project.color}40` }}
                    >
                      <div style={{ color: project.color }}>
                        {project.icon}
                      </div>
                    </div>

                    <h3 className="text-3xl font-black mb-4">{project.title}</h3>
                    <p className="text-text-secondary mb-8 flex-grow">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-black tracking-widest uppercase px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-text-secondary">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-black tracking-widest uppercase">
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#00e5ff] transition-colors">
                        VIEW SOURCE <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                Tech Stack & <br />
                <span className="neon-text">Toolkit</span>
              </h2>
              <p className="max-w-xl text-text-secondary">
                Engineering fluid digital experiences through a curated selection of modern technologies and architectural patterns.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Mobile Engineering", icon: <Cpu />, skills: ["Kotlin", "Android SDK", "Jetpack Compose", "Dagger Hilt", "Coroutines"] },
                { title: "Design Ops", icon: <Palette />, skills: ["Figma", "Material 3", "Design Systems", "Motion Layout"] },
                { title: "Toolchain", icon: <Terminal />, skills: ["Git / GitHub Actions", "Fastlane", "Jira", "Postman"] },
                { title: "Data Systems", icon: <Database />, skills: ["Core Data", "Firebase", "SQL / SQLite", "Room Persistence"] }
              ].map((category, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="text-[#00e5ff] mb-6">
                    {category.icon}
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-widest mb-6">{category.title}</h4>
                  <ul className="space-y-3">
                    {category.skills.map((skill) => (
                      <li key={skill} className="flex items-center gap-2 text-sm text-text-secondary">
                        <span className="w-1 h-1 bg-[#00e5ff] rounded-full" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="pb-32">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-20">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:w-1/2"
              >
                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                  LET'S <br />
                  <span className="neon-text">CONNECT</span>
                </h2>
                <p className="text-xl text-text-secondary mb-12">
                  Currently open to high-impact engineering roles and architectural consulting. If you have a vision that needs technical precision, reach out.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "GitHub", handle: "Ravindra0310", icon: <Github /> },
                    { label: "LinkedIn", handle: "Ravindra Solanki", icon: <Linkedin /> },
                    { label: "Twitter", handle: "@ravirdx", icon: <Twitter /> },
                    { label: "Email", handle: "Ravi.solanki", icon: <Mail /> }
                  ].map((social, idx) => (
                    <a key={idx} href="#" className="glass-card p-6 group hover:border-[#00e5ff] transition-all">
                      <div className="text-text-secondary group-hover:text-[#00e5ff] mb-4 transition-colors">
                        {social.icon}
                      </div>
                      <div className="text-xs font-black tracking-widest uppercase mb-1">{social.label}</div>
                      <div className="text-sm font-bold truncate">{social.handle}</div>
                    </a>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:w-1/2"
              >
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
                      <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-[#00e5ff] transition-colors outline-none resize-none" placeholder="How can I help you?"></textarea>
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

      <footer className="py-20 border-t border-white/5">
        <div className="container flex flex-col items-center">
          <div className="flex gap-8 mb-12">
            <a href="#" className="text-text-secondary hover:text-white transition-colors">Github</a>
            <a href="#" className="text-text-secondary hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-text-secondary hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-text-secondary hover:text-white transition-colors">Email</a>
          </div>
          <p className="text-xs font-black tracking-[0.2em] text-text-secondary uppercase">
            © 2026 RAVINDRA SOLANKI — ENGINEERED FOR MOTION
          </p>
        </div>
      </footer>

      {/* Persistent Bottom Nav for Mobile */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-4">
          {navItems.map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`}
              className={`p-3 rounded-xl transition-all ${activeSection === item.id ? 'bg-[#00e5ff]/20 text-[#00e5ff]' : 'text-text-secondary'}`}
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
