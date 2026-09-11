# InterviewAI – Intelligent Interview Trainer Agent

A complete client-side web application that helps students and job seekers prepare for interviews by generating role-specific questions and providing instant AI-style feedback.

---

## Features

| Feature | Description |
|---|---|
| **Role-Specific Questions** | Questions tailored to 6 job roles across Technical, HR, and Behavioral categories |
| **Experience Level Filtering** | Fresher / Beginner / Intermediate / Experienced |
| **Instant Feedback** | Score out of 10, strengths, improvement areas, and a suggested ideal answer |
| **Interview Tips** | Professional tip included with every feedback |
| **Progress Dashboard** | Tracks questions attempted, average score, job role, and experience level |
| **Question History** | Per-session log showing each question and its score |

---

## Supported Job Roles

- Java Developer
- Python Developer
- Web Developer
- Data Analyst
- AI Engineer
- Software Engineer

## Interview Categories

- **Technical** — Role-specific technical concepts and problem solving
- **HR** — Motivation, culture fit, and professional background
- **Behavioral** — Situational questions using the STAR method

---

## File Structure

```
InterviewAI/
├── index.html    # All 5 application screens (Home, Setup, Question, Feedback, Dashboard)
├── style.css     # Modern professional responsive design
├── script.js     # Question database, scoring engine, feedback system, navigation
└── README.md     # This file
```

---

## How to Run

No build tools or server required. Simply open `index.html` in any modern browser.

```bash
# Option 1 — Direct file open
# Double-click index.html in your file explorer

# Option 2 — VS Code Live Server extension
# Right-click index.html → "Open with Live Server"

# Option 3 — Python simple server (from project directory)
python -m http.server 8080
# Then open http://localhost:8080
```

---

## Application Flow

```
Home Page
    │
    ▼
Interview Setup (Name / Role / Level / Category)
    │
    ▼
Question Screen (up to 5 questions per session, shuffled from the filtered pool)
    │
    ├──► Submit Answer → Feedback Screen → Next Question ──┐
    │                                                       │
    └──► Skip Question → Next Question ────────────────────┘
                                                            │
                                                            ▼
                                                     Dashboard (session summary)
```

---

## Scoring System

The feedback engine evaluates answers using four components:

1. **Keyword matching** — unique keywords are extracted from the ideal answer; a target of 45% of those keywords must be matched for full keyword score. The keyword score component is capped at 9.
2. **Length bonus** — tiered bonus/penalty based on answer word count:
   - ≥ 80 words: +2 &nbsp;|&nbsp; ≥ 50 words: +1 &nbsp;|&nbsp; ≥ 25 words: 0 &nbsp;|&nbsp; ≥ 15 words: −1 &nbsp;|&nbsp; < 15 words: −2
3. **STAR method bonus** — Behavioral and HR answers earn +1 or +2 for using STAR-method vocabulary (situation, task, action, result, etc.)
4. **Base floor** — any answer of 15 or more words receives a minimum score of 3
5. **Score clamping** — final score is always in the range 1–10

| Score | Label |
|---|---|
| 8 – 10 | Excellent Answer |
| 5 – 7  | Good Answer |
| 3 – 4  | Needs Improvement |
| 1 – 2  | Keep Practicing |

---

## Question Database

The local database in `script.js` contains **36 questions** covering:

- 6 roles × 3 categories (Technical, HR, Behavioral)
- Level-specific questions for Intermediate and Experienced tiers
- Level-agnostic questions (`level: "all"`) applying to all experience levels

Questions per role per category:

| Category | Questions in pool | Max per session |
|---|---|---|
| Technical | 4 | 4 |
| HR | 1 | 1 |
| Behavioral | 1 | 1 |

Sessions are capped at 5 questions by `slice(0, 5)`, but the actual count depends on how many questions the pool contains after filtering by role, category, and experience level.

Each question entry includes:
- `question` — the interview question
- `suggested` — a model ideal answer for evaluation and display
- `tip` — a professional interview tip

---

## Keyboard Shortcut

| Shortcut | Action |
|---|---|
| `Ctrl + Enter` | Submit answer (on the answer textarea) |

---

## Browser Compatibility

Tested and compatible with:
- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Android Chrome)

---

## Technology Stack

- **HTML5** — semantic structure, 5 single-page screens
- **CSS3** — CSS custom properties, Grid, Flexbox, responsive breakpoints
- **Vanilla JavaScript (ES6+)** — no frameworks, no dependencies

---

*InterviewAI — Intelligent Interview Trainer Agent*
