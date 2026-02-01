'use client';

import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HERO } from '@/constants';
import { MouseEvent, useRef } from 'react';
import { FileText, Sparkles, Brain, Zap, LucideIcon } from 'lucide-react';

const RotatingIcon = ({ icon: Icon, delay, x, y, rotate, duration }: { icon: LucideIcon, delay: number, x: number[], y: number[], rotate: number[], duration: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.2, 1],
      x,
      y,
      rotate
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "linear",
      delay
    }}
    className="absolute text-primary/20 pointer-events-none z-0"
  >
    <Icon size={48} />
  </motion.div>
);

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Smooth spring animations for parallax effect
  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 150]), {
    stiffness: 100,
    damping: 30
  });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), {
    stiffness: 100,
    damping: 30
  });
  
  // Opacity fade on scroll
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  
  // Opacity for features and CTA on scroll
  const featuresOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [1, 1, 0.5]);
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8], [1, 1, 0.4]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-background pt-20"
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Floating Icons Background */}
      <RotatingIcon icon={Brain} delay={0} x={[0, 50, -50, 0]} y={[0, -50, 50, 0]} rotate={[0, 180, 360]} duration={12} />
      <RotatingIcon icon={Sparkles} delay={2} x={[100, 150, 50, 100]} y={[100, 50, 150, 100]} rotate={[360, 180, 0]} duration={14} />
      <RotatingIcon icon={FileText} delay={4} x={[-100, -150, -50, -100]} y={[-50, -100, 0, -50]} rotate={[0, -180, -360]} duration={13} />
      <RotatingIcon icon={Zap} delay={1} x={[200, 100, 200]} y={[-100, -200, -100]} rotate={[0, 90, 180]} duration={11} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">


          {/* Main Title with Gradient and Glow */}
          <motion.div
            style={{ y: y1, opacity, scale }}
            className="relative z-20"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8">
              <span className="block text-foreground drop-shadow-sm">
                {HERO.title.line1}
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-primary to-purple-400 bg-clip-text text-transparent pb-4 animate-gradient bg-300%">
                {HERO.title.line2}
              </span>
            </h1>
          </motion.div>

          {/* Description with Blur Reveal */}
          <motion.p
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ y: y2, opacity }}
            className="text-lg sm:text-xl lg:text-2xl text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed mb-12"
          >
            {HERO.description}
          </motion.p>

          {/* Features Grid - 3D Tilt Cards */}
          <motion.div 
            style={{ opacity: featuresOpacity }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {HERO.features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    rotateX: 5,
                    rotateY: 5,
                    backgroundColor: "rgba(var(--primary), 0.1)"
                  }}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-white/5 shadow-2xl transition-colors"
                >
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-sm">{feature.text}</span>
                </motion.div>
              )
            })}
          </motion.div>

          {/* CTA Buttons with Glow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ opacity: ctaOpacity }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button
              size="lg"
              asChild
              className="text-lg h-14 px-8 rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_40px_-10px_rgba(var(--primary),0.3)] hover:shadow-[0_0_60px_-15px_rgba(var(--primary),0.5)] transition-all duration-300"
            >
              <Link href={HERO.cta.primary.href}>
                {HERO.cta.primary.text}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg h-14 px-8 rounded-full border-primary/20 hover:bg-primary/5 hover:border-primary/40 backdrop-blur-sm transition-all"
            >
              <Link href={HERO.cta.secondary.href}>{HERO.cta.secondary.text}</Link>
            </Button>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
