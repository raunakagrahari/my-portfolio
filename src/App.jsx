import React, { useState, useEffect, useRef } from 'react';
import resumeData from './data/resume.json';

// Map skills helper for category display
const mapSkills = (skillsObj) => {
  const mappers = {
    languages: { category: "Languages & Core", note: "Primary systems and scripting languages" },
    backend: { category: "Backend & APIs", note: "High-performance services and microservice architectures" },
    databases: { category: "Databases & Cache", note: "Relational, document, and session data layers" },
    cloudDevOps: { category: "Cloud & DevOps", note: "Serverless functions, containers, and deployment tracking" },
    security: { category: "Security & Tools", note: "Authentication layers, payment gateways, and API specs" }
  };

  return Object.keys(mappers)
    .map(key => ({
      category: mappers[key].category,
      note: mappers[key].note,
      skills: skillsObj[key] || []
    }))
    .filter(item => item.skills.length > 0);
};

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'navy');
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isResumeDropdownOpen, setIsResumeDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Typewriter states
  const roles = ["Backend Developer", "Node.js Engineer", "System Architect", "API Specialist"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentRoleText, setCurrentRoleText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // API Driven States (Static local data loading)
  const [skillsData, setSkillsData] = useState(() => mapSkills(resumeData.skills));
  const [projectsData, setProjectsData] = useState(resumeData.projects);
  const [timelineData, setTimelineData] = useState(resumeData.experience);
  const [educationData, setEducationData] = useState(resumeData.education);
  const [profileSummary, setProfileSummary] = useState(resumeData.summary);

  // Terminal states
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'output', text: "Welcome to Raunak's developer terminal. Type 'help' to list available commands." },
    { type: 'command', text: 'about' },
    { type: 'output', text: 'Backend Developer with 4+ years of experience specializing in Node.js, microservices, databases, and secure APIs. Specialized in building server-side applications that do not break.' }
  ]);
  const terminalBodyRef = useRef(null);
  const themeDropdownRef = useRef(null);
  const resumeDropdownRef = useRef(null);

  // Project modal states
  const [activeProjectFilter, setActiveProjectFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  // Contact form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close dropdowns on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false);
      }
      if (resumeDropdownRef.current && !resumeDropdownRef.current.contains(event.target)) {
        setIsResumeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll reveal and navbar scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Scroll reveal observer
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, []);
  // Resume data is loaded statically. No initial API fetching required.

  // Typewriter effect
  useEffect(() => {
    let timer;
    const fullText = roles[roleIndex];

    const handleType = () => {
      if (!isDeleting) {
        setCurrentRoleText(fullText.substring(0, currentRoleText.length + 1));
        if (currentRoleText.length + 1 === fullText.length) {
          timer = setTimeout(() => setIsDeleting(true), 2500);
          return;
        }
      } else {
        setCurrentRoleText(fullText.substring(0, currentRoleText.length - 1));
        if (currentRoleText.length - 1 === 0) {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
      setTypingSpeed(isDeleting ? 40 : 80);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentRoleText, isDeleting, roleIndex, typingSpeed]);

  // Terminal scroll to bottom
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalHistory]);


  // Terminal command execution parser
  const handleTerminalSubmit = async (e) => {
    e.preventDefault();
    const cmdInput = terminalInput.trim();
    if (!cmdInput) return;

    const lowerCmd = cmdInput.toLowerCase();
    const parts = lowerCmd.split(' ');
    const primaryCmd = parts[0];

    const newHistory = [...terminalHistory, { type: 'command', text: cmdInput }];
    setTerminalInput('');

    let outputText = '';

    if (primaryCmd === 'help') {
      outputText = `Available commands:
  about    - Brief profile summary
  skills   - List technical competencies
  projects - View highlighted projects
  stats    - Query real-time API server statistics
  resume   - View text-based résumé structure
  contact  - Show contact channels
  clear    - Clear terminal console history`;
    } else if (primaryCmd === 'clear') {
      setTerminalHistory([]);
      return;
    } else if (primaryCmd === 'about') {
      outputText = profileSummary || 'Backend Developer with 4+ years of experience specializing in Node.js, microservices, databases, and secure APIs. Specialized in building server-side applications that do not break.';
    } else if (primaryCmd === 'skills') {
      if (skillsData && skillsData.length > 0) {
        outputText = `[Technical Competencies]\n` + 
          skillsData.map(group => `${group.category.padEnd(20)}: ${group.skills.join(', ')}`).join('\n');
      } else {
        outputText = `[Technical Competencies]
Languages: JavaScript, TypeScript, SQL, Python
Backend:   Node.js, Express, Fastify, NestJS, REST APIs, Microservices
Databases: MySQL, PostgreSQL, MongoDB, DynamoDB, Redis, Sequelize, Mongoose
Cloud:     AWS (Lambda, SQS, S3, EC2, RDS, CloudWatch), Docker, Kubernetes, Jenkins, CI/CD, Git
Security:  JWT, OAuth 2.0, Payment Gateways (Razorpay, Cashfree, PayU, PayPal, PayGlocal)
Tools:     Jest, Mocha, Postman, Swagger, NPM`;
      }
    } else if (primaryCmd === 'projects') {
      const subIndex = parseInt(parts[1], 10);
      const currentProjects = projectsData.length > 0 ? projectsData : [];

      if (parts[1] && !isNaN(subIndex)) {
        const p = currentProjects.find(x => x.id === subIndex);
        if (p) {
          outputText = `[Project details: ${p.name}]
Tagline:  ${p.tagline}
Stack:    ${p.stack.join(', ')}
Details:  ${p.description}
Achievements:
${(p.achievements || []).map(a => ` - ${a}`).join('\n')}`;
        } else {
          outputText = `Project ID ${subIndex} not found. Type "projects" for a list of project indexes.`;
        }
      } else {
        if (currentProjects.length > 0) {
          outputText = `[Highlighted Projects]\n` +
            currentProjects.map((p) => `${p.id}. ${p.name} (${p.stack.slice(0, 3).join(', ')})`).join('\n') +
            `\n\nType 'projects <number>' (e.g. 'projects 1') for specific project details.`;
        } else {
          outputText = `[Highlighted Projects]
1. Scalable Gift Card Integration (Node.js, Express, Payment Gateways)
2. Rule-Based Promo & Coupon Engine (Node.js, Express, Targeting)
3. Checkout Microservice Re-engineering (Redis, AWS SQS, AWS Lambda)
4. Real-Time Lead & Session Dashboard (WebSockets, Telemetry, React)

Type 'projects <number>' (e.g. 'projects 1') for specific project details.`;
        }
      }
    } else if (primaryCmd === 'stats') {
      outputText = `OS Platform:      GitHub Pages (Browser Client)
Uptime:           N/A (Static Client-Side App)
Memory (Free/Tot):N/A
Node.js Version:  N/A
Active Workspace: /Users/Raunak/mygit/my-portfolio
Status:           Static Client Hosted Online`;
    } else if (primaryCmd === 'resume') {
      outputText = `[Resume: ${resumeData.name}]
Role:         Backend Developer
Location:     Mumbai, India
Email:        ${resumeData.email}
Education:    ${resumeData.education[0].degree} - ${resumeData.education[0].institution} (${resumeData.education[0].period})
Core Stack:   ${resumeData.skills.backend.slice(0, 4).join(', ')} / ${resumeData.skills.databases.slice(0, 3).join(', ')}`;
    } else if (primaryCmd === 'contact') {
      outputText = `You can reach me directly at ${resumeData.email} or visit my GitHub profile: github.com/${resumeData.github}. Alternatively, use the contact submission form below.`;
    } else {
      outputText = `Command not found: "${cmdInput}". Type "help" for a list of available commands.`;
    }

    setTerminalHistory([...newHistory, { type: 'output', text: outputText }]);
  };

  // Contact Form submit using mailto
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    const emailTo = resumeData.email || 'raunakagrahari15@gmail.com';
    const subject = encodeURIComponent(`Portfolio Message from ${contactName}`);
    const body = encodeURIComponent(`Name: ${contactName}\nEmail: ${contactEmail}\n\nMessage:\n${contactMessage}`);

    // Open default mail client
    window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;

    // Clear inputs and show success modal
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setShowSuccessModal(true);
  };

  // Filter projects helper
  const filteredProjects = activeProjectFilter === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === activeProjectFilter);

  return (
    <>
      <div className="grid-lines"></div>

      {/* Skip Link */}
      <a href="#about" className="skip-link">Skip to main content</a>

      {/* Header */}
      <header className={isScrolled ? 'scrolled' : ''}>
        <div className="nav-container">
          <a href="#" className="nav-logo">
            <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="R Logo" className="logo-img" />
            <span className="logo-text">raunak<span>.dev</span></span>
          </a>

          <nav className="nav-menu">
            <a href="#about" className="nav-link">About</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#experience" className="nav-link">Timeline</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>

          <div className="nav-actions">
            <div className="theme-selector-container" ref={themeDropdownRef}>
              <button 
                className="theme-btn" 
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                aria-label="Toggle Theme" 
                aria-haspopup="true"
              >
                <span className="theme-btn-icon">⚡</span>
                <span className="theme-btn-label">Theme</span>
              </button>
              <div className={`theme-dropdown ${isThemeDropdownOpen ? 'open' : ''}`} aria-hidden={!isThemeDropdownOpen}>
                <button className="theme-opt" onClick={() => { setTheme('navy'); setIsThemeDropdownOpen(false); }}>
                  <span className="theme-dot navy"></span> Cyber-Navy
                </button>
                <button className="theme-opt" onClick={() => { setTheme('amoled'); setIsThemeDropdownOpen(false); }}>
                  <span className="theme-dot amoled"></span> Carbon AMOLED
                </button>
                <button className="theme-opt" onClick={() => { setTheme('light'); setIsThemeDropdownOpen(false); }}>
                  <span className="theme-dot light"></span> Light Glass
                </button>
              </div>
            </div>
            
            <div className="resume-dropdown-container" ref={resumeDropdownRef} style={{ position: 'relative' }}>
              <button 
                className="theme-btn" 
                onClick={() => setIsResumeDropdownOpen(!isResumeDropdownOpen)}
                aria-label="Toggle Resume Actions" 
                aria-haspopup="true"
              >
                <span className="theme-btn-icon">📄</span>
                <span className="theme-btn-label">Resume</span>
              </button>
              <div className={`theme-dropdown ${isResumeDropdownOpen ? 'open' : ''}`} aria-hidden={!isResumeDropdownOpen}>
                <a href={`${import.meta.env.BASE_URL}mr.Raunak%20agrahari%20202607.pdf`} target="_blank" rel="noopener noreferrer" className="theme-opt" onClick={() => setIsResumeDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', textDecoration: 'none' }}>
                  <span>👁️</span> View CV
                </a>
                <a href={`${import.meta.env.BASE_URL}mr.Raunak%20agrahari%20202607.pdf`} download="mr.Raunak agrahari 202607.pdf" className="theme-opt" onClick={() => setIsResumeDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', textDecoration: 'none' }}>
                  <span>📥</span> Download CV
                </a>
              </div>
            </div>

            <a href="#contact" className="btn btn-sm btn-outline">Connect</a>
          </div>

          <button 
            className={`mobile-nav-toggle ${isMobileMenuOpen ? 'open' : ''}`} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Mobile Navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-menu">
          <a href="#about" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>About</a>
          <a href="#skills" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Skills</a>
          <a href="#projects" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Projects</a>
          <a href="#experience" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Timeline</a>
          <a href="#contact" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
        </nav>
      </div>

      <main style={{ minHeight: 'calc(100vh - 4.5rem)' }}>
        {/* Hero Section */}
        <section className="hero-section reveal is-visible">
          <div className="hero-bg-glow"></div>
          <div className="container hero-container">
            <div className="hero-content">
              <div className="hero-eyebrow">
                <span className="pulse-dot"></span> Available for projects & roles
              </div>
              <h1 className="hero-title">
                Hi, I'm <span className="gradient-text">Raunak Agrahari</span>
              </h1>
              <h2 className="hero-subtitle">
                {currentRoleText}
                <span className="terminal-cursor"></span>
              </h2>
              <p className="hero-tagline">
                I craft high-performance Node.js APIs, architect scalable microservices using Redis caching & AWS queues, and engineer resilient checkout systems integrated with multiple payment processors. Focused on building reliable, low-latency software.
              </p>

              <div className="hero-ctas">
                <a href="#projects" className="btn btn-primary">Explore Work</a>
                <a href="#contact" className="btn btn-outline">Let's Connect</a>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">Backend</div>
                  <div className="stat-label">Node.js & Express API Development</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">Microservices</div>
                  <div className="stat-label">AWS SQS, Lambda & Serverless Flow</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">Integrations</div>
                  <div className="stat-label">Payment Gateways & Rule Coupon Engines</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Terminal Section */}
        <section className="terminal-section container reveal">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-buttons">
                <span className="btn-dot close"></span>
                <span className="btn-dot minimize"></span>
                <span className="btn-dot maximize"></span>
              </div>
              <div className="terminal-title">raunak@dev-server:~</div>
              <div className="terminal-status">ONLINE</div>
            </div>
            <div className="terminal-body" ref={terminalBodyRef}>
              {terminalHistory.map((item, index) => (
                <div key={index} className="terminal-line">
                  {item.type === 'command' ? (
                    <>
                      <span className="prompt">raunak@dev-server:~$</span> <span className="input-mimic">{item.text}</span>
                    </>
                  ) : (
                    <div className="terminal-output">
                      <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{item.text}</pre>
                    </div>
                  )}
                </div>
              ))}
              <form onSubmit={handleTerminalSubmit} className="terminal-input-line">
                <span className="prompt">raunak@dev-server:~$</span>
                <input 
                  type="text" 
                  id="terminal-input" 
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  autoComplete="off" 
                  spellCheck="false" 
                  aria-label="Terminal input"
                  autoFocus
                />
                <span className="terminal-cursor"></span>
              </form>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section reveal">
          <div className="container">
            <div className="section-header">
              <span className="section-number">01</span>
              <h2 className="section-title">About Me</h2>
            </div>
            
            <div className="about-grid">
              <div className="about-text">
                <p>
                  I am a Backend Developer with 4+ years of experience specializing in Node.js, Express, Fastify, NestJS, and microservices. I focus on writing clean, scalable server-side code, optimizing databases, and integrating robust services that handle high traffic seamlessly.
                </p>
                <p>
                  My recent work at <strong>Aza Fashions</strong> involved re-engineering core checkout systems, integrating multiple payment processors (Razorpay, Cashfree, PayPal), and designing complex rule-based coupon and loyalty engines. I leverage caching with Redis and messaging systems like AWS SQS to optimize checkout latency by 40%.
                </p>
                <p>
                  I am highly comfortable designing scalable RESTful APIs, tuning database query performance (MySQL, PostgreSQL, MongoDB, DynamoDB), implementing secure OAuth / JWT authentication protocols, and setting up automated CI/CD pipelines.
                </p>
                
                <div className="education-card">
                  <h3 className="education-title">Education</h3>
                  {educationData.length > 0 ? (
                    educationData.map((edu, index) => (
                      <div key={index} className="edu-item" style={index > 0 ? { marginTop: '1.5rem' } : {}}>
                        <div className="edu-header">
                          <span className="edu-degree">{edu.degree}</span>
                          <span className="edu-year">{edu.period}</span>
                        </div>
                        <div className="edu-institution">{edu.institution}</div>
                        <div className="edu-note">{edu.details}</div>
                      </div>
                    ))
                  ) : (
                    <div className="edu-item">
                      <div className="edu-header">
                        <span className="edu-degree">Master of Computer Applications (M.C.A.)</span>
                        <span className="edu-year">2023 – 2025</span>
                      </div>
                      <div className="edu-institution">Kalinga Institute of Industrial Technology, Bhubaneswar</div>
                      <div className="edu-note">CGPA: 9.47 / 10</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="about-sidebar">
                <div className="profile-glow-card">
                  <div className="profile-glow"></div>
                  <div className="profile-content">
                    <div className="profile-avatar">RA</div>
                    <h3 className="profile-name">Raunak Agrahari</h3>
                    <p className="profile-role">Backend Developer</p>
                    <div className="profile-details">
                      <div className="p-detail"><span>📍</span> Location: Mumbai, India</div>
                      <div className="p-detail"><span>📧</span> Email: raunakagrahari15@gmail.com</div>
                      <div className="p-detail"><span>💼</span> Status: Open to opportunities</div>
                    </div>
                    <a href="#contact" className="btn btn-outline btn-full">Send Message</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="skills-section reveal">
          <div className="container">
            <div className="section-header">
              <span className="section-number">02</span>
              <h2 className="section-title">Technical Expertise</h2>
            </div>

            <div className="skills-grid">
              {skillsData.length > 0 ? (
                skillsData.map((group, index) => (
                  <div key={index} className="skill-category-card">
                    <h3 className="skill-category-title">{group.category}</h3>
                    <p className="skill-category-note">{group.note}</p>
                    <div className="skill-tags">
                      {group.skills.map((skill, tagIndex) => (
                        <span key={tagIndex} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="skill-category-card">
                  <h3 className="skill-category-title">Backend & APIs</h3>
                  <p className="skill-category-note">High-performance services and microservice architectures</p>
                  <div className="skill-tags">
                    <span className="skill-tag">Node.js</span>
                    <span className="skill-tag">Express.js</span>
                    <span className="skill-tag">Fastify</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects-section reveal">
          <div className="container">
            <div className="section-header">
              <span className="section-number">03</span>
              <h2 className="section-title">Projects Showcase</h2>
            </div>

            <div className="projects-filter">
              <button 
                className={`filter-btn ${activeProjectFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveProjectFilter('all')}
              >
                All Projects
              </button>
              <button 
                className={`filter-btn ${activeProjectFilter === 'backend' ? 'active' : ''}`}
                onClick={() => setActiveProjectFilter('backend')}
              >
                Backend & APIs
              </button>
              <button 
                className={`filter-btn ${activeProjectFilter === 'fullstack' ? 'active' : ''}`}
                onClick={() => setActiveProjectFilter('fullstack')}
              >
                Full-Stack
              </button>
              <button 
                className={`filter-btn ${activeProjectFilter === 'frontend' ? 'active' : ''}`}
                onClick={() => setActiveProjectFilter('frontend')}
              >
                Frontend & Games
              </button>
            </div>

            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="project-card"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="project-meta-line">
                    <span className="project-context">{project.context}</span>
                  </div>
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-tagline">{project.tagline}</p>
                  <div className="project-stack-tags">
                    {project.stack.slice(0, 4).map((tech, i) => (
                      <span key={i} className="stack-tag">{tech}</span>
                    ))}
                  </div>
                  <span className="project-expand-indicator">→</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section id="experience" className="timeline-section reveal">
          <div className="container">
            <div className="section-header">
              <span className="section-number">04</span>
              <h2 className="section-title">Milestones Timeline</h2>
            </div>

            <div className="timeline">
              {timelineData.length > 0 ? (
                timelineData.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-dot-marker"></div>
                    <div className="timeline-header-line">
                      <span className="timeline-period">{item.period}</span>
                      <h3 className="timeline-title">{item.role}</h3>
                    </div>
                    <div className="timeline-company">{item.company}</div>
                    {item.highlights && (
                      <ul style={{ paddingLeft: '1.25rem', marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {item.highlights.map((bullet, i) => (
                          <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div className="timeline-item">
                  <div className="timeline-dot-marker"></div>
                  <div className="timeline-header-line">
                    <span className="timeline-period">April 2023 - Present</span>
                    <h3 className="timeline-title">Software Engineer</h3>
                  </div>
                  <div className="timeline-company">Aza Fashions Private Limited</div>
                  <p className="timeline-description">Building backend services.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section reveal">
          <div className="container">
            <div className="section-header">
              <span className="section-number">05</span>
              <h2 className="section-title">Get In Touch</h2>
            </div>

            <div className="contact-grid">
              <div className="contact-info">
                <h3 className="contact-subtitle">Let's build something exceptional together</h3>
                <p className="contact-desc">
                  Whether you have an upcoming project, a remote full-time role, or just want to chat about backend security, WebSockets, or database seeding, I'm always open. Send a message, or connect directly through social channels.
                </p>
                
                <div className="contact-cards">
                  <a href="https://github.com/raunakagrahari" target="_blank" rel="noopener noreferrer" className="contact-card group">
                    <div className="card-icon">🐙</div>
                    <div className="card-content">
                      <h4>GitHub</h4>
                      <p>github.com/raunakagrahari</p>
                    </div>
                    <span className="card-arrow">→</span>
                  </a>

                  <a href="mailto:raunakagrahari15@gmail.com" className="contact-card group">
                    <div className="card-icon">✉️</div>
                    <div className="card-content">
                      <h4>Direct Email</h4>
                      <p>raunakagrahari15@gmail.com</p>
                    </div>
                    <span className="card-arrow">→</span>
                  </a>

                  <a href={`${import.meta.env.BASE_URL}mr.Raunak%20agrahari%20202607.pdf`} target="_blank" rel="noopener noreferrer" className="contact-card group">
                    <div className="card-icon">👁️</div>
                    <div className="card-content">
                      <h4>View Résumé</h4>
                      <p>Open PDF in browser tab</p>
                    </div>
                    <span className="card-arrow">→</span>
                  </a>

                  <a href={`${import.meta.env.BASE_URL}mr.Raunak%20agrahari%20202607.pdf`} download="mr.Raunak agrahari 202607.pdf" className="contact-card group">
                    <div className="card-icon">📥</div>
                    <div className="card-content">
                      <h4>Download Résumé</h4>
                      <p>Save PDF to local storage</p>
                    </div>
                    <span className="card-arrow">→</span>
                  </a>
                </div>
              </div>

              <div className="contact-form-container">
                <form onSubmit={handleContactSubmit} className="contact-form">
                  <div className="form-group">
                    <input 
                      type="text" 
                      id="contact-name" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required 
                      placeholder=" "
                    />
                    <label htmlFor="contact-name">Your Name</label>
                    <span className="input-highlight"></span>
                  </div>
                  <div className="form-group">
                    <input 
                      type="email" 
                      id="contact-email" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required 
                      placeholder=" "
                    />
                    <label htmlFor="contact-email">Email Address</label>
                    <span className="input-highlight"></span>
                  </div>
                  <div className="form-group">
                    <textarea 
                      id="contact-message" 
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required 
                      placeholder=" " 
                      rows="5"
                    ></textarea>
                    <label htmlFor="contact-message">Message Details</label>
                    <span className="input-highlight"></span>
                  </div>
                  <button type="submit" className="btn btn-primary btn-full">
                    <span className="btn-text">Submit Message</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="modal open" role="dialog">
          <div className="modal-backdrop" onClick={() => setSelectedProject(null)}></div>
          <div className="modal-wrapper">
            <button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close dialog">✕</button>
            <div className="modal-content">
              <h3 className="modal-project-title">{selectedProject.name}</h3>
              <p className="modal-project-context">{selectedProject.context}</p>
              
              <div className="project-detail-section">
                <h4 className="project-section-title">Overview</h4>
                <p className="project-section-body">{selectedProject.description}</p>
              </div>
              
              {selectedProject.challenges && selectedProject.challenges.length > 0 && (
                <div className="project-detail-section">
                  <h4 className="project-section-title">Key Challenges & Solutions</h4>
                  <div className="challenges-list">
                    {selectedProject.challenges.map((c, i) => (
                      <div key={i} className="challenge-item">
                        <div className="challenge-title">{c.title}</div>
                        <div className="challenge-body">{c.body}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedProject.achievements && selectedProject.achievements.length > 0 && (
                <div className="project-detail-section">
                  <h4 className="project-section-title">Achievements</h4>
                  <ul className="achieve-list">
                    {selectedProject.achievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="project-detail-section">
                <h4 className="project-section-title">Technologies Used</h4>
                <div className="project-stack-tags">
                  {selectedProject.stack.map((s, i) => (
                    <span key={i} className="stack-tag">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal open" role="dialog">
          <div className="modal-backdrop" onClick={() => setShowSuccessModal(false)}></div>
          <div className="modal-wrapper">
            <button className="modal-close" onClick={() => setShowSuccessModal(false)} aria-label="Close dialog">✕</button>
            <div className="modal-content" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h3 className="modal-project-title">Message Sent!</h3>
              <p className="modal-project-context">Success Status</p>
              <p className="project-section-body">
                Thank you for your message! It has been successfully saved to the backend database. I will review it and get back to you shortly.
              </p>
              <button 
                className="btn btn-primary" 
                style={{ marginTop: '1.5rem', minWidth: '120px' }} 
                onClick={() => setShowSuccessModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <div className="container footer-container" style={{ justifyContent: 'center' }}>
          <p className="footer-copyright" style={{ textAlign: 'center' }}>&copy; 2026 Raunak Agrahari. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
