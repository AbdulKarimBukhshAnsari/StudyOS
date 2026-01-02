"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  FileText,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Target,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Calendar,
      title: "Semester & Subject Tracking",
      description:
        "Create semesters and add subjects. Each subject contains topics that can be marked based on confidence level (understood, needs revision, not started). A visual dashboard provides an overview of progress and weak areas.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: FileText,
      title: "Notes System",
      description:
        "Write and organize notes per topic. Notes act as the base content from which flashcards and quizzes can be generated. Notes remain fully editable and user-owned.",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Sparkles,
      title: "Flashcard Generator",
      description:
        "Generate concise flashcards from a topic or notes. Flashcards focus on key concepts and quick recall. Generated flashcards can be saved and reused for revision.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: HelpCircle,
      title: "Quiz Generator",
      description:
        "Generate short quizzes (3–5 questions) per topic. Quizzes provide instant feedback and explanations, helping students identify gaps in understanding.",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description:
        "Visual dashboards showing weak/strong topics. Track your learning progress continuously throughout the semester with clear metrics and insights.",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: Target,
      title: "Exam Preparation Planning",
      description:
        "Schedule tests and link topics automatically. Plan your revision strategically with AI-assisted recommendations based on your progress and upcoming exams.",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Core Features
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            StudyOS combines semester tracking, notes, flashcards, and quizzes into one
            unified system. AI is used selectively, only where it genuinely reduces
            effort.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="p-6 rounded-lg bg-card border border-border shadow-sm hover:shadow-lg transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

