/* ═══════════════════════════════════════════════════════════
   InterviewAI — script.js
   Intelligent Interview Trainer Agent
   ─────────────────────────────────────────────────────────
   Sections:
     1. Question Database
     2. Session State
     3. Screen Navigation
     4. Setup Screen
     5. Question Engine
     6. Feedback Engine
     7. Dashboard
     8. Initialization
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   1. QUESTION DATABASE
   Each entry: { role, level, category, question, suggested, tip }
   "level: 'all'" means the question applies to every experience level.
══════════════════════════════════════════════════════════ */
const QUESTION_DB = [

  /* ── Java Developer ── */
  {
    role: "Java Developer", level: "all", category: "Technical",
    question: "Explain the difference between JDK, JRE, and JVM.",
    suggested: "JVM (Java Virtual Machine) is the runtime that executes Java bytecode. JRE (Java Runtime Environment) includes JVM plus standard libraries needed to run Java programs. JDK (Java Development Kit) includes JRE plus development tools like the compiler (javac). Developers need the JDK to write and compile code, whereas end-users only need the JRE.",
    tip: "Use a bottom-up approach when explaining layered concepts: start from the lowest level (JVM) and build up to the highest (JDK)."
  },
  {
    role: "Java Developer", level: "all", category: "Technical",
    question: "What is the difference between == and .equals() in Java?",
    suggested: "== compares object references (memory addresses) for objects and values for primitives. .equals() compares the actual content/state of objects. For example, two String objects with the same text will be == only if they are the same instance (or from the string pool), but .equals() will return true in both cases.",
    tip: "Always override equals() and hashCode() together in custom classes to maintain contract consistency."
  },
  {
    role: "Java Developer", level: "Intermediate", category: "Technical",
    question: "What is the difference between ArrayList and LinkedList in Java?",
    suggested: "ArrayList is backed by a dynamic array, offering O(1) random access but O(n) insertion/deletion in the middle. LinkedList is a doubly-linked list that provides O(1) insertions/deletions at both ends but O(n) random access. Prefer ArrayList for frequent reads and LinkedList for frequent insertions/deletions at the head or tail.",
    tip: "Always mention time complexity (Big-O) when comparing data structures — interviewers expect it."
  },
  {
    role: "Java Developer", level: "Experienced", category: "Technical",
    question: "Explain Java's memory model and the significance of the 'volatile' keyword.",
    suggested: "Java Memory Model (JMM) defines how threads interact through memory. Each thread has its own working copy of variables. The volatile keyword ensures that reads/writes to a variable go directly to main memory, providing visibility guarantees across threads. However, volatile does not provide atomicity — use AtomicInteger or synchronized blocks for compound operations.",
    tip: "Distinguish between visibility and atomicity — a common confusion that interviewers probe at the senior level."
  },
  {
    role: "Java Developer", level: "all", category: "HR",
    question: "Why do you want to work as a Java Developer at our company?",
    suggested: "Express genuine enthusiasm for the company's products/tech stack. Mention your experience with Java and how the role aligns with your career goals. Example: 'I've been working with Java for X years and have built scalable backend services. Your company's focus on microservices and cloud-native development aligns perfectly with my skills and the direction I want to grow in.'",
    tip: "Research the company before the interview. Tailor your answer with specific details about their products or tech stack."
  },
  {
    role: "Java Developer", level: "all", category: "Behavioral",
    question: "Tell me about a time you had to debug a difficult Java production issue.",
    suggested: "Use the STAR method: Situation — describe the production issue (e.g., memory leak). Task — your responsibility to diagnose it. Action — tools used (JProfiler, heap dumps, thread dumps), systematic elimination process. Result — resolution, and steps taken to prevent recurrence (e.g., added monitoring alerts).",
    tip: "Employers want to hear specifics: tools you used, your thought process, and what you learned."
  },

  /* ── Python Developer ── */
  {
    role: "Python Developer", level: "all", category: "Technical",
    question: "What is the difference between a list and a tuple in Python?",
    suggested: "Lists are mutable (elements can be changed) and use square brackets. Tuples are immutable (cannot be changed after creation) and use parentheses. Tuples are faster and can be used as dictionary keys (since they're hashable). Use lists for collections that need modification and tuples for fixed collections like coordinates.",
    tip: "Mention immutability as the key differentiator and explain why it matters for performance and safety."
  },
  {
    role: "Python Developer", level: "all", category: "Technical",
    question: "Explain Python's GIL (Global Interpreter Lock) and its implications.",
    suggested: "The GIL is a mutex in CPython that prevents multiple native threads from executing Python bytecode simultaneously. This means CPU-bound multithreaded programs don't get true parallelism in CPython. For CPU-bound tasks, use multiprocessing instead. For I/O-bound tasks, threads still work well because the GIL is released during I/O operations. Alternatively, use asyncio for concurrency.",
    tip: "Distinguish between I/O-bound and CPU-bound scenarios — your answer should address both."
  },
  {
    role: "Python Developer", level: "Intermediate", category: "Technical",
    question: "What are Python decorators and how do they work?",
    suggested: "A decorator is a higher-order function that takes a function as input, wraps it with additional behavior, and returns the modified function. They use the @syntax as syntactic sugar. Common uses: logging, authentication, caching (@lru_cache). Under the hood, @my_decorator before a function f is equivalent to f = my_decorator(f). You can also create decorators with arguments using a third nesting level.",
    tip: "Show a simple code example mentally when explaining decorators — interviewers appreciate concrete illustrations."
  },
  {
    role: "Python Developer", level: "Experienced", category: "Technical",
    question: "What are Python's metaclasses and when would you use them?",
    suggested: "A metaclass is the class of a class — it defines how classes behave. In Python, 'type' is the default metaclass. Custom metaclasses allow you to intercept class creation, validate class attributes, automatically register subclasses, or enforce interface contracts. They're an advanced feature used in frameworks like Django (ORM) and SQLAlchemy. Prefer simpler solutions (decorators, __init_subclass__) unless metaclasses are truly necessary.",
    tip: "Acknowledge the complexity and mention when NOT to use metaclasses — it shows mature engineering judgment."
  },
  {
    role: "Python Developer", level: "all", category: "HR",
    question: "What Python projects are you most proud of and why?",
    suggested: "Choose a project that demonstrates technical depth AND business impact. Describe the problem it solved, the Python libraries/frameworks used, any challenges overcome, and the outcome. For example: 'I built a data pipeline using Pandas and Apache Airflow that reduced our reporting time from 4 hours to 10 minutes, saving the team significant manual effort.'",
    tip: "Quantify your results wherever possible — numbers make your achievements concrete and memorable."
  },
  {
    role: "Python Developer", level: "all", category: "Behavioral",
    question: "Describe a situation where you improved the performance of a Python application.",
    suggested: "Use STAR format. Describe profiling the application (cProfile, line_profiler), identifying bottlenecks (e.g., slow database queries, redundant loops), applying optimizations (vectorization with NumPy, caching, query optimization), and the measured performance improvement. Emphasize that you profiled before optimizing — 'measure, don't guess.'",
    tip: "'Profile first, optimize second' is a golden principle — mention it to impress interviewers."
  },

  /* ── Web Developer ── */
  {
    role: "Web Developer", level: "all", category: "Technical",
    question: "Explain the CSS Box Model.",
    suggested: "Every HTML element is a rectangular box composed of four areas from inside out: content (the actual element), padding (space between content and border), border (a line around the padding), and margin (space outside the border that separates the element from others). Understanding box-sizing: border-box vs content-box is critical — border-box includes padding and border in the element's total width/height.",
    tip: "Draw or describe a diagram in your explanation — visual communication is highly valued in web development interviews."
  },
  {
    role: "Web Developer", level: "all", category: "Technical",
    question: "What is the difference between 'null' and 'undefined' in JavaScript?",
    suggested: "'undefined' means a variable has been declared but not yet assigned a value. 'null' is an explicit assignment representing intentional absence of a value. typeof undefined returns 'undefined', while typeof null returns 'object' (a well-known JS quirk). Use === for comparison since null == undefined is true but null === undefined is false.",
    tip: "Mentioning the typeof null === 'object' quirk shows you know JavaScript's historical oddities — a great signal of experience."
  },
  {
    role: "Web Developer", level: "Intermediate", category: "Technical",
    question: "Explain event delegation in JavaScript.",
    suggested: "Event delegation is a pattern where instead of attaching event listeners to many child elements, you attach a single listener to a parent element and use event.target to identify which child was clicked. This leverages event bubbling — events propagate from the target element up through the DOM. Benefits: fewer memory-consuming listeners, works for dynamically added elements.",
    tip: "Connect event delegation to performance benefits — it shows you think beyond just making things work."
  },
  {
    role: "Web Developer", level: "Experienced", category: "Technical",
    question: "What are Web Workers and when should you use them?",
    suggested: "Web Workers allow JavaScript to run in background threads, separate from the main UI thread, preventing UI freezing during heavy computations. They communicate with the main thread via postMessage() and onmessage. Use them for CPU-intensive tasks like image processing, encryption, or large data parsing. Limitations: no DOM access, limited APIs. Shared Workers allow communication between multiple scripts/tabs.",
    tip: "Lead with the problem they solve (blocking the main thread) before explaining the solution."
  },
  {
    role: "Web Developer", level: "all", category: "HR",
    question: "How do you stay updated with the latest web development trends?",
    suggested: "Describe concrete habits: following MDN, CSS-Tricks, Smashing Magazine; subscribing to newsletters like JavaScript Weekly; watching conference talks (Chrome Dev Summit, JSConf); contributing to or studying open-source projects; experimenting with new features in personal projects. Show genuine curiosity rather than just listing sources.",
    tip: "Mention a specific recent technology you explored (e.g., Web Components, CSS Container Queries) to make your answer feel authentic and current."
  },
  {
    role: "Web Developer", level: "all", category: "Behavioral",
    question: "Tell me about a time you had to meet a tight deadline on a web project.",
    suggested: "Use STAR. Describe prioritizing core features using MoSCoW (Must Have, Should Have, Could Have, Won't Have), breaking tasks into smaller chunks, communicating proactively with stakeholders about scope, and leveraging existing libraries rather than building from scratch. Conclude with the successful delivery and any lessons learned about estimation.",
    tip: "Show that you communicated proactively with your team or client about risks — this is what senior developers do."
  },

  /* ── Data Analyst ── */
  {
    role: "Data Analyst", level: "all", category: "Technical",
    question: "What is the difference between GROUP BY and ORDER BY in SQL?",
    suggested: "GROUP BY is used to aggregate rows that have the same values in specified columns, typically combined with aggregate functions like COUNT(), SUM(), AVG(). ORDER BY sorts the result set by specified columns in ascending (ASC) or descending (DESC) order. They serve different purposes and can be used together: GROUP BY first aggregates, then ORDER BY sorts the aggregated results.",
    tip: "Always specify whether ORDER BY defaults to ASC — interviewers check for precision in SQL answers."
  },
  {
    role: "Data Analyst", level: "all", category: "Technical",
    question: "Explain the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN.",
    suggested: "INNER JOIN returns only rows where there is a match in both tables. LEFT JOIN returns all rows from the left table plus matching rows from the right (NULLs for non-matches). RIGHT JOIN is the mirror opposite. FULL OUTER JOIN returns all rows from both tables. Understanding which join to use depends on whether you need all records from one or both tables regardless of matching.",
    tip: "Use Venn diagrams mentally when explaining joins — and mention that LEFT JOIN is the most commonly used in practice."
  },
  {
    role: "Data Analyst", level: "Intermediate", category: "Technical",
    question: "What is data normalization and why is it important?",
    suggested: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. 1NF eliminates duplicate columns. 2NF removes partial dependencies. 3NF removes transitive dependencies. While normalization reduces storage and anomalies, sometimes denormalization is preferred for read-heavy analytical workloads to reduce the number of joins.",
    tip: "Mentioning when NOT to normalize (analytical databases, data warehouses) shows you understand real-world trade-offs."
  },
  {
    role: "Data Analyst", level: "Experienced", category: "Technical",
    question: "What is the difference between OLTP and OLAP systems?",
    suggested: "OLTP (Online Transaction Processing) systems handle day-to-day transactional operations — they are optimized for fast INSERT/UPDATE/DELETE operations with many short transactions. OLAP (Online Analytical Processing) systems are optimized for complex queries over large historical datasets for reporting and analysis. OLAP typically uses star or snowflake schemas, columnar storage, and data warehouses like Snowflake or BigQuery.",
    tip: "Real-world examples (MySQL for OLTP, Snowflake for OLAP) make abstract concepts immediately credible."
  },
  {
    role: "Data Analyst", level: "all", category: "HR",
    question: "How do you communicate complex data insights to non-technical stakeholders?",
    suggested: "Focus on the business question first, not the methodology. Use clear visualizations (bar charts for comparisons, line charts for trends). Avoid jargon — translate statistics into business language. Provide context: instead of 'CTR increased by 2.3%,' say 'Twice as many people clicked the button, which translates to 500 more sign-ups per week.' Tell the story the data reveals.",
    tip: "The ability to translate data into decisions is what separates good analysts from great ones — emphasize this in your answer."
  },
  {
    role: "Data Analyst", level: "all", category: "Behavioral",
    question: "Describe a time when your analysis led to a significant business decision.",
    suggested: "Structure with STAR. Describe the business question you were given, your analytical approach (SQL queries, Python analysis, dashboard), the insight you uncovered (e.g., a customer segment with 3x higher churn), and how the recommendation was implemented (targeted retention campaign) and what the measurable result was.",
    tip: "Quantify both the insight and the outcome — 'we reduced churn by 15%' is far more powerful than 'we improved retention.'"
  },

  /* ── AI Engineer ── */
  {
    role: "AI Engineer", level: "all", category: "Technical",
    question: "What is the difference between supervised, unsupervised, and reinforcement learning?",
    suggested: "Supervised learning trains on labeled data to learn a mapping from inputs to outputs (e.g., classification, regression). Unsupervised learning finds hidden patterns in unlabeled data (e.g., clustering with K-Means, dimensionality reduction with PCA). Reinforcement learning trains an agent to maximize cumulative reward through interaction with an environment, guided by trial and error (e.g., game-playing AIs, robotics).",
    tip: "Ground each type in a concrete, relatable example — abstract definitions alone rarely satisfy interviewers."
  },
  {
    role: "AI Engineer", level: "all", category: "Technical",
    question: "What is overfitting and how do you prevent it?",
    suggested: "Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize to new data. Prevention techniques: regularization (L1/L2), dropout (for neural networks), cross-validation, reducing model complexity, early stopping, and gathering more training data or using data augmentation. The bias-variance trade-off underpins all these strategies.",
    tip: "Mention both detection methods (train vs validation loss divergence) and prevention techniques to give a complete answer."
  },
  {
    role: "AI Engineer", level: "Intermediate", category: "Technical",
    question: "Explain the transformer architecture and why it changed NLP.",
    suggested: "Transformers, introduced in 'Attention Is All You Need' (2017), replaced RNNs with self-attention mechanisms that process entire sequences in parallel. Key components: multi-head self-attention, positional encoding, feed-forward layers, and layer normalization. Self-attention allows each token to attend to all other tokens, capturing long-range dependencies efficiently. This led to models like BERT, GPT, and T5 that dominate NLP tasks.",
    tip: "Emphasize parallelization (vs sequential RNNs) as the key scalability advantage that made large language models possible."
  },
  {
    role: "AI Engineer", level: "Experienced", category: "Technical",
    question: "What is RAG (Retrieval-Augmented Generation) and when would you use it?",
    suggested: "RAG combines a retrieval system (typically a vector database like Pinecone or FAISS) with a generative LLM. When a query arrives, relevant documents are retrieved via semantic search and injected into the LLM's context as grounding information. Use RAG when: your LLM needs access to up-to-date or proprietary information not in its training data, you want to reduce hallucinations, and you need source attribution. Alternatives: fine-tuning (expensive, static), prompt engineering (limited context window).",
    tip: "Comparing RAG vs fine-tuning vs prompt engineering shows architectural maturity that senior AI roles require."
  },
  {
    role: "AI Engineer", level: "all", category: "HR",
    question: "How do you approach responsible AI and bias mitigation in your work?",
    suggested: "Explain your process: audit training data for representation imbalances, use fairness metrics (demographic parity, equalized odds), apply techniques like re-weighting or adversarial debiasing, perform disparate impact testing before deployment, and continuously monitor model behavior post-deployment. Reference frameworks like IBM AI Fairness 360 or Google's Responsible AI practices.",
    tip: "AI ethics is increasingly important in interviews. Show you think about fairness not as a checkbox but as an ongoing engineering responsibility."
  },
  {
    role: "AI Engineer", level: "all", category: "Behavioral",
    question: "Tell me about a machine learning project that didn't go as planned and what you learned.",
    suggested: "Honestly describe the setback (e.g., model performance plateau, data quality issues, scope creep). Explain how you diagnosed the root cause, pivoted your approach (tried different algorithms, collected more data, re-framed the problem), and what the final outcome was. Conclude with the concrete lessons you applied to subsequent projects.",
    tip: "Interviewers respect engineers who learn from failure. Be specific and avoid vague admissions — show a structured problem-solving mindset."
  },

  /* ── Software Engineer ── */
  {
    role: "Software Engineer", level: "all", category: "Technical",
    question: "What are the SOLID principles in object-oriented design?",
    suggested: "SOLID: S — Single Responsibility (a class has one reason to change). O — Open/Closed (open for extension, closed for modification). L — Liskov Substitution (subclasses must be substitutable for their base class). I — Interface Segregation (no client should be forced to depend on unused interfaces). D — Dependency Inversion (depend on abstractions, not concretions). These principles lead to maintainable, scalable, and testable code.",
    tip: "Memorize an example for each principle — explaining abstract OOP concepts with concrete examples is a strong interview signal."
  },
  {
    role: "Software Engineer", level: "Intermediate", category: "Technical",
    question: "What is the difference between a process and a thread?",
    suggested: "A process is an independent program in execution with its own memory space, file handles, and system resources. A thread is a lightweight unit of execution within a process, sharing the same memory space. Inter-process communication (IPC) is more expensive than inter-thread communication. However, a crashed thread can affect the entire process, while a crashed process is isolated. Modern apps use threads for concurrency within a process and processes for isolation.",
    tip: "Mention the trade-off between isolation (processes) and performance (threads) — this shows systems-level thinking."
  },
  {
    role: "Software Engineer", level: "all", category: "Technical",
    question: "Explain the difference between REST and GraphQL.",
    suggested: "REST uses fixed endpoints, each returning a predefined data structure. GraphQL uses a single endpoint where clients specify exactly what data they need in a query, eliminating over-fetching and under-fetching. REST is simpler and widely adopted; GraphQL is more flexible for complex, nested data and is great for frontend-driven APIs. REST is preferred for simple CRUD operations; GraphQL shines in applications with complex, varied data needs.",
    tip: "Mention a real trade-off: GraphQL adds complexity (schema definition, caching challenges) that isn't always worth it for simple APIs."
  },
  {
    role: "Software Engineer", level: "Experienced", category: "Technical",
    question: "What is CAP theorem and how does it influence database selection?",
    suggested: "CAP theorem states that a distributed system can guarantee at most two of: Consistency (all nodes see the same data), Availability (every request gets a response), and Partition Tolerance (system continues despite network partitions). Since network partitions are unavoidable, systems choose between CP (consistent, may be unavailable during partitions — e.g., HBase, MongoDB with strong consistency) or AP (available but eventually consistent — e.g., Cassandra, DynamoDB). Understanding this guides database selection based on system requirements.",
    tip: "Real examples (Cassandra = AP, HBase = CP) anchor the theorem in practice and show production-level knowledge."
  },
  {
    role: "Software Engineer", level: "all", category: "HR",
    question: "Tell me about yourself and your software engineering background.",
    suggested: "Structure your answer: current role and key responsibilities → 2–3 relevant accomplishments → why you're interested in this role. Keep it under 2 minutes. Focus on impact, not just activities. Example: 'I'm a software engineer with X years in backend development, primarily working with Java and AWS. Most recently I led a team that reduced our API latency by 40%.' Then tie your background to the specific role you're interviewing for.",
    tip: "The 'tell me about yourself' answer sets the tone for the entire interview. Practice it until it sounds natural, not rehearsed."
  },
  {
    role: "Software Engineer", level: "all", category: "Behavioral",
    question: "Describe a situation where you disagreed with a team member's technical decision. How did you handle it?",
    suggested: "Use STAR. Describe the specific technical disagreement (e.g., choice of architecture pattern). Explain that you gathered evidence — benchmarks, articles, concrete risks — to support your position. Then describe how you presented it diplomatically, listened to their reasoning, and either reached consensus or deferred to the team after expressing your concerns. Emphasize that you committed fully to whichever decision was made.",
    tip: "The best answer shows both technical conviction and collaborative maturity — interviewers want to hire engineers who can debate ideas without damaging relationships."
  }
];

