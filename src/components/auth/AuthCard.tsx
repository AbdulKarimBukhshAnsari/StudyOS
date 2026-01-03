'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AuthCardProps {
  children: React.ReactNode;
  svgPath: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function AuthCard({ children, svgPath, title, subtitle, className }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.03),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.02),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.02),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'w-full max-w-5xl mx-auto',
          className
        )}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-border/50 backdrop-blur-sm"
        >
          <div className="grid md:grid-cols-2 min-h-[600px]">
            {/* Left side - Form */}
            <div className="flex flex-col justify-center p-8 md:p-12 bg-card">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-md mx-auto space-y-6"
              >
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-muted-foreground text-sm md:text-base">
                      {subtitle}
                    </p>
                  )}
                </div>
                {children}
              </motion.div>
            </div>

            {/* Right side - SVG Image */}
            <div className="hidden md:flex items-center justify-center p-8 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative z-10 w-full h-full max-w-md flex items-center justify-center"
              >
                <Image
                  src={svgPath}
                  alt={title}
                  className="w-full h-full object-contain"
                  width={500}
                  height={500}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

