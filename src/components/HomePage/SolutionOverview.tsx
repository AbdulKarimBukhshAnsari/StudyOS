'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SOLUTION_OVERVIEW } from '@/constants';

const MockDashboard = () => {
  return (
    <div className="relative w-full h-full rounded-2xl bg-[#0F1117] border border-white/5 p-6 shadow-2xl overflow-hidden">
      {/* Sidebar */}
      <div className="absolute left-6 top-24 bottom-6 w-16 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center py-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-8 h-8 rounded-lg bg-white/10" />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="ml-24 h-full flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/20" />
            <div className="h-8 w-8 rounded-full bg-white/5" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Study Hours', value: '24.5h', icon: Clock, change: '+12%' },
            { label: 'Tasks Done', value: '18', icon: CheckCircle2, change: '+5' },
            { label: 'Streak', value: '7 Days', icon: Zap, change: 'Running' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              className="bg-white/5 rounded-xl p-4 border border-white/5"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center">
                  <stat.icon size={12} className="text-primary-foreground" />
                </div>
              </div>
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-xs text-emerald-400 mt-1">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Chart Area */}
        <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
          {/* Bars */}
          <div className="absolute bottom-4 left-4 right-4 h-32 flex items-end justify-between gap-2">
            {[40, 65, 34, 78, 56, 89, 45, 67, 88, 43].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                transition={{ duration: 1, delay: 0.8 + (i * 0.05) }}
                className="w-full bg-primary/30 rounded-t-sm group-hover:bg-primary/50 transition-colors"
                style={{ borderRadius: '4px 4px 0 0' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Absolute overlay elements for depth */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-10 bg-[#1A1D26] p-4 rounded-xl border border-white/10 shadow-xl z-20"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold">Live Session</span>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1A1D26] bg-primary/20" />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export function SolutionOverview() {
  return (
    <section className="py-32 bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl sm:text-6xl font-bold mb-8 leading-tight">
                {SOLUTION_OVERVIEW.title}
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                {SOLUTION_OVERVIEW.description}
              </p>

              <div className="space-y-6 mb-10">
                {SOLUTION_OVERVIEW.benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <CheckCircle2 className="w-4 h-4 shrink-0 transition-colors" />
                    </div>
                    <span className="text-lg leading-relaxed">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button size="lg" asChild className="group text-lg px-8 h-14 rounded-full">
                  <Link href={SOLUTION_OVERVIEW.cta.href}>
                    {SOLUTION_OVERVIEW.cta.text}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right side - Visual representation */}
            <motion.div
              initial={{ opacity: 0, x: 30, rotateY: -10 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative perspective-1000"
            >
              <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl bg-gradient-to-tr from-white/5 to-white/0 p-2 backdrop-blur-sm border border-white/10 shadow-2xl transform transition-transform duration-500 hover:scale-[1.02]">
                <MockDashboard />
              </div>

              {/* Background Glow */}
              <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 rounded-full opacity-40" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