/* ══════════════════════════════════════════════════════════
   2. SESSION STATE
   Holds all runtime data for the current interview session.
══════════════════════════════════════════════════════════ */
const session = {
  userName:       "",
  jobRole:        "",
  level:          "",
  category:       "",
  questions:      [],   // filtered & shuffled question objects for this session
  currentIndex:   0,    // index into session.questions
  scores:         [],   // array of { question, score, skipped }
  totalScore:     0,
  previousScreen: null  // used to route the Dashboard "back" button
};

/* ══════════════════════════════════════════════════════════
   3. SCREEN NAVIGATION
   All screen transitions go through showScreen().
══════════════════════════════════════════════════════════ */

/**
 * showScreen — hides all screens and shows the requested one.
 * @param {string} id — the id of the .screen div to show
 */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* ══════════════════════════════════════════════════════════
   4. SETUP SCREEN
══════════════════════════════════════════════════════════ */

/**
 * validateSetup — checks that all setup fields are filled.
 * @returns {boolean} true if valid
 */
function validateSetup() {
  const name     = document.getElementById("input-name").value.trim();
  const role     = document.getElementById("select-role").value;
  const level    = document.getElementById("select-level").value;
  const category = document.getElementById("select-category").value;
  const errEl    = document.getElementById("setup-error");

  if (!name)     { showError(errEl, "Please enter your name."); return false; }
  if (!role)     { showError(errEl, "Please select a Job Role."); return false; }
  if (!level)    { showError(errEl, "Please select an Experience Level."); return false; }
  if (!category) { showError(errEl, "Please select an Interview Category."); return false; }

  errEl.style.display = "none";
  return true;
}

