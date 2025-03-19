"use client";

import { Hero, TextEffectWithCustomVariants } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Demo } from "@/components/sections/demo";
import { Testimonials } from "@/components/sections/testimonials";
// import { Footer } from "@/components/sections/footer";
import Link from "next/link";
import { ArrowBigUpDash } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  return (
    <main id="main-main" className="relative min-h-screen bg-black text-white">
      <TextEffectWithCustomVariants
        per="char"
        className="absolute left-4 top-4 z-[999] text-3xl md:left-10 md:top-10"
        delay={1}
      />
      <Hero />
      <Features />
      <Demo />
      <Testimonials />
      {/* <Footer /> */}
      <motion.div
        animate={{
          background: [
            "linear-gradient(45deg, #0066cc, #00ccaa,#0066cc,#00ccaa,#0066cc,#00ccaa)",
            "linear-gradient(45deg, #00ccaa, #0066cc,#00ccaa,#0066cc,#00ccaa,#0066cc)",
            "linear-gradient(45deg, #0066cc, #00ccaa,#0066cc,#00ccaa,#0066cc,#00ccaa)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        id="go-to-top"
        className="fixed bottom-4 left-4 z-[999] rounded-full border-b border-l border-white p-1 md:left-auto md:right-4 md:border-l-0 md:border-r md:p-2"
      >
        <Link href="#main-main">
          <ArrowBigUpDash className="h-8 w-8 text-white" />
        </Link>
      </motion.div>
    </main>
  );
}
