"use client";

import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { Shield, Lock, Zap, Users, Video, MessageSquare } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Peer-to-Peer Security",
    description:
      "Direct connection between users with no intermediary servers storing your data.",
  },
  {
    icon: Video,
    title: "HD Video Calls",
    description: "Crystal clear video quality for face-to-face conversations.",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "Your conversations are encrypted and completely private.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Low-latency connections for real-time communication.",
  },
  {
    icon: Users,
    title: "Group Calls",
    description: "Connect with multiple people simultaneously.",
  },
  {
    icon: MessageSquare,
    title: "Instant Messaging",
    description: "Send text messages alongside your calls.",
  },
];

export function Features() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="bg-black/50 py-24">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Features
          </h2>
          <p className="mt-4 text-gray-400 md:text-xl">
            Everything you need for secure and private communication
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center rounded-lg p-6 backdrop-blur-sm"
            >
              <div className="mb-4 rounded-full bg-[linear-gradient(45deg,#0066cc,#00ccaa,#0066cc)] p-3">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-center text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
