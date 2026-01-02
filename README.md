# StudyOS

A student-focused academic productivity platform designed to simplify the management of semesters, subjects, topics, notes, quizzes, and exams.

## Problem Statement

Across the world, students at every level—school, undergraduate, medical, masters, competitive exams—face the same fundamental problem: **information overload without clarity or structure**. Syllabi are vast, semesters are short, and most students struggle not because content is unavailable, but because they do not know what to study, how to revise, and how to track real understanding.

### Existing Solutions Fall Short

**Traditional Tools**: Notebooks, PDFs, and static flashcard apps require heavy manual effort and provide no intelligence or feedback.

**Modern AI Tools**: ChatGPT, Gemini, or Copilot generate content but lack academic context. They do not understand a student's semester, subjects, progress, weak areas, or revision needs. These tools answer questions, but they do not help students manage learning as a system.

### The Result

Students continuously switch between multiple apps: notes in one place, quizzes somewhere else, flashcards in another tool, and progress tracking mostly in their head. This fragmentation leads to:
- Poor revision
- Last-minute cramming
- Low retention
- Anxiety before exams

**What students are missing** is a single, intelligent workspace that adapts to their semester and supports daily learning in small, effective actions.

## Solution Overview

StudyOS solves this problem by acting as an **academic operating system** for students, not just another learning or AI app. Instead of asking students to "learn more," StudyOS helps them organize, revise, test, and track learning continuously throughout the semester.

The platform combines semester tracking, notes, flashcards, and quizzes into one unified system. AI is used selectively, only where it genuinely reduces effort, such as generating flashcards or quizzes from a topic or notes. Students interact with StudyOS in short, focused sessions, making learning feel manageable, visual, and measurable. Over time, StudyOS builds a clear picture of what the student has studied, what they understand, and what needs revision.

## MVP Core Features

### 3.1 Semester and Subject Tracking

Users can create semesters and add subjects. Each subject contains topics that can be marked based on confidence level (understood, needs revision, not started). A visual dashboard provides an overview of progress and weak areas.

### 3.2 Notes System

Users can write and organize notes per topic. Notes act as the base content from which flashcards and quizzes can be generated. Notes remain fully editable and user-owned.

### 3.3 Flashcard Generator

Users can generate concise flashcards from a topic or notes. Flashcards focus on key concepts and quick recall. Generated flashcards can be saved and reused for revision.

### 3.4 Quiz Generator

Users can generate short quizzes (3–5 questions) per topic. Quizzes provide instant feedback and explanations, helping students identify gaps in understanding.

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Font**: Geist Sans & Geist Mono

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Author

**Abdul Karim Bukhsh Ansari**

---

Built with ❤️ for students worldwide
