import type { ProfileData } from './types';

/**
 * SOURCE OF TRUTH: Max Frenat Portfolio
 *
 * Rules:
 * 1. Only data backed by (a) CV or (b) GitHub (github.com/LKenzo).
 * 2. Every entry has exactly one explicit source: "cv" or "github:<repo>".
 * 3. Excluded: phone, home address, birth date, national ID numbers, and sensitive info.
 * 4. Email is held pending explicit user confirmation.
 */

export const PROFILE: ProfileData = {
  identity: {
    displayName: 'Max Frenat',
    fullName: 'Maximillian Delavega Adiwinata Frenat',
    headline: 'Cybersecurity Student',
    backgroundSummary:
      'Cybersecurity student at BINUS University with practical coursework in algorithmic problem solving and web exploitation. Active CTF competitor with experience in challenge writeups and technical documentation.',
    location: 'Jakarta, Indonesia',
    emailPendingConfirmation: null,
    links: [
      {
        platform: 'GitHub',
        url: 'https://github.com/LKenzo',
        label: 'github.com/LKenzo',
        source: 'cv',
      },
      {
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/in/maximillian-frenat-80ab41286/',
        label: 'Maximillian Frenat',
        source: 'cv',
      },
    ],
    source: 'cv',
  },

  education: [
    {
      institution: 'BINUS University',
      degree: 'Bachelor of Computer Science (Cybersecurity)',
      gpa: '3.63/4.00',
      period: 'Aug 2024 - Present',
      location: 'Jakarta, Indonesia',
      coursework: [
        'Network Penetration Testing',
        'Mobile Penetration Testing',
        'Software Security',
        'Server and Network Administration',
        'Cyber Law',
        'Algorithm Design & Analysis',
      ],
      source: 'cv',
    },
  ],

  certifications: [
    {
      name: 'Fortinet Certified Fundamentals (FCF) - Cybersecurity',
      issuer: 'Fortinet',
      issueDate: 'Jul 2026',
      source: 'cv',
    },
  ],

  completionCertificates: [
    {
      name: 'Pre Security Learning Path',
      issuer: 'TryHackMe',
      issueDate: '23 Sep 2025',
      courseDuration: '7 hours 38 minutes',
      certificateId: 'THM-GZYRZASBPB',
      source: 'cv',
    },
  ],

  experience: [
    {
      role: 'Lab Assistant | Trainee',
      organization: 'BINUS University',
      period: 'Oct 2025 - Dec 2025',
      highlights: [
        'Streamlined complex backend logic for full stack applications using React and NestJS, delivering production-ready modules to senior evaluators.',
        'Completed a high intensity 420 hour technical bootcamp (14 hours/day), mastering advanced Algorithm Design with C, Java (OOP), SQL, Web Design, and Web Programming.',
        'Successfully developed a working social media platform from scratch and passed the technical review by senior trainers with a focus on core software development skills.',
      ],
      source: 'cv',
    },
    {
      role: 'Asst. Koordinator',
      organization: 'Binus Cyber Security Community (BCSC)',
      period: '2025',
      highlights: [
        'Simplified complex cybersecurity topics into easy to understand learning materials for over 100 community members.',
        'Authored 5 technical articles and reports on emerging malware and zero-day vulnerabilities, helping readers to stay informed about the latest cyber threats.',
        'Led internal coordination for security workshops, resulting in a more structured flow of information and higher engagement within the community',
      ],
      source: 'cv',
    },
    {
      role: 'Partnership Relations',
      organization: 'CYPHER 2025',
      period: 'Aug 2025 - Oct 2025',
      highlights: [
        'Organized and led a CTI Group networking event for 50 students, facilitating insights into real world industry practices and collaboration with corporate experts.',
        'Managed partnerships with 10+ student organizations and media partners to coordinate promotion and drive campus wide visibility.',
        'Secured 100% registration capacity within the first week, managing all enrollment workflows for 50 participants.',
      ],
      source: 'cv',
    },
  ],

  activities: [
    {
      title: 'CTF Contest 2025',
      roleOrScope: 'BINUS University Competition',
      date: 'Jun 2025',
      highlights: [
        'Competed as part of the BINUS team in a university-wide CTF, solving technical challenges across Web Exploitation, and Forensics.',
      ],
      source: 'cv',
    },
    {
      title: 'COMPFEST Competition',
      roleOrScope: 'National Competition',
      date: 'Aug 2025',
      highlights: [
        'Competed in the CTF category, focusing on Cryptography and Web Exploitation challenges.',
      ],
      source: 'cv',
    },
  ],

  skills: [
    // Binary & File Analysis (evidenced in Cybersecurity-Journey)
    { name: 'xxd', category: 'Binary & File Analysis', source: 'github:Cybersecurity-Journey' },
    { name: 'hexedit', category: 'Binary & File Analysis', source: 'github:Cybersecurity-Journey' },
    { name: 'binwalk', category: 'Binary & File Analysis', source: 'github:Cybersecurity-Journey' },
    { name: 'strings', category: 'Binary & File Analysis', source: 'github:Cybersecurity-Journey' },
    { name: 'file', category: 'Binary & File Analysis', source: 'github:Cybersecurity-Journey' },
    { name: 'pngcheck', category: 'Binary & File Analysis', source: 'github:Cybersecurity-Journey' },
    { name: 'Ghidra', category: 'Binary & File Analysis', source: 'github:Cybersecurity-Journey' },
    { name: 'gdb', category: 'Binary & File Analysis', source: 'github:Cybersecurity-Journey' },
    { name: 'radare2', category: 'Binary & File Analysis', source: 'github:Cybersecurity-Journey' },

    // Network & Systems (evidenced in Cybersecurity-Journey, Mx-Security-Tools)
    { name: 'Wireshark', category: 'Network & Systems', source: 'github:Cybersecurity-Journey' },
    { name: 'tshark', category: 'Network & Systems', source: 'github:Cybersecurity-Journey' },
    { name: 'sha256sum', category: 'Network & Systems', source: 'github:Cybersecurity-Journey' },
    { name: 'openssl', category: 'Network & Systems', source: 'github:Cybersecurity-Journey' },
    { name: 'Multithreaded TCP port scanning', category: 'Network & Systems', source: 'github:Mx-Security-Tools' },
    { name: 'Python socket', category: 'Network & Systems', source: 'github:Mx-Security-Tools' },
    { name: 'argparse', category: 'Network & Systems', source: 'github:Mx-Security-Tools' },

    // Scripting & Programming (evidenced in Cybersecurity-Journey, Python-Journey, Social-Media-Project, cuanmate)
    { name: 'Python', category: 'Scripting & Programming', source: 'github:Cybersecurity-Journey' },
    { name: 'Bash', category: 'Scripting & Programming', source: 'github:Cybersecurity-Journey' },
    { name: 'pytest', category: 'Scripting & Programming', source: 'github:Python-Journey' },
    { name: 'TypeScript', category: 'Scripting & Programming', source: 'github:Social-Media-Project' },
    { name: 'JavaScript', category: 'Scripting & Programming', source: 'github:cuanmate' },

    // Web & Frameworks (evidenced in Social-Media-Project, cuanmate, odin-recipes)
    { name: 'React', category: 'Web & Frameworks', source: 'github:Social-Media-Project' },
    { name: 'NestJS', category: 'Web & Frameworks', source: 'github:Social-Media-Project' },
    { name: 'Prisma ORM', category: 'Web & Frameworks', source: 'github:Social-Media-Project' },
    { name: 'MySQL', category: 'Web & Frameworks', source: 'github:Social-Media-Project' },
    { name: 'JWT authentication', category: 'Web & Frameworks', source: 'github:Social-Media-Project' },
    { name: 'Levenshtein distance algorithm', category: 'Web & Frameworks', source: 'github:Social-Media-Project' },
    { name: 'Multer', category: 'Web & Frameworks', source: 'github:Social-Media-Project' },
    { name: 'Swagger API', category: 'Web & Frameworks', source: 'github:Social-Media-Project' },
    { name: 'Vite', category: 'Web & Frameworks', source: 'github:cuanmate' },
    { name: 'Tailwind CSS', category: 'Web & Frameworks', source: 'github:cuanmate' },
    { name: 'HTML', category: 'Web & Frameworks', source: 'github:odin-recipes' },
    { name: 'CSS', category: 'Web & Frameworks', source: 'github:odin-recipes' },

    // Security Topics (evidenced in writeups and repo modules)
    { name: 'PNG CRC recalculation', category: 'Security Topics', source: 'github:Cybersecurity-Journey' },
    { name: 'Timing side-channel attack', category: 'Security Topics', source: 'github:Cybersecurity-Journey' },
    { name: 'Brute-force simulation', category: 'Security Topics', source: 'github:Python-Journey' },
    { name: 'URL sanitization', category: 'Security Topics', source: 'github:Python-Journey' },
    { name: 'File signature analysis', category: 'Security Topics', source: 'github:Python-Journey' },
  ],

  projects: [
    {
      name: 'Cybersecurity Journey',
      repoName: 'Cybersecurity-Journey',
      summary:
        'Personal cybersecurity knowledge base documenting CTF challenge walkthroughs across forensics, reverse engineering, and side-channel attacks, alongside FCF certification notes.',
      primaryLanguage: 'Python / Markdown',
      url: 'https://github.com/LKenzo/Cybersecurity-Journey',
      highlights: [
        'c0rrupt challenge writeup: repaired corrupted PNG by analyzing byte streams and recalculating CRC checksums.',
        'verify challenge writeup: verified file integrity through SHA-256 hash checksums.',
        'SideChannel challenge writeup: 8-digit PIN brute-force exploit using a timing side-channel attack on an ELF binary.',
      ],
      source: 'github:Cybersecurity-Journey',
    },
    {
      name: 'Mobile Application Penetration Testing',
      repoName: 'Mobile-Pentest-Summary',
      summary:
        'Five-student course project assessing an Android app with OWASP MASTG: static and dynamic analysis, with findings scored in CVSS 4.0.',
      primaryLanguage: 'Security Assessment / Android',
      url: '/Pentest-Project-Summary.pdf',
      highlights: [
        'Tools: JADX, MobSF, Frida, Burp Suite, ADB.',
        'Findings: exposed API key, client-side control bypass, device-block bypass.',
        'Fixes: server-side validation, restricted keys, device attestation.',
      ],
      source: 'document:pentest-summary',
    },
    {
      name: 'Social Media Project',
      repoName: 'Social-Media-Project',
      summary:
        'Full-stack social media prototype developed as the Take-Home Case for Lab Assistant training (26-1) with JWT authentication, debounced Levenshtein search, and multimedia handling.',
      primaryLanguage: 'TypeScript',
      url: 'https://github.com/LKenzo/Social-Media-Project',
      highlights: [
        'Frontend developed with React; backend powered by NestJS and Prisma ORM.',
        'JWT-based user authentication and session management.',
        'Levenshtein distance algorithm for fuzzy user search with frontend debouncing.',
        'Multer integration for image/video upload pipelines and dynamic user profiles.',
      ],
      source: 'github:Social-Media-Project',
    },
    {
      name: 'Mx-Security-Tools',
      repoName: 'Mx-Security-Tools',
      summary:
        'Multithreaded command-line TCP port scanner written in Python that takes a target IP address and port range configuration via argparse, featuring a local mock server for port testing.',
      primaryLanguage: 'Python',
      url: 'https://github.com/LKenzo/Mx-Security-Tools',
      highlights: [
        'Up to 50 worker threads using ThreadPoolExecutor for concurrent port checks.',
        '0.5-second socket connection timeout (socket.settimeout(0.5)).',
        'Single port scanning via -p or inclusive port range scanning via -r.',
        'Includes port_testing.py local mock socket server for scanner verification.',
      ],
      authorizedUseNotice: 'For authorized security testing and educational environments only.',
      source: 'github:Mx-Security-Tools',
    },
    {
      name: 'Python Journey',
      repoName: 'Python-Journey',
      summary:
        'Structured daily progression building programming and scripting foundations for cybersecurity and CTF tasks, including automated brute-force simulations, error handling, and test suites.',
      primaryLanguage: 'Python',
      url: 'https://github.com/LKenzo/Python-Journey',
      highlights: [
        'Mini brute-force simulation script and conditional logic testing.',
        'Script testing workflows using pytest.',
        'Security mini-projects: URL sanitizer and file-signature verifier.',
      ],
      source: 'github:Python-Journey',
    },
    {
      name: 'TryHackMe Notes',
      repoName: 'tryhackme-notes',
      summary:
        'Repository housing learning notes and hands-on laboratory walkthroughs across TryHackMe paths (Cybersecurity 101, Web Fundamentals).',
      primaryLanguage: 'Markdown',
      url: 'https://github.com/LKenzo/tryhackme-notes',
      highlights: [
        'Notes on core networking, Linux command line fundamentals, and web security basics.',
      ],
      source: 'github:tryhackme-notes',
    },
    {
      name: 'Cuanmate',
      repoName: 'cuanmate',
      summary:
        'Personal finance tracker web application built with React, Vite, and Tailwind CSS.',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/LKenzo/cuanmate',
      source: 'github:cuanmate',
    },
    {
      name: 'Odin Recipes',
      repoName: 'odin-recipes',
      summary:
        'Foundational web development recipe catalog built as part of The Odin Project curriculum.',
      primaryLanguage: 'HTML / CSS',
      url: 'https://github.com/LKenzo/odin-recipes',
      source: 'github:odin-recipes',
    },
  ],

  spokenLanguages: [
    { language: 'Indonesian', proficiency: 'Native', source: 'cv' },
    { language: 'English', proficiency: 'Professional Working Proficiency', source: 'cv' },
  ],
};
