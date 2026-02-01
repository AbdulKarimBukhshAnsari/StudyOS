'use client';

import { motion, useScroll, useTransform, useSpring, useInView, MotionValue } from 'framer-motion';
import { PROBLEM_STATEMENT } from '@/constants';
import { useRef } from 'react';
import { AlertCircle, Clock, FileWarning, SearchX, LucideIcon } from 'lucide-react';

const icons: LucideIcon[] = [AlertCircle, Clock, FileWarning, SearchX];

interface ProblemCardProps {
  problem: {
    icon: LucideIcon;
    title: string;
    description: string;
  };
  index: number;
  scrollProgress: MotionValue<number>;
}

const ProblemCard = ({ problem, index, scrollProgress }: ProblemCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  
  // Horizontal slide animation based on scroll
  const cardProgress = useTransform(
    scrollProgress,
    [index * 0.2, (index + 1) * 0.2],
    [0, 1]
  );
  
  const x = useTransform(cardProgress, [0, 1], index % 2 === 0 ? [-100, 0] : [100, 0]);
  const opacity = useTransform(cardProgress, [0, 0.3, 0.7, 1], [0, 0.5, 1, 1]);
  const scale = useTransform(cardProgress, [0, 0.5, 1], [0.8, 1, 1]);
  
  // Smooth spring animations
  const smoothX = useSpring(x, { stiffness: 100, damping: 30 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={cardRef}
      style={{ x: smoothX, opacity: smoothOpacity, scale: smoothScale }}
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="w-full"
    >
      <div className="group relative mx-auto max-w-4xl">
        {/* Glow effect on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
        
        <motion.div
          whileHover={{ 
            scale: 1.02,
            y: -8,
            transition: { duration: 0.3 }
          }}
          className="relative flex flex-col gap-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-8 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-300"
        >
          {/* Header with icon */}
          <div className="flex items-start gap-6">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 group-hover:from-primary/30 group-hover:to-primary/20 group-hover:border-primary/40 transition-colors"
            >
              <problem.icon className="h-8 w-8 text-primary group-hover:text-primary/90 transition-colors" />
            </motion.div>
            
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary/90 transition-colors">
                  {problem.title}
                </h3>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
                >
                  {index + 1}
                </motion.span>
              </div>
              <div className="h-1 w-20 bg-gradient-to-r from-primary via-blue-500 to-purple-500 rounded-full" />
            </div>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: index * 0.15 + 0.2 }}
            className="text-lg leading-relaxed text-muted-foreground pl-24"
          >
            {problem.description}
          </motion.p>

          {/* Decorative element */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-50" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export function ProblemStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const titleRef = useRef<HTMLDivElement>(null);
  const conclusionRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, amount: 0.5 });
  const conclusionInView = useInView(conclusionRef, { once: true, amount: 0.5 });

  return (
    <section 
      ref={containerRef} 
      id="problem" 
      className="relative py-20 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5 pointer-events-none" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 50 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-20"
        >    
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent"
          >
            {PROBLEM_STATEMENT.title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto max-w-3xl text-lg sm:text-xl text-muted-foreground leading-relaxed"
          >
            {PROBLEM_STATEMENT.description}
          </motion.p>
        </motion.div>

        {/* Problem Cards */}
        <div className="space-y-12 mb-32">
          {PROBLEM_STATEMENT.problems.map((problem, index) => (
            <ProblemCard
              key={index}
              problem={{ ...problem, icon: icons[index] || AlertCircle }}
              index={index}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Conclusion Section */}
        <motion.div
          ref={conclusionRef}
          initial={{ opacity: 0, y: 50 }}
          animate={conclusionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative mx-auto max-w-4xl"
        >
        {/* Decorative border */}
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />
        
        <div className="relative rounded-2xl bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm border border-primary/20 p-12 shadow-2xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={conclusionInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-semibold text-center leading-relaxed"
          >
              <span className="text-foreground/90">
                {PROBLEM_STATEMENT.conclusion.text}
              </span>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
