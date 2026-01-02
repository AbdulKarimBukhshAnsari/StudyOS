"use client";

import { motion } from "framer-motion";
import { AlertCircle, FileText, MessageSquare, BookMarked } from "lucide-react";

export function ProblemStatement() {
  const problems = [
    {
      icon: FileText,
      title: "Information Overload",
      description:
        "Students face vast syllabi without clarity or structure, struggling to know what to study and how to revise.",
    },
    {
      icon: MessageSquare,
      title: "Fragmented Tools",
      description:
        "Notes in one app, quizzes in another, flashcards elsewhere—leading to poor revision and last-minute cramming.",
    },
    {
      icon: BookMarked,
      title: "No Academic Context",
      description:
        "AI tools generate content but don't understand your semester, subjects, progress, or revision needs.",
    },
    {
      icon: AlertCircle,
      title: "Low Retention & Anxiety",
      description:
        "Without proper tracking and planning, students experience poor retention and exam anxiety.",
    },
  ];

  return (
    <section id="problem" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            The Problem Students Face
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Across the world, students at every level face the same fundamental
            problem: information overload without clarity or structure. Most students
            struggle not because content is unavailable, but because they don&apos;t know
            what to study, how to revise, and how to track real understanding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-6 rounded-lg bg-card border border-border shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-3xl mx-auto text-center p-8 rounded-lg bg-card border border-border"
        >
          <p className="text-lg leading-relaxed">
            <span className="font-semibold">What students are missing</span> is a
            single, intelligent workspace that adapts to their semester and supports
            daily learning in small, effective actions.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