/**
 * showError — displays an error message in a given element.
 */
function showError(el, msg) {
  el.textContent = msg;
  el.style.display = "block";
}

/**
 * generateInterview — validates setup, builds the question list, starts the interview.
 */
function generateInterview() {
  if (!validateSetup()) return;

  session.userName = document.getElementById("input-name").value.trim();
  session.jobRole  = document.getElementById("select-role").value;
  session.level    = document.getElementById("select-level").value;
  session.category = document.getElementById("select-category").value;

  session.questions    = [];
  session.currentIndex = 0;
  session.scores       = [];
  session.totalScore   = 0;

  // Filter questions: always enforce role + category.
  // Level is refined progressively — category is never dropped.
  let pool = QUESTION_DB.filter(q =>
    q.role === session.jobRole &&
    q.category === session.category &&
    (q.level === "all" || q.level === session.level)
  );

  if (pool.length < 3) {
    pool = QUESTION_DB.filter(q =>
      q.role === session.jobRole &&
      q.category === session.category
    );
  }

  if (pool.length < 1) {
    pool = QUESTION_DB.filter(q =>
      q.role === session.jobRole &&
      q.category === session.category
    );
  }

  if (pool.length === 0) {
    console.warn(`[InterviewAI] No questions found for role="${session.jobRole}" category="${session.category}". Falling back to full role pool.`);
    pool = QUESTION_DB.filter(q => q.role === session.jobRole);
  }

  session.questions = shuffle(pool).slice(0, 5);

  showQuestionScreen();
}

