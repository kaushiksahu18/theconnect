"use client";

import { motion, AnimatePresence, Transition, Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { TextScramble } from "@/components/ui/text-scramble";
import { cn } from "@/lib/utils";
import { Video, Voicemail, Send } from "lucide-react";

export const Hero = () => {
  const springOptions = { bounce: 0.1 };
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center"
    >
      <motion.div
        animate={{
          background: [
            "linear-gradient(45deg, #0066cc, #00ccaa,#0066cc,#00ccaa,#0066cc,#00ccaa)",
            "linear-gradient(45deg, #00ccaa, #0066cc,#00ccaa,#0066cc,#00ccaa,#0066cc)",
            "linear-gradient(45deg, #0066cc, #00ccaa,#0066cc,#00ccaa,#0066cc,#00ccaa)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 z-0 min-h-screen"
      />
      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6 text-4xl font-bold text-white md:text-6xl"
        >
          Private Peer-to-Peer
          <TextLoop transition={{ duration: 0.4 }} interval={2}>
            <span className="flex items-center gap-2">
              Voice Calls (alpha)
              <Voicemail className="h-10 w-10 md:h-14 md:w-14" />
            </span>
            <span className="flex items-center gap-2">
              Secure Chat <Send className="h-10 w-10 md:h-14 md:w-14" />
            </span>
            <span className="flex items-center gap-2">
              Video Call (alpha)
              <Video className="h-10 w-10 md:h-14 md:w-14" />
            </span>
            <span className="flex items-center gap-2">
              Secure Chat <Send className="h-10 w-10 md:h-14 md:w-14" />
            </span>
          </TextLoop>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-8 text-xl text-white md:text-2xl"
        >
          <TextScramble
            duration={1.0}
            speed={0.01}
            className="mb-8 text-base text-white md:text-2xl"
          >
            Experience secure communication with no data stored on servers.
          </TextScramble>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Magnetic
            intensity={0.2}
            springOptions={springOptions}
            actionArea="global"
            range={200}
          >
            <Link href="/lobby">
              <Button size="lg">
                <Magnetic
                  intensity={0.1}
                  springOptions={springOptions}
                  actionArea="global"
                  range={200}
                >
                  <span>TRY NOW</span>
                </Magnetic>
              </Button>
            </Link>
          </Magnetic>
        </motion.div>
      </div>
      <div className="absolute bottom-0 h-[10vh] w-full bg-black [clip-path:ellipse(90%_90%_at_bottom)]"></div>
    </motion.section>
  );
};

import { useState, useEffect, Children } from "react";

type TextLoopProps = {
  children: React.ReactNode[];
  className?: string;
  interval?: number;
  transition?: Transition;
  variants?: Variants;
  onIndexChange?: (index: number) => void;
};

export function TextLoop({
  children,
  className,
  interval = 2,
  transition = { duration: 0.3 },
  variants,
  onIndexChange,
}: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = Children.toArray(children);

  useEffect(() => {
    const intervalMs = interval * 1000;

    const timer = setInterval(() => {
      setCurrentIndex((current) => {
        const next = (current + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [items.length, interval, onIndexChange]);

  const motionVariants: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  return (
    <div className={cn("relative inline-block whitespace-nowrap", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentIndex}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          variants={variants || motionVariants}
        >
          {items[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

import { TextEffect } from "@/components/ui/text-effect";
import Link from "next/link";

export function TextEffectWithCustomVariants({
  className,
  delay,
  per,
}: {
  className?: string;
  delay?: number;
  per?: "word" | "char" | "line";
}) {
  const getRandomColor = () => {
    return "#fafafa";
    // const letters = "0123456789ABCDEF";
    // let color = "#";
    // for (let i = 0; i < 6; i++) {
    //   color += letters[Math.floor(Math.random() * 16)];
    // }
    // return color;
  };

  const fancyVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    },
    item: {
      hidden: () => ({
        opacity: 0,
        y: Math.random() * 100 - 50,
        rotate: Math.random() * 90 - 45,
        scale: 0.3,
        color: getRandomColor(),
      }),
      visible: {
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        color: getRandomColor(),
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 200,
        },
      },
    },
  };

  return (
    <Link href="/">
      <TextEffect
        per={per}
        variants={fancyVariants}
        className={className}
        delay={delay}
      >
        theConnect
      </TextEffect>
    </Link>
  );
}

export default Hero;
