'use client';

import { motion, useInView } from 'framer-motion';
import { FEATURES } from '@/constants';
import { useRef } from 'react';
import { Sparkles } from 'lucide-react';

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  return (
    <section ref={containerRef} id="features" className="py-32 bg-background relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Powerful Features
          </motion.span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
            {FEATURES.title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {FEATURES.description}
          </p>
        </motion.div>

        {/* Features Grid - Uniform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {FEATURES.items.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                whileHover={{ 
                  scale: 1.02,
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group relative h-full min-h-[320px] flex flex-col rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-8 shadow-lg hover:shadow-xl hover:border-border transition-all duration-300"
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 dark:from-white/5" />
                
                {/* Subtle glow effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10 dark:from-white/5 dark:via-white/3 dark:to-white/5" />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center mb-6 
                      transition-all duration-300 group-hover:scale-110
                      ${feature.bgColor}
                    `}
                  >
                    <Icon className={`w-7 h-7 ${feature.color} transition-colors`} />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-3 tracking-tight transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm flex-1">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative bottom border */}
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div 
                      className="h-1 w-12 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                      style={{
                        background: feature.color.includes('blue') 
                          ? 'linear-gradient(to right, #3b82f6, transparent)'
                          : feature.color.includes('green')
                          ? 'linear-gradient(to right, #10b981, transparent)'
                          : feature.color.includes('purple')
                          ? 'linear-gradient(to right, #a855f7, transparent)'
                          : feature.color.includes('orange')
                          ? 'linear-gradient(to right, #f97316, transparent)'
                          : feature.color.includes('pink')
                          ? 'linear-gradient(to right, #ec4899, transparent)'
                          : 'linear-gradient(to right, #06b6d4, transparent)'
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