/* ══════════════════════════════════════════════════════════
   5. QUESTION ENGINE
══════════════════════════════════════════════════════════ */

/**
 * showQuestionScreen — renders the current question and navigates to screen-question.
 */
function showQuestionScreen() {
  if (session.currentIndex >= session.questions.length) {
    renderDashboard(false);
    session.previousScreen = "screen-dashboard";
    showScreen("screen-dashboard");
    return;
  }

  const q = session.questions[session.currentIndex];

  const total   = session.questions.length;
  const current = session.currentIndex + 1;
  const pct     = ((current - 1) / total) * 100;

  document.getElementById("progress-label").textContent    = `Question ${current} of ${total}`;
  document.getElementById("progress-bar-fill").style.width = `${pct}%`;
  document.getElementById("progress-score-label").textContent =
    `Score: ${session.totalScore}/${session.currentIndex * 10}`;

  document.getElementById("badge-category").textContent = q.category;
  document.getElementById("badge-level").textContent    = session.level;
  document.getElementById("topbar-role-label").textContent = session.jobRole;
  document.getElementById("question-text").textContent  = q.question;

  document.getElementById("answer-input").value = "";
  document.getElementById("answer-error").style.display = "none";

  showScreen("screen-question");
}

/**
 * submitAnswer — evaluates the answer and shows feedback.
 */
