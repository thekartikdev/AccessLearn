# AccessLearn — Learning Without Limits 🚀

> **One platform. Every learner. Every stage of life.**  
> *Developed by Team Alpha for the Hackathon Submission.*

---

## 📖 Project Overview

**AccessLearn** is an inclusive, full-stack e-learning platform that solves the "one-size-fits-all" limitation of traditional education. By adopting the core philosophy of **"One Concept, Many Ways,"** AccessLearn automatically transforms any academic concept into **5 accessible learning formats**:

1. **Simple Text:** Clear, jargon-free explanations with bullet points.
2. **Visual Diagrams:** Interactive visual cards and structural breakdowns.
3. **Audio Read-Aloud:** Natural text-to-speech audio narration.
4. **Real-World Examples:** Relatable daily-life analogies and stories.
5. **Practice Quizzes:** Instant formative assessment with smart remediation.

Built specifically to support students with dyslexia, low vision, ADHD, or differing language proficiencies, AccessLearn empowers every student to learn at their own pace and in their own way.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** React 18, Vite, Tailwind CSS, Recharts, PDF.js
* **Backend & Cloud:** Supabase (BaaS), PostgreSQL Relational Database, Row-Level Security (RLS)
* **Serverless & AI:** Supabase Edge Functions (Deno), Google Gemini AI API (`gemini-flash-latest`)
* **Accessibility:** Atkinson Hyperlegible & Lexend fonts, high-contrast themes, full keyboard navigation

---

## ✨ Key Features

* **Multi-Modal Learning Engine:** Instant switching between textual, visual, auditory, practical, and test-based formats.
* **AI Study Buddy Chatbot:** A floating AI tutor backed by secure serverless edge functions and Google Gemini AI.
* **Cloud Sync & Auth:** Real user registration, login, and encrypted session persistence using Supabase Auth.
* **Teacher Portal & Custom Content:** Educators can create and publish custom lessons and quizzes that sync instantly for all students.
* **PDF Study Material Parser:** Local document text extraction and analysis.
* **Gamified Progress Tracking:** Live XP, daily study streaks, mastery percentages, and unlockable achievement badges.

---

## 🚀 Quick Start (Local Development)

Clone the repository and run the project locally:

```bash
# 1. Clone the repository
git clone https://github.com/thekartikdev/ACCESSLEARN.REPOSITORY_URL.git

# 2. Navigate into the project folder
cd accesslearn

# 3. Install dependencies
npm install

# 4. Set up environment variables
# Create a .env file in the root directory based on .env.example
cp .env.example .env

# 5. Start the development server
npm run dev        # Runs on http://localhost:5173
```

---

## ⚙️ Environment Variables (`.env.example`)

To connect your local build to your Supabase and Gemini backend, configure your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
