
'use client';
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SolutionOverview() {
  const benefits = [
    "Organize learning with structured academic hierarchy",
    "Track progress with visual dashboards",
    "Generate flashcards and quizzes with AI assistance",
    "Plan revision strategically before exams",
    "Reduce cognitive load with minimalistic design",
    "Access everything in one unified workspace",
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                The StudyOS Solution
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                StudyOS solves this problem by acting as an academic operating system
                for students. Instead of asking students to &quot;learn more,&quot; StudyOS helps
                them organize, revise, test, and track learning continuously throughout
                the semester.
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button size="lg" asChild className="group">
                  <Link href="/register">
                    Start Your Journey
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right side - Visual representation */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative p-8 rounded-2xl bg-card border border-border shadow-xl">
                {/* Mock dashboard visualization */}
                <div className="space-y-4">
                  <div className="h-4 bg-primary/20 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-primary/10 rounded w-full" />
                  <div className="h-4 bg-primary/10 rounded w-5/6" />
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                        className="h-24 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20"
                      />
                    ))}
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center"
                >
                  <span className="text-2xl">📚</span>
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center"
                >
                  <span className="text-xl">✨</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