function submitAnswer() {
  const answerInput = document.getElementById("answer-input");
  const answer      = answerInput.value.trim();
  const errEl       = document.getElementById("answer-error");

  if (!answer) {
    showError(errEl, "Please type your answer before submitting.");
    return;
  }
  if (answer.length < 10) {
    showError(errEl, "Your answer seems too short. Please elaborate.");
    return;
  }
  errEl.style.display = "none";

  const q        = session.questions[session.currentIndex];
  const feedback = evaluateAnswer(answer, q);

  session.totalScore += feedback.score;
  session.scores.push({
    question: q.question,
    score:    feedback.score,
    skipped:  false
  });

  renderFeedback(feedback, q);
  showScreen("screen-feedback");
}

/**
 * skipQuestion — records a skip and moves to the next question.
 */
function skipQuestion() {
  const q = session.questions[session.currentIndex];
  session.scores.push({
    question: q.question,
    score:    0,
    skipped:  true
  });
  session.currentIndex++;
  showQuestionScreen();
}

/* ══════════════════════════════════════════════════════════
   6. FEEDBACK ENGINE
   Evaluates an answer against the question's suggested answer
   using keyword matching and length heuristics to produce a score.
══════════════════════════════════════════════════════════ */

/**
 * evaluateAnswer — generates feedback for a user answer.
 * @param {string} userAnswer
 * @param {object} question — question object from QUESTION_DB
 * @returns {object} feedback — { score, strengths, improvements, tip }
 */
