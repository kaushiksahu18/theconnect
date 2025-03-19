"use client";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <motion.div
      animate={{
        background: [
          "linear-gradient(45deg, #0066cc, #00ccaa,#0066cc,#00ccaa,#0066cc,#00ccaa)",
          "linear-gradient(45deg, #00ccaa, #0066cc,#00ccaa,#0066cc,#00ccaa,#0066cc)",
          "linear-gradient(45deg, #0066cc, #00ccaa,#0066cc,#00ccaa,#0066cc,#00ccaa)",
        ],
      }}
      transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
      className="absolute inset-0 z-0 flex min-h-screen flex-col items-center justify-center text-center"
    >
      <div className="flex items-center">
        <h1 className="mr-5 inline-block border-r border-gray-300 pr-5 align-top text-2xl font-medium leading-none dark:border-gray-700 md:text-4xl">
          404
        </h1>
        <div className="inline-block">
          <h2 className="m-0 text-base font-normal leading-none md:text-xl">
            This page could not be found.
          </h2>
        </div>
      </div>
    </motion.div>
  );
}
