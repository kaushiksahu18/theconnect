"use client";

import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

export function Demo() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="bg-black/50 relative after:w-full after:h-[10vh] after:bg-black after:absolute after:bottom-[-5vh] after:[clip-path:ellipse(90%_90%_at_top)]"
    >
      <div className="container max-w-full relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            See It In Action
          </h2>
          <p className="mt-4 text-gray-400 md:text-xl">
            Experience the future of private communication
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative rounded-lg overflow-hidden shadow-2xl p-12"
        >
          <div className="aspect-video relative">
            <Image
              src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&h=800&q=80"
              alt="Video call demo"
              className="object-cover"
              fill
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-lg font-semibold">Live Demo</h3>
              <p className="text-sm text-gray-200">
                Experience crystal clear video calls with complete privacy
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