function evaluateAnswer(userAnswer, question) {
  const lower     = userAnswer.toLowerCase();
  const suggested = question.suggested.toLowerCase();
  const category  = question.category;

  // Common filler words excluded from keyword matching
  const stopwords = new Set([
    "that","this","with","from","they","have","been","will","when","your","more",
    "also","their","which","there","these","other","about","would","could","should",
    "does","into","than","then","some","were","each","both","much","very","just",
    "only","even","most","over","such","used","using","make","makes","allows",
    "rather","always","never","often","every","while","since","where","after",
    "before","between","without","through","however","therefore","because","although"
  ]);

  // Extract unique keywords from the suggested answer (words > 3 chars, non-stopword)
  const suggestedWords = suggested
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopwords.has(w));

  const keywords = [...new Set(suggestedWords)];
  const hits = keywords.filter(kw => lower.includes(kw)).length;

  // Target = 45% of unique keywords (capped 6–18).
  // keywordScore capped at 9; length bonus is required to reach 10.
  const target       = Math.max(6, Math.min(18, Math.round(keywords.length * 0.45)));
  const hitRatio     = keywords.length > 0 ? hits / target : 0;
  const keywordScore = Math.min(9, Math.round(hitRatio * 10));

  // STAR method bonus for Behavioral and HR questions
  let starBonus = 0;
  if (category === "Behavioral" || category === "HR") {
    const starIndicators = [
      "situation","context","project","team","role","working","company","time when",
      "task","responsible","goal","objective","challenge","problem","issue","needed",
      "action","decided","implemented","created","built","led","worked","resolved",
      "approached","analyzed","communicated","presented","designed","developed",
      "result","outcome","achieved","improved","increased","reduced","saved","impact",
      "success","learned","lesson","percent","%","delivered","completed"
    ];
    const starHits = starIndicators.filter(ind => lower.includes(ind)).length;
    starBonus = starHits >= 8 ? 2 : starHits >= 5 ? 1 : 0;
  }

  const wordCount = userAnswer.split(/\s+/).filter(Boolean).length;
  let lengthBonus;
  if      (wordCount >= 80)  lengthBonus =  2;
  else if (wordCount >= 50)  lengthBonus =  1;
  else if (wordCount >= 25)  lengthBonus =  0;
  else if (wordCount >= 15)  lengthBonus = -1;
  else                       lengthBonus = -2;

  // Minimum score of 3 for any answer of 15+ words
  const baseFloor = wordCount >= 15 ? 3 : 1;

  const rawScore = keywordScore + lengthBonus + starBonus;
  const score    = Math.max(baseFloor, Math.min(10, rawScore));

  const strengths    = buildStrengths(score, hits, target, wordCount, category);
  const improvements = buildImprovements(score, hits, target, wordCount, category, question);
  const tip          = question.tip;

  return { score, strengths, improvements, tip, hits, target, wordCount };
}

