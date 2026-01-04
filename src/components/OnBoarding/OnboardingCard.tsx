'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface OnboardingCardProps {
  children: React.ReactNode;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  stepNumber?: number;
  totalSteps?: number;
  className?: string;
}

export function OnboardingCard({ 
  children, 
  icon: Icon, 
  title, 
  subtitle, 
  stepNumber,
  totalSteps = 3,
  className 
}: OnboardingCardProps) {
  const progress = stepNumber ? (stepNumber / totalSteps) * 100 : 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'w-full max-w-2xl mx-auto',
          className
        )}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-border/60"
        >
          {/* Progress Bar */}
          {stepNumber && (
            <div className="h-1.5 bg-muted/50 relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary via-primary/90 to-primary/80"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-8"
            >
              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 mb-6 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-2xl blur-xl" />
                <Icon className="h-10 w-10 text-primary relative z-10" />
              </motion.div>

              {/* Title and Subtitle */}
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Step Indicator */}
              {stepNumber && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: index + 1 <= stepNumber ? 1 : 0.6 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      className={cn(
                        "h-2 w-2 rounded-full transition-all duration-300",
                        index + 1 <= stepNumber
                          ? "bg-primary w-8"
                          : "bg-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="max-w-lg mx-auto"
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

