// ─────────────────────────────────────────────────────────────
// ALL SITE CONTENT LIVES HERE. Edit this file to update copy,
// projects, skills, and links — no need to touch components.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Hritik Prajapati",
  title: "Aspiring Full-Stack Web Developer",
  bio: "Passionate BCA student and aspiring full-stack developer, building responsive and interactive web applications. Currently expanding my skills in modern web technologies and open to freelance and remote opportunities.",
  // Hero profile picture — small circular portrait shown in Scene 01 only.
  // Rendered in the Hero section's HTML, so it scrolls away completely.
  heroImage: "/hi4.jpg",
  contact: {
    email: "your.email@example.com", // TODO: replace with real email
    github: "https://github.com/your-username", // TODO
    linkedin: "https://linkedin.com/in/your-profile", // TODO
  },
};

export const skills = [
  { label: "HTML5 & CSS3", note: "Semantic markup, modern layout systems" },
  { label: "JavaScript (ES6+)", note: "DOM, async patterns, modular code" },
  { label: "Responsive Web Design", note: "Mobile-first, fluid breakpoints" },
  { label: "Git & GitHub", note: "Branching, PRs, version control" },
];

export const tools = ["Visual Studio Code", "Git & GitHub", "Android Studio"];

// ── PLACEHOLDER PROJECTS ────────────────────────────────────
// These are drafts, not real work — swap title/description/image/link
// once your actual projects and case studies are ready.
export const projects = [
  {
    id: "01",
    title: "Pulse — Responsive Landing Page",
    description:
      "A fully responsive marketing landing page built with HTML5, CSS3, and vanilla JavaScript, with scroll-driven reveals and a layout that holds up cleanly from mobile to desktop.",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1200&auto=format&fit=crop",
    link: "#", // TODO: replace with live link or repo
  },
  {
    id: "02",
    title: "TaskFlow — JS Task Manager",
    description:
      "A lightweight task management app built with vanilla JavaScript (ES6+). Local-storage persistence, a drag-and-drop board, and a clean, distraction-free interface.",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1200&auto=format&fit=crop",
    link: "#", // TODO
  },
  {
    id: "03",
    title: "DevConnect — Git Workflow Demo",
    description:
      "A small collaborative front-end project used to practice real Git/GitHub workflows — feature branching, pull requests, and code review, structured like a team environment.",
    image:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1200&auto=format&fit=crop",
    link: "#", // TODO
  },
];

// Replaces a Testimonials section — appropriate for a student portfolio
// with no client work yet. Update as your focus shifts.
export const currentFocus = [
  {
    label: "Learning",
    detail: "Deepening React and modern component-driven architecture",
  },
  {
    label: "Building",
    detail: "Small full-stack projects to move from static sites to real apps",
  },
  {
    label: "Seeking",
    detail: "Freelance work and remote opportunities to apply these skills",
  },
];