/**
 * buildStrengths — generates a positive strengths message based on score tier and category.
 */
function buildStrengths(score, hits, target, wordCount, category) {
  const detail = wordCount >= 50 ? "very detailed" : wordCount >= 25 ? "reasonably detailed" : "brief";
  const hitNote = hits > 0
    ? `You touched on ${hits} key concept${hits !== 1 ? "s" : ""}.`
    : "";

  if (score >= 8) {
    return `Excellent answer! You demonstrated strong coverage of the topic (${hits}/${target} target concepts matched) and gave a ${detail} response (${wordCount} words). ${hitNote}`;
  } else if (score >= 6) {
    return `Good effort! You covered several relevant concepts and gave a ${detail} response. ${hitNote} Keep building on this foundation.`;
  } else if (score >= 4) {
    return `You're on the right track. ${hitNote || "You addressed some aspects of the topic."} Your answer was ${detail} — there's room to go deeper.`;
  } else {
    return `You made an attempt at the question. ${hitNote || "Try to connect your answer more directly to the topic."} Review the suggested answer to strengthen your understanding.`;
  }
}

/**
 * buildImprovements — generates constructive, category-aware improvement suggestions.
 */
function buildImprovements(score, hits, target, wordCount, category, question) {
  const parts = [];

  if (wordCount < 25) {
    parts.push("Elaborate more — interviewers expect a thorough explanation, not a one-liner. Aim for at least 50 words.");
  }

  if (hits < target * 0.5) {
    if (category === "Technical") {
      parts.push(`Try to address more specific technical concepts. The ideal answer covers topics like: ${
        question.suggested.split(".")[0].slice(0, 100)
      }...`);
    } else if (category === "Behavioral" || category === "HR") {
      parts.push("Structure your answer using the STAR method: describe the Situation, your Task, the Actions you took, and the Result you achieved.");
    }
  }

  if (score >= 6 && score < 8) {
    parts.push("Consider adding a concrete real-world example or specific numbers to strengthen your answer.");
  }

  if (score < 4) {
    parts.push("Study the suggested answer below and focus on the core concepts before your next practice session.");
  }

  if (parts.length === 0) {
    parts.push("Great job! For perfection, consider adding a specific example or analogy to make your answer more memorable for the interviewer.");
  }

  return parts.join(" ");
}

/**
 * renderFeedback — populates the feedback screen DOM elements.
 */
function renderFeedback(feedback, question) {
  const scoreEl  = document.getElementById("score-value");
  const circleEl = document.getElementById("score-circle");
  const labelEl  = document.getElementById("score-label");

  scoreEl.textContent = feedback.score;

  if (feedback.score >= 8) {
    circleEl.style.background = "conic-gradient(#16a34a, #22c55e)";
    labelEl.textContent = "Excellent Answer!";
  } else if (feedback.score >= 5) {
    circleEl.style.background = "conic-gradient(#4f46e5, #818cf8)";
    labelEl.textContent = "Good Answer!";
  } else if (feedback.score >= 3) {
    circleEl.style.background = "conic-gradient(#d97706, #fbbf24)";
    labelEl.textContent = "Needs Improvement";
  } else {
    circleEl.style.background = "conic-gradient(#dc2626, #f87171)";
    labelEl.textContent = "Keep Practicing";
  }

  document.getElementById("fb-strengths-text").textContent  = feedback.strengths;
  document.getElementById("fb-improve-text").textContent    = feedback.improvements;
  document.getElementById("fb-suggested-text").textContent  = question.suggested;
  document.getElementById("fb-tip-text").textContent        = feedback.tip;
}

/* ══════════════════════════════════════════════════════════
   7. DASHBOARD
══════════════════════════════════════════════════════════ */

/**
 * renderDashboard — populates all dashboard stats and history.
 */
function renderDashboard(fromQuestion) {
  const attempted = session.scores.length;
  const answered  = session.scores.filter(s => !s.skipped);
  const avgScore  = answered.length > 0
    ? (answered.reduce((sum, s) => sum + s.score, 0) / answered.length).toFixed(1)
    : "0.0";

  const name = session.userName || "Candidate";
  document.getElementById("dashboard-greeting").textContent =
    `Hello, ${name}!`;
  document.getElementById("dashboard-subline").textContent =
    attempted > 0
      ? `You've completed ${attempted} question${attempted !== 1 ? "s" : ""} so far.`
      : "Your interview session summary will appear here.";

  document.getElementById("stat-attempted").textContent  = attempted;
  document.getElementById("stat-avg-score").textContent  = avgScore;
  document.getElementById("stat-role").textContent       = session.jobRole || "—";
  document.getElementById("stat-level").textContent      = session.level   || "—";

  const historyEl = document.getElementById("history-list");
  if (session.scores.length === 0) {
    historyEl.innerHTML = `<p class="muted">No questions answered yet.</p>`;
    return;
  }

  historyEl.innerHTML = session.scores.map((item, i) => {
    const scoreDisplay = item.skipped
      ? `<span class="history-sc skipped">Skipped</span>`
      : `<span class="history-sc">${item.score}/10</span>`;
    return `
      <div class="history-item">
        <span class="history-q">${i + 1}. ${item.question}</span>
        ${scoreDisplay}
      </div>`;
  }).join("");
}

/* ══════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
══════════════════════════════════════════════════════════ */

/**
 * shuffle — Fisher-Yates shuffle; returns a new shuffled array.
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ══════════════════════════════════════════════════════════
   8. INITIALIZATION — Wire up all buttons and event listeners
══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {

  // Home
  document.getElementById("btn-start-home").addEventListener("click", () => {
    showScreen("screen-setup");
  });
  document.getElementById("btn-start-how").addEventListener("click", () => {
    showScreen("screen-setup");
  });

  // Setup
  document.getElementById("btn-back-setup").addEventListener("click", () => {
    showScreen("screen-home");
  });
  document.getElementById("btn-generate").addEventListener("click", () => {
    generateInterview();
  });

  // Question
  document.getElementById("btn-back-question").addEventListener("click", () => {
    showScreen("screen-setup");
  });
  document.getElementById("btn-submit-answer").addEventListener("click", () => {
    submitAnswer();
  });
  document.getElementById("btn-skip-question").addEventListener("click", () => {
    skipQuestion();
  });
  document.getElementById("btn-view-dashboard").addEventListener("click", () => {
    session.previousScreen = "screen-question";
    renderDashboard(true);
    showScreen("screen-dashboard");
  });

  // Feedback
  document.getElementById("btn-next-question").addEventListener("click", () => {
    session.currentIndex++;
    showQuestionScreen();
  });
  document.getElementById("btn-end-interview").addEventListener("click", () => {
    renderDashboard(false);
    session.previousScreen = "screen-dashboard";
    showScreen("screen-dashboard");
  });

  // Dashboard
  document.getElementById("btn-back-dashboard").addEventListener("click", () => {
    if (session.previousScreen === "screen-question") {
      showScreen("screen-question");
    } else if (session.questions.length > 0 && session.currentIndex < session.questions.length) {
      showScreen("screen-question");
    } else {
      showScreen("screen-home");
    }
  });
  document.getElementById("btn-continue-interview").addEventListener("click", () => {
    if (session.questions.length > 0 && session.currentIndex < session.questions.length) {
      showScreen("screen-question");
    } else {
      showScreen("screen-setup");
    }
  });
  document.getElementById("btn-new-interview").addEventListener("click", () => {
    document.getElementById("input-name").value    = "";
    document.getElementById("select-role").value   = "";
    document.getElementById("select-level").value  = "";
    document.getElementById("select-category").value = "";
    showScreen("screen-setup");
  });

  // Ctrl+Enter submits the answer from the textarea
  document.getElementById("answer-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      submitAnswer();
    }
  });

});
